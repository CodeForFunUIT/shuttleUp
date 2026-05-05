# Phase 3: Frontend — Simulator & How-It-Works Components

## Context

- [Plan Overview](plan.md)
- **Independent** of Phase 1-2 (frontend mirrors logic, doesn't call API)
- Files: `belo-simulator.tsx`, `belo-how-it-works.tsx`

## Overview

- **Priority**: 🟡 Medium
- **Status**: ⬜ Not started

## Changes

### 3.1 `src/components/belo/belo-simulator.tsx`

**Remove:**
- `getScoreMultiplier()` function (lines 26-30)
- `scoreMultiplier` from `SimResult` interface (line 49)
- `score` state variable (`useState("2-0")`)
- Score multiplier calc in `simulateSingles()` (lines 70-71, 73-74)
- Score selector UI (lines 221-232)
- Score Multiplier display in result panel (lines 302-305)

**Simplify `simulateSingles()`:**
- Remove `score` param
- Delta = `Math.round(k * (sA - expectedA))` (no multiplier)

**Update `handleSimulate` callback:**
- Remove `score` from dependency array

**Update `handleReset`:**
- Remove `setScore("2-0")`

### 3.2 `src/components/belo/belo-how-it-works.tsx`

**Remove the Score Multiplier card from `steps` array (index 2):**

```diff
 const steps = [
   { icon: Calculator, title: "Xác suất thắng kỳ vọng", ... },
   { icon: Gauge, title: "K-Factor theo kinh nghiệm", ... },
-  { icon: Scale, title: "Score Multiplier", ... },
   { icon: BarChart3, title: "Carry Weight (Đôi)", ... },
 ];
```

**Remove `Scale` from lucide-react imports.**

**Update subtitle text:**
```diff
-  Công thức ELO mở rộng với K-factor, Score Multiplier, và Carry Weight
+  Công thức ELO mở rộng với K-factor và Carry Weight
```

## Todo

- [ ] Remove `getScoreMultiplier()` function from simulator
- [ ] Remove `scoreMultiplier` from `SimResult`
- [ ] Remove `score` state and its setter
- [ ] Simplify `simulateSingles()` — no multiplier
- [ ] Remove Score selector from UI
- [ ] Remove Score Multiplier from result display
- [ ] Remove Score Multiplier card from How-It-Works
- [ ] Remove unused `Scale` import
- [ ] Run `npm run lint` on web
