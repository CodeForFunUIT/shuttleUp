# Phase 1: Backend — Types & Calculation Service

## Context

- [Plan Overview](plan.md)
- Files: `elo-calculation.types.ts`, `elo-calculation.service.ts`, `elo-calculation.service.spec.ts`

## Overview

- **Priority**: 🔴 High (Phase 2 depends on this)
- **Status**: ⬜ Not started

## Changes

### 1.1 `src/elo/types/elo-calculation.types.ts`

**Remove `score` from params, `scoreMultiplier` from results:**

```diff
 export interface SinglesMatchParams {
   eloA: number;
   eloB: number;
   winner: 'A' | 'B';
-  score: '2-0' | '2-1';
   totalGamesA: number;
   totalGamesB: number;
 }

 export interface SinglesResult {
   newEloA: number;
   newEloB: number;
   deltaA: number;
   deltaB: number;
   kFactor: number;
   expectedA: number;
   expectedB: number;
-  scoreMultiplier: number;
 }

 export interface DoublesMatchParams {
   ...
   winner: 'A' | 'B';
-  score: '2-0' | '2-1';
 }

 export interface DoublesResult {
   ...
   expectedA: number;
-  scoreMultiplier: number;
 }
```

### 1.2 `src/elo/services/elo-calculation.service.ts`

**Remove `getScoreMultiplier()` method. Simplify delta calculation:**

```diff
-  getScoreMultiplier(score: '2-0' | '2-1', isWinner: boolean): number {
-    if (score === '2-0') return isWinner ? 1.2 : 1.0;
-    return isWinner ? 1.0 : 0.85;
-  }

 // In calculateSingles():
-  const { eloA, eloB, winner, score, totalGamesA, totalGamesB } = params;
+  const { eloA, eloB, winner, totalGamesA, totalGamesB } = params;

-  const multiplierA = this.getScoreMultiplier(score, sA === 1);
-  const multiplierB = this.getScoreMultiplier(score, sB === 1);
-  const deltaA = Math.round(k * (sA - expectedA) * multiplierA);
-  const deltaB = Math.round(k * (sB - expectedB) * multiplierB);
+  const deltaA = Math.round(k * (sA - expectedA));
+  const deltaB = Math.round(k * (sB - expectedB));

 // Remove scoreMultiplier from return object

 // Same changes for calculateDoubles()
```

### 1.3 `src/elo/services/elo-calculation.service.spec.ts`

**Remove:**
- Entire `describe('getScoreMultiplier — spec §7')` block (lines 114-132)
- Test `'returns correct scoreMultiplier for winner 2-0'` (lines 246-256)

**Update:**
- All `calculateSingles` calls: remove `score` param
- All `calculateDoubles` base params: remove `score` param
- Update expected values (delta will change without multiplier)

## Todo

- [ ] Update `SinglesMatchParams` — remove `score`
- [ ] Update `SinglesResult` — remove `scoreMultiplier`
- [ ] Update `DoublesMatchParams` — remove `score`
- [ ] Update `DoublesResult` — remove `scoreMultiplier`
- [ ] Remove `getScoreMultiplier()` method
- [ ] Simplify `calculateSingles()` delta formula
- [ ] Simplify `calculateDoubles()` delta formula
- [ ] Update all tests — remove `score` params and multiplier assertions
- [ ] Run `npm run test` — all tests pass
