# Phase 03 — ELO Match Service

## Context Links
- Phase 01: `phase-01-schema-and-enums.md`
- Phase 02: `phase-02-elo-calculation-service.md`
- Spec §12.3 (processing order): `plans/260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md`
- Sessions service: `shuttleup-api/src/sessions/sessions.service.ts`

## Overview
- **Priority:** High
- **Status:** Pending
- Orchestrates match submission: validate → calculate → persist → emit event
- Follows spec §12.3 processing order exactly

## Key Insights
- `EloMatchService` is the only service with DB writes for ELO
- Must use `prisma.$transaction([...])` for atomic ELO update + participant insert + synergy update
- Host authorization: verify `session.hostId === currentUserId` before accepting submission
- Guest users (`isAnonymous=true`) should NOT have ELO → validate all participants are registered users
- Synergy key normalization: `playerIdA = min(idA, idB)` lexicographically (string comparison)
- Singles: 2 players (teamA has 1, teamB has 1) — carry weight = 1.0 (no split needed)
- `UserEloRating` must be upserted (create on first game, update on subsequent)

## Requirements

### Functional
- `submitMatch(sessionId, dto, hostId)` — main entry point, validates + calculates + persists
- `findMatch(id)` — returns match with participants and audit trail
- `getUserMatchHistory(userId, page)` — paginated match history for a player
- `getPairSynergy(userIdA, userIdB, gameType)` — returns synergy info between two players

### Input DTO: `SubmitMatchDto`
```
- sessionId: string (FK validation)
- gameType: GameType
- score: '2-0' | '2-1'
- teamA: string[]   // player IDs (1 for singles, 2 for doubles)
- teamB: string[]   // player IDs (1 for singles, 2 for doubles)
- winner: 'A' | 'B'
- playedAt: ISO string (optional, defaults to now)
```

### Processing Order (per spec §12.3)
1. Validate input (all player IDs unique, correct team size, no duplicate submission for session)
2. Verify host authorization
3. Load `UserEloRating` for all players (upsert if missing — first-time player)
4. Load `PairSynergy` for doubles pairs
5. Determine K-factor
6. Calculate via `EloCalculationService`
7. Persist in transaction:
   - Create `EloMatch`
   - Create `EloMatchParticipant` per player
   - Update `UserEloRating` (eloScore, totalGames, isCalibrating)
   - Upsert `PairSynergy` (+1 gamesTogether)
8. Emit `elo.match.confirmed` event (for notifications, Phase 2)

## Related Code Files
- **Create:** `shuttleup-api/src/elo/services/elo-match.service.ts`
- **Create:** `shuttleup-api/src/elo/dto/submit-match.dto.ts`
- **Create:** `shuttleup-api/src/elo/services/elo-match.service.spec.ts`
- **Read:** `shuttleup-api/src/sessions/sessions.service.ts` (pattern reference)

## Implementation Steps

### Step 1 — Create `SubmitMatchDto`

**File:** `src/elo/dto/submit-match.dto.ts`

```typescript
import { IsString, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsIn, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameType } from '../../common/constants/enums';

export class SubmitMatchDto {
  @ApiProperty({ enum: GameType })
  @IsEnum(GameType)
  gameType: GameType;

  @ApiProperty({ example: '2-0', enum: ['2-0', '2-1'] })
  @IsIn(['2-0', '2-1'])
  score: '2-0' | '2-1';

  @ApiProperty({ example: ['userId1'], description: '1 player (singles) or 2 players (doubles)' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teamA: string[];

  @ApiProperty({ example: ['userId2'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teamB: string[];

  @ApiProperty({ enum: ['A', 'B'] })
  @IsIn(['A', 'B'])
  winner: 'A' | 'B';

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  playedAt?: string;
}
```

### Step 2 — Create `EloMatchService`

**File:** `src/elo/services/elo-match.service.ts`

Key methods:

