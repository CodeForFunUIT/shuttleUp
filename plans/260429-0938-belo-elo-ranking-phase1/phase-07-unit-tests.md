# Phase 07 — Unit Tests

## Context Links
- Phase 02: `EloCalculationService`
- Phase 03: `EloMatchService`
- Test pattern: `shuttleup-api/src/sessions/sessions.service.spec.ts`
- Code standards: `docs/code-standards.md` (Mock pattern section)

## Overview
- **Priority:** High
- **Status:** Pending
- `EloCalculationService` — 100% coverage (pure functions, no mocks needed)
- `EloMatchService` — mock Prisma + EloCalculationService, test business logic
- `EloLeaderboardService` — mock Prisma, test pagination + tier assignment

## Key Insights
- `EloCalculationService` has zero deps → no TestingModule needed, instantiate directly
- Mock Prisma with class-token pattern: `{ provide: PrismaService, useValue: mockPrisma }`
- Test all spec examples explicitly:
  - §2: A=1400, B=1200 → E(A)≈0.76
  - §5.2: A=1600, B=1000 → wStrong=0.35, wWeak=0.65
  - §4: 20 games together → synergy=15
  - §6: K selection (min of all players)
  - §7: score multiplier table
  - §11.2: ELO floor at 100

## Related Code Files
- **Create:** `shuttleup-api/src/elo/services/elo-calculation.service.spec.ts`
- **Create:** `shuttleup-api/src/elo/services/elo-match.service.spec.ts`
- **Create:** `shuttleup-api/src/elo/services/elo-leaderboard.service.spec.ts`

## Implementation Steps

### Step 1 — `EloCalculationService` spec (pure functions)

**File:** `src/elo/services/elo-calculation.service.spec.ts`

