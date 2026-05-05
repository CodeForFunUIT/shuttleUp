# Phase 1: Extract Calc Engine

## Context

- [Existing simulator](file:///d:/portfolio/shuttleUp/shuttleup-web/src/components/belo/belo-simulator.tsx) — lines 18-74 contain pure calc functions
- [Backend service](file:///d:/portfolio/shuttleUp/shuttleup-api/src/elo/services/elo-calculation.service.ts) — reference implementation

## Overview

- **Priority:** High (blocker for Phase 2)
- **Status:** ⬜ Planned

Extract pure ELO calculation functions into a shared module so both the existing dashboard simulator and the new homepage simulator use the same engine.

## Key Insights

- Backend has `calculateSingles()` and `calculateDoubles()` with full synergy + carry weight
- Frontend simulator only has `simulateSingles()` — need to add `simulateDoubles()`
- `getTierInfo()` and `getKFactor()` are utility functions reusable across all components
- Mixed mode uses the same calculation as Doubles (only UI labels differ)

## Related Code Files

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/components/belo/belo-calc-engine.ts` | Shared pure calc functions |
| MODIFY | `src/components/belo/belo-simulator.tsx` | Update imports to use shared engine |

## Implementation Steps

### 1. Create `belo-calc-engine.ts` (~80 lines)

Extract + add:

```typescript
// From existing belo-simulator.tsx (move, don't duplicate):
export function getKFactor(totalGames: number): number
export function getTierInfo(elo: number): TierInfo
export function simulateSingles(params): SinglesSimResult

// NEW — mirror backend calculateDoubles():
export function simulateDoubles(params): DoublesSimResult
// - Compute synergy bonus for each pair
// - Compute pair ratings
// - K = min of all 4 players
// - Expected score from pair ratings
// - Total delta per team
// - Split by carry weights
// - Return per-player deltas, new ELOs, carry weights, synergy

// NEW — utility:
export function getSynergyBonus(gamesTogether: number): number
export function getCarryWeights(eloA: number, eloB: number): [number, number]
```

### 2. Update existing `belo-simulator.tsx`

- Remove inline `getKFactor`, `getTierInfo`, `simulateSingles` functions (lines 20-74)
- Import from `./belo-calc-engine`
- Keep all UI/state logic unchanged

## Todo List

- [ ] Create `belo-calc-engine.ts` with all exported functions
- [ ] Add `simulateDoubles()` mirroring backend logic
- [ ] Update `belo-simulator.tsx` imports
- [ ] Verify existing dashboard BELo page still works

## Success Criteria

- Shared engine file exists with Singles + Doubles + utility functions
- Existing dashboard simulator unchanged visually
- All functions match backend calculation logic exactly
- File under 100 lines
