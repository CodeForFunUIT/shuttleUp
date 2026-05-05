# Phase 04 — Leaderboard Service

## Context Links
- Phase 01: `phase-01-schema-and-enums.md`
- Spec §8 (Tiers), §9.2 (Calibrating): `plans/260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md`

## Overview
- **Priority:** Medium
- **Status:** Pending
- Read-only service for rankings, user ELO profiles, pair synergy info

## Key Insights
- Leaderboard excludes `isCalibrating=true` users (< 5 games) — show only settled ELO
- `@@index([gameType, eloScore(sort: Desc)])` — use `orderBy: { eloScore: 'desc' }` + `where: { gameType, isCalibrating: false }`
- Tier is computed at query time (not stored) using `getTier()` from `EloCalculationService`
- Mismatch level exposed in pair info endpoint — useful for frontend warnings
- Profile endpoint: return all 3 game type ratings for a user in one query

## Requirements

### Functional
- `getLeaderboard(gameType, page, limit)` — paginated rankings, calibrating users excluded
- `getUserProfile(userId)` — returns all 3 ELO ratings + tier for each
- `getUserMatchHistory(userId, page, limit)` — delegated to EloMatchService
- `getPairInfo(userIdA, userIdB, gameType)` — synergy + mismatch level

## Related Code Files
- **Create:** `shuttleup-api/src/elo/services/elo-leaderboard.service.ts`

## Implementation Steps

### Step 1 — Create `EloLeaderboardService`

**File:** `src/elo/services/elo-leaderboard.service.ts`

```typescript
@Injectable()
export class EloLeaderboardService {
  constructor(
    private prisma: PrismaService,
    private eloCalc: EloCalculationService,
  ) {}

  async getLeaderboard(gameType: GameType, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, ratings] = await Promise.all([
      this.prisma.userEloRating.count({ where: { gameType, isCalibrating: false } }),
      this.prisma.userEloRating.findMany({
        where: { gameType, isCalibrating: false },
        orderBy: { eloScore: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: ratings.map((r, idx) => ({
        rank: skip + idx + 1,
        userId: r.userId,
        user: r.user,
        eloScore: r.eloScore,
        totalGames: r.totalGames,
        tier: this.eloCalc.getTier(r.eloScore),
        gameType: r.gameType,
      })),
    };
  }

  async getUserProfile(userId: string) {
    const ratings = await this.prisma.userEloRating.findMany({
      where: { userId },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true, skillLevel: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const profile = ratings.map((r) => ({
      gameType: r.gameType,
      eloScore: r.eloScore,
      totalGames: r.totalGames,
      isCalibrating: r.isCalibrating,
      tier: r.isCalibrating ? null : this.eloCalc.getTier(r.eloScore),
    }));

    return { user, eloProfile: profile };
  }

  async getPairInfo(userIdA: string, userIdB: string, gameType: GameType) {
    const [normA, normB] = userIdA < userIdB ? [userIdA, userIdB] : [userIdB, userIdA];

    const [synergy, ratingA, ratingB] = await Promise.all([
      this.prisma.pairSynergy.findUnique({
        where: { playerIdA_playerIdB_gameType: { playerIdA: normA, playerIdB: normB, gameType } },
      }),
      this.prisma.userEloRating.findUnique({ where: { userId_gameType: { userId: userIdA, gameType } } }),
      this.prisma.userEloRating.findUnique({ where: { userId_gameType: { userId: userIdB, gameType } } }),
    ]);

    const eloDiff = ratingA && ratingB ? Math.abs(ratingA.eloScore - ratingB.eloScore) : 0;

    return {
      gamesTogether: synergy?.gamesTogether ?? 0,
      synergyBonus: this.eloCalc.getSynergyBonus(synergy?.gamesTogether ?? 0),
      mismatchLevel: this.eloCalc.getMismatchLevel(eloDiff),
      eloDiff,
      ratingA: ratingA?.eloScore ?? 1000,
      ratingB: ratingB?.eloScore ?? 1000,
    };
  }
}
```

## Todo List
- [ ] Create `src/elo/services/elo-leaderboard.service.ts`
  - [ ] `getLeaderboard()` with pagination + tier
  - [ ] `getUserProfile()` — all 3 game types
  - [ ] `getPairInfo()` — synergy + mismatch
- [ ] Compile check

## Success Criteria
- `getLeaderboard` returns sorted users with rank and tier
- Calibrating users (< 5 games) excluded from leaderboard
- `getUserProfile` returns all 3 game type ratings in one call
- `getPairInfo` shows correct synergy bonus and mismatch level

## Risk Assessment
- **Low:** Performance — `@@index([gameType, eloScore])` handles MVP scale
- **Low:** Calibrating users appearing in public leaderboard — `where: { isCalibrating: false }` covers this
