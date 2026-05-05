# Phase 06 — Session Integration & ELO Seeding

## Context Links
- Phase 01: schema
- Phase 03: EloMatchService (event listener target)
- App module: `shuttleup-api/src/app.module.ts` (EventEmitter already registered)
- Sessions service: `shuttleup-api/src/sessions/sessions.service.ts`

## Overview
- **Priority:** Medium
- **Status:** Pending
- Two integration points:
  1. **User registration** → seed `UserEloRating` (1000 ELO × 3 game types)
  2. **Session completed** → emit `session.completed` event (optional notification hook)

## Key Insights
- `UserEloRating` must be initialized for every registered user at account creation
  - Without this, first ELO submission needs to upsert — already handled in `EloMatchService.loadOrInitEloRatings()`
  - BUT proactive seeding on user creation is cleaner and avoids DB lookups on first match
- Event: listen for `user.created` from auth flow OR hook into `UsersService`
- Sessions: no event needed in Phase 1 — host navigates manually to submit. `session.completed` is Phase 2.
- `CourtSession` needs `gameType` field (done in Phase 1 schema + Phase 5 DTO)

## Requirements

### Functional
- On `user.created` event (or at user registration): upsert 3 `UserEloRating` rows (singles, doubles, mixed), all at ELO 1000
- Backfill existing users (migration script or on-demand upsert in `loadOrInitEloRatings`)

## Related Code Files
- **Create:** `shuttleup-api/src/elo/services/elo-seed.service.ts` (listener for user.created)
- **Modify:** `shuttleup-api/src/auth/auth.service.ts` — emit `user.created` after registration
- **Check:** `shuttleup-api/src/common/events/` — create `elo.events.ts` for typed events

## Implementation Steps

### Step 1 — Create typed ELO events

**File:** `src/common/events/elo.events.ts`

```typescript
export class UserCreatedEvent {
  constructor(public readonly userId: string) {}
}

export class EloMatchConfirmedEvent {
  constructor(
    public readonly matchId: string,
    public readonly participantIds: string[],
  ) {}
}
```

### Step 2 — Emit `user.created` from AuthService

Check `src/auth/auth.service.ts` — after user registration success:

```typescript
// In auth.service.ts, after creating user:
this.eventEmitter.emit('user.created', new UserCreatedEvent(newUser.id));
```

> Note: Check if Better Auth has a hook/callback on user creation. If yes, use that hook instead of modifying AuthService.

### Step 3 — Create `EloSeedService` (listener)

**File:** `src/elo/services/elo-seed.service.ts`

```typescript
@Injectable()
export class EloSeedService {
  constructor(private prisma: PrismaService) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const gameTypes = [GameType.SINGLES, GameType.DOUBLES, GameType.MIXED];

    await this.prisma.$transaction(
      gameTypes.map((gameType) =>
        this.prisma.userEloRating.upsert({
          where: { userId_gameType: { userId: event.userId, gameType } },
          create: { userId: event.userId, gameType, eloScore: 1000, totalGames: 0, isCalibrating: true },
          update: {},  // no-op if already exists
        }),
      ),
    );
  }
}
```

### Step 4 — Add `EloSeedService` to `EloModule`

```typescript
providers: [
  EloCalculationService,
  EloMatchService,
  EloLeaderboardService,
  EloSeedService,  // Add this
],
```

### Step 5 — Backfill existing users (one-time migration)

Option A: Prisma seed script
```typescript
// prisma/seed.ts — add after existing seed:
const users = await prisma.user.findMany({ select: { id: true } });
for (const user of users) {
  for (const gameType of ['singles', 'doubles', 'mixed']) {
    await prisma.userEloRating.upsert({
      where: { userId_gameType: { userId: user.id, gameType } },
      create: { userId: user.id, gameType, eloScore: 1000 },
      update: {},
    });
  }
}
```

Option B: `EloMatchService.loadOrInitEloRatings()` handles on-demand (already planned in Phase 3) — acceptable for MVP, no seed needed.

**Recommendation: Use Option B (lazy init) for MVP.** `EloSeedService` handles new users going forward. Existing users get initialized on first match submission.

## Todo List
- [ ] Create `src/common/events/elo.events.ts`
- [ ] Create `src/elo/services/elo-seed.service.ts`
- [ ] Emit `user.created` event from auth flow (check Better Auth hooks first)
- [ ] Add `EloSeedService` to `EloModule` providers
- [ ] Test: register new user → verify 3 `UserEloRating` rows created
- [ ] Compile check

## Success Criteria
- New user registration → 3 `UserEloRating` rows created (ELO 1000, isCalibrating: true)
- Existing users get ratings initialized lazily on first match submission
- `user.created` event emitted correctly from auth flow

## Risk Assessment
- **Medium:** Better Auth may not expose a user creation hook easily — may need to wrap registration endpoint or use Prisma middleware
- **Low:** Duplicate seeding — `upsert` with `update: {}` is idempotent