```typescript
describe('EloCalculationService', () => {
  let service: EloCalculationService;

  beforeEach(() => { service = new EloCalculationService(); });

  describe('getKFactor', () => {
    it('returns 32 for < 20 games', () => expect(service.getKFactor(0)).toBe(32));
    it('returns 32 for 19 games', () => expect(service.getKFactor(19)).toBe(32));
    it('returns 24 for 20 games', () => expect(service.getKFactor(20)).toBe(24));
    it('returns 24 for 99 games', () => expect(service.getKFactor(99)).toBe(24));
    it('returns 16 for 100 games', () => expect(service.getKFactor(100)).toBe(16));
  });

  describe('getSynergyBonus', () => {
    it('returns 0 for 0 games', () => expect(service.getSynergyBonus(0)).toBe(0));
    it('returns 0 for 4 games', () => expect(service.getSynergyBonus(4)).toBe(0));
    it('returns 5 for 5 games', () => expect(service.getSynergyBonus(5)).toBe(5));
    it('returns 10 for 10 games', () => expect(service.getSynergyBonus(10)).toBe(10));
    it('returns 15 for 20+ games', () => expect(service.getSynergyBonus(20)).toBe(15));
    it('returns 15 for 100 games', () => expect(service.getSynergyBonus(100)).toBe(15));
  });

  describe('getCarryWeights — spec §5.2 examples', () => {
    it('equal ELO → 50/50 split', () => {
      const [wA, wB] = service.getCarryWeights(1200, 1200);
      expect(wA).toBeCloseTo(0.5); expect(wB).toBeCloseTo(0.5);
    });
    it('A=1600, B=1000 → wStrong=0.35, wWeak=0.65', () => {
      const [wA, wB] = service.getCarryWeights(1600, 1000);
      expect(wA).toBeCloseTo(0.35); expect(wB).toBeCloseTo(0.65);
    });
    it('A=1000, B=1600 → wA=0.65 (weak), wB=0.35 (strong)', () => {
      const [wA, wB] = service.getCarryWeights(1000, 1600);
      expect(wA).toBeCloseTo(0.65); expect(wB).toBeCloseTo(0.35);
    });
    it('minimum weight is 0.35 for extreme gap', () => {
      const [wB] = service.getCarryWeights(1000, 3000);  // [wA_weak, wB_strong]
      expect(wB[1]).toBeGreaterThanOrEqual(0.35);
    });
  });

  describe('getScoreMultiplier', () => {
    it('winner 2-0 → ×1.2', () => expect(service.getScoreMultiplier('2-0', true)).toBe(1.2));
    it('winner 2-1 → ×1.0', () => expect(service.getScoreMultiplier('2-1', true)).toBe(1.0));
    it('loser 2-0 → ×1.0', () => expect(service.getScoreMultiplier('2-0', false)).toBe(1.0));
    it('loser 2-1 → ×0.85', () => expect(service.getScoreMultiplier('2-1', false)).toBe(0.85));
  });

  describe('getMismatchLevel', () => {
    it('≤200 → none', () => expect(service.getMismatchLevel(200)).toBe('none'));
    it('201 → warning', () => expect(service.getMismatchLevel(201)).toBe('warning'));
    it('400 → warning', () => expect(service.getMismatchLevel(400)).toBe('warning'));
    it('401 → danger', () => expect(service.getMismatchLevel(401)).toBe('danger'));
  });

  describe('getTier', () => {
    it('≥2000 → diamond', () => expect(service.getTier(2000)).toBe('diamond'));
    it('1700 → gold', () => expect(service.getTier(1700)).toBe('gold'));
    it('1100 → bronze', () => expect(service.getTier(1100)).toBe('bronze'));
    it('799 → beginner', () => expect(service.getTier(799)).toBe('beginner'));
  });

  describe('calculateSingles — spec §2 example', () => {
    it('A=1400, B=1200, A wins 2-1 → E(A)≈0.76', () => {
      const result = service.calculateSingles({
        eloA: 1400, eloB: 1200, winner: 'A', score: '2-1',
        totalGamesA: 50, totalGamesB: 50,
      });
      expect(result.expectedA).toBeCloseTo(0.76, 1);
      expect(result.newEloA).toBeGreaterThan(1400);
      expect(result.newEloB).toBeLessThan(1200);
    });

    it('ELO floor: loser never drops below 100', () => {
      const result = service.calculateSingles({
        eloA: 100, eloB: 2000, winner: 'B', score: '2-0',
        totalGamesA: 5, totalGamesB: 5,
      });
      expect(result.newEloA).toBeGreaterThanOrEqual(100);
    });

    it('K selection uses minimum (veteran vs newbie)', () => {
      // totalGamesA=5 (K=32), totalGamesB=150 (K=16) → k=16
      const result = service.calculateSingles({
        eloA: 1200, eloB: 1200, winner: 'A', score: '2-1',
        totalGamesA: 5, totalGamesB: 150,
      });
      expect(result.kFactor).toBe(16);
    });
  });

  describe('calculateDoubles', () => {
    it('synergy bonus included in pair rating calculation', () => {
      const result = service.calculateDoubles({
        eloA1: 1200, eloA2: 1200, totalGamesA1: 50, totalGamesA2: 50, gamesA1A2Together: 20,
        eloB1: 1200, eloB2: 1200, totalGamesB1: 50, totalGamesB2: 50, gamesB1B2Together: 0,
        winner: 'A', score: '2-0',
      });
      expect(result.synergyBonusA).toBe(15);
      expect(result.synergyBonusB).toBe(0);
      // Team A has synergy advantage → should win more ELO
      expect(result.playerA1.delta).toBeGreaterThan(0);
    });
  });
});
```

### Step 2 — `EloMatchService` spec (business logic with mocks)

**File:** `src/elo/services/elo-match.service.spec.ts`

Key test cases:
- `submitMatch` → success flow returns created match
- `submitMatch` → throws `ForbiddenException` if not host
- `submitMatch` → throws `ConflictException` if session already has EloMatch
- `submitMatch` → throws `BadRequestException` for wrong team size (singles with 2 players)
- `submitMatch` → throws `BadRequestException` for duplicate player IDs
- `submitMatch` → calls `prisma.$transaction` with correct data
- `findMatch` → throws `NotFoundException` if not found

### Step 3 — Run tests

```bash
cd shuttleup-api
npx jest --testPathPattern=elo --coverage
```

Expected: 100% coverage on `EloCalculationService`, ~80%+ on `EloMatchService`.

## Todo List
- [ ] Create `elo-calculation.service.spec.ts` with all spec examples
- [ ] Create `elo-match.service.spec.ts` with business logic tests
- [ ] Create `elo-leaderboard.service.spec.ts` (pagination, tier, calibrating filter)
- [ ] Run `npx jest --testPathPattern=elo --coverage`
- [ ] All tests pass — no skips

## Success Criteria
- 100% statement coverage on `EloCalculationService`
- All spec numerical examples verified as passing tests
- `EloMatchService` host authorization tested
- `EloMatchService` duplicate submission guard tested
- Zero failing tests

## Risk Assessment
- **Low:** Floating point in `calculateSingles` assertions — use `toBeCloseTo()` not `toBe()`
- **Low:** `prisma.$transaction` mock — mock as `jest.fn().mockImplementation(fn => fn(mockTx))`