```typescript
@Injectable()
export class EloMatchService {
  constructor(
    private prisma: PrismaService,
    private eloCalc: EloCalculationService,
    private eventEmitter: EventEmitter2,
  ) {}

  async submitMatch(sessionId: string, dto: SubmitMatchDto, hostId: string): Promise<EloMatch> {
    // 1. Validate session exists + host authorization
    const session = await this.prisma.courtSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session not found');
    if (session.hostId !== hostId) throw new ForbiddenException('Only host can submit match result');
    if (session.gameType !== dto.gameType) throw new BadRequestException('Game type must match session game type');

    // Check not already submitted
    const existing = await this.prisma.eloMatch.findUnique({ where: { sessionId } });
    if (existing) throw new ConflictException('Match result already submitted for this session');

    // 2. Validate team sizes match game type
    this.validateTeamSizes(dto);

    // 3. Load ELO ratings (upsert if not exists)
    const allPlayerIds = [...dto.teamA, ...dto.teamB];
    const ratings = await this.loadOrInitEloRatings(allPlayerIds, dto.gameType);

    // 4. Load pair synergy (doubles only)
    let synergyA = 0, synergyB = 0;
    if (dto.gameType !== GameType.SINGLES) {
      synergyA = await this.getSynergyCount(dto.teamA[0], dto.teamA[1], dto.gameType);
      synergyB = await this.getSynergyCount(dto.teamB[0], dto.teamB[1], dto.gameType);
    }

    // 5-6. Calculate ELO
    const calcResult = this.runCalculation(dto, ratings, synergyA, synergyB);

    // 7. Persist atomically
    const match = await this.persistMatchTransaction(sessionId, dto, calcResult, ratings);

    // 8. Emit event
    this.eventEmitter.emit('elo.match.confirmed', { matchId: match.id });

    return match;
  }

  async findMatch(id: string) { ... }
  async getUserMatchHistory(userId: string, page: number, limit: number) { ... }
  async getPairSynergy(userIdA: string, userIdB: string, gameType: GameType) { ... }

  private validateTeamSizes(dto: SubmitMatchDto): void {
    const expectedSize = dto.gameType === GameType.SINGLES ? 1 : 2;
    if (dto.teamA.length !== expectedSize || dto.teamB.length !== expectedSize) {
      throw new BadRequestException(`${dto.gameType} requires ${expectedSize} player(s) per team`);
    }
    const allIds = [...dto.teamA, ...dto.teamB];
    if (new Set(allIds).size !== allIds.length) {
      throw new BadRequestException('Duplicate player IDs detected');
    }
    // Mixed: validate 1 male + 1 female per team — deferred (no gender field in User yet)
  }

  private normalizePairKey(idA: string, idB: string): [string, string] {
    return idA < idB ? [idA, idB] : [idB, idA];
  }
}
```

### Step 3 — Transaction block structure

```typescript
private async persistMatchTransaction(sessionId, dto, calcResult, ratings) {
  return this.prisma.$transaction(async (tx) => {
    // Create EloMatch
    const match = await tx.eloMatch.create({ data: { sessionId, gameType: dto.gameType, score: dto.score, status: 'CONFIRMED', playedAt: dto.playedAt ? new Date(dto.playedAt) : new Date() } });

    // Create EloMatchParticipants for each player
    for (const pResult of calcResult.participants) {
      await tx.eloMatchParticipant.create({ data: { matchId: match.id, ...pResult } });
    }

    // Update UserEloRating for each player
    for (const pResult of calcResult.participants) {
      const newTotalGames = ratings[pResult.userId].totalGames + 1;
      await tx.userEloRating.update({
        where: { userId_gameType: { userId: pResult.userId, gameType: dto.gameType } },
        data: {
          eloScore: pResult.newElo,
          totalGames: newTotalGames,
          isCalibrating: newTotalGames < 5,
        },
      });
    }

    // Upsert PairSynergy (doubles only)
    if (dto.gameType !== GameType.SINGLES) {
      for (const pair of [[dto.teamA[0], dto.teamA[1]], [dto.teamB[0], dto.teamB[1]]]) {
        const [pA, pB] = this.normalizePairKey(pair[0], pair[1]);
        await tx.pairSynergy.upsert({
          where: { playerIdA_playerIdB_gameType: { playerIdA: pA, playerIdB: pB, gameType: dto.gameType } },
          create: { playerIdA: pA, playerIdB: pB, gameType: dto.gameType, gamesTogether: 1 },
          update: { gamesTogether: { increment: 1 } },
        });
      }
    }

    return match;
  });
}
```

## Todo List
- [ ] Create `src/elo/dto/submit-match.dto.ts`
- [ ] Create `src/elo/services/elo-match.service.ts`
  - [ ] `submitMatch()` with full processing order
  - [ ] `findMatch()` with participants include
  - [ ] `getUserMatchHistory()` with pagination
  - [ ] `getPairSynergy()` query
  - [ ] `validateTeamSizes()` private helper
  - [ ] `loadOrInitEloRatings()` private helper
  - [ ] `persistMatchTransaction()` private helper
  - [ ] `normalizePairKey()` private helper
- [ ] Write unit tests (see Phase 7)
- [ ] Compile check

## Success Criteria
- `submitMatch` returns complete `EloMatch` with participants
- Duplicate submission for same session throws `ConflictException`
- Non-host submission throws `ForbiddenException`
- Wrong team size throws `BadRequestException`
- Transaction atomicity: if participant insert fails, EloMatch is rolled back
- `PairSynergy.gamesTogether` increments correctly after each doubles match

## Risk Assessment
- **Medium:** `prisma.$transaction` performance — 4-8 DB ops per match, acceptable for MVP
- **Low:** Mixed gender validation deferred — no `gender` field on User yet, add later
