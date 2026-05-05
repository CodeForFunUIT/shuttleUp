# Phase 05 — Controller & Module

## Context Links
- Phase 02–04: services created
- Code standards: `docs/code-standards.md` (NestJS conventions)
- Sessions controller: `shuttleup-api/src/sessions/sessions.controller.ts` (pattern ref)

## Overview
- **Priority:** Medium
- **Status:** Pending
- Wire up `EloController`, `EloModule`, register in `AppModule`

## Key Insights
- Follow project pattern: controller thin → delegates fully to service
- All routes except leaderboard require `@UseGuards(AuthGuard)` + `@ApiBearerAuth()`
- Leaderboard is `@Public()` — anyone can see rankings
- Submit match: `POST /elo/sessions/:sessionId/result` — clearer URL than `POST /elo/matches`
- Match history is `@Public()` — profile visible to all
- Swagger `@ApiTags('ELO')` on controller class
- Module must export nothing externally — EloModule is self-contained

## API Routes Design

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/elo/sessions/:sessionId/result` | JWT | Host submits match result |
| GET | `/elo/matches/:id` | Public | Match detail + audit trail |
| GET | `/elo/leaderboard` | Public | Rankings `?gameType=singles&page=1&limit=20` |
| GET | `/elo/users/:userId` | Public | User ELO profile (all 3 game types) |
| GET | `/elo/users/:userId/history` | Public | Paginated match history |
| GET | `/elo/pairs/:userIdA/:userIdB` | Public | Pair synergy info `?gameType=singles` |

## Related Code Files
- **Create:** `shuttleup-api/src/elo/elo.controller.ts`
- **Create:** `shuttleup-api/src/elo/elo.module.ts`
- **Modify:** `shuttleup-api/src/app.module.ts` — import EloModule

## Implementation Steps

### Step 1 — Create `EloController`

**File:** `src/elo/elo.controller.ts`

```typescript
@ApiTags('ELO')
@Controller('elo')
export class EloController {
  constructor(
    private readonly eloMatch: EloMatchService,
    private readonly eloLeaderboard: EloLeaderboardService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit match result for a session (host only)' })
  @UseGuards(AuthGuard)
  @Post('sessions/:sessionId/result')
  submitResult(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitMatchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eloMatch.submitMatch(sessionId, dto, userId);
  }

  @Public()
  @ApiOperation({ summary: 'Get match detail with full audit trail' })
  @Get('matches/:id')
  getMatch(@Param('id') id: string) {
    return this.eloMatch.findMatch(id);
  }

  @Public()
  @ApiOperation({ summary: 'Get ELO leaderboard by game type' })
  @Get('leaderboard')
  getLeaderboard(
    @Query('gameType') gameType: GameType = GameType.SINGLES,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.eloLeaderboard.getLeaderboard(gameType, +page, +limit);
  }

  @Public()
  @ApiOperation({ summary: 'Get user ELO profile (all game types)' })
  @Get('users/:userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.eloLeaderboard.getUserProfile(userId);
  }

  @Public()
  @ApiOperation({ summary: 'Get user match history' })
  @Get('users/:userId/history')
  getUserHistory(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.eloMatch.getUserMatchHistory(userId, +page, +limit);
  }

  @Public()
  @ApiOperation({ summary: 'Get pair synergy info between two players' })
  @Get('pairs/:userIdA/:userIdB')
  getPairInfo(
    @Param('userIdA') userIdA: string,
    @Param('userIdB') userIdB: string,
    @Query('gameType') gameType: GameType = GameType.SINGLES,
  ) {
    return this.eloLeaderboard.getPairInfo(userIdA, userIdB, gameType);
  }
}
```

### Step 2 — Create `EloModule`

**File:** `src/elo/elo.module.ts`

```typescript
@Module({
  imports: [],
  controllers: [EloController],
  providers: [
    EloCalculationService,
    EloMatchService,
    EloLeaderboardService,
    PrismaService,  // inject directly (infrastructure service)
  ],
  exports: [],  // self-contained, no exports needed
})
export class EloModule {}
```

> Note: `PrismaService` is provided by `PrismaModule` which is global — no need to re-import. Remove `PrismaService` from providers, rely on global injection.

### Step 3 — Register in `AppModule`

```typescript
// In app.module.ts, add:
import { EloModule } from './elo/elo.module';

// In @Module imports array:
EloModule,
```

### Step 4 — Add `gameType` field to `CreateSessionDto`

```typescript
// In sessions/dto/session.dto.ts
@ApiPropertyOptional({ enum: GameType })
@IsOptional()
@IsEnum(GameType)
gameType?: GameType;
```

Update `SessionsService.create()` to save `gameType`:
```typescript
gameType: data.gameType ?? GameType.SINGLES,
```

## Todo List
- [ ] Create `src/elo/elo.controller.ts` with 6 endpoints
- [ ] Create `src/elo/elo.module.ts`
- [ ] Register `EloModule` in `app.module.ts`
- [ ] Add `gameType` to `CreateSessionDto` in sessions module
- [ ] Update `SessionsService.create()` to store `gameType`
- [ ] Run `npm run build` to verify compilation

## Success Criteria
- `npm run build` passes without errors
- Swagger UI (`/api`) shows ELO section with all 6 endpoints
- `POST /elo/sessions/:sessionId/result` returns 403 for non-host
- `GET /elo/leaderboard` returns without auth token

## Risk Assessment
- **Low:** Import circular dependency — EloModule only imports PrismaModule (global), no circular risk
