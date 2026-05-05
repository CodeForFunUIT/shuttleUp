# Phase 02 — ELO Calculation Service

## Context Links
- Spec math: `plans/260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md`
- Brainstorm: `plans/reports/brainstormer-260429-0931-belo-elo-ranking-system.md`

## Overview
- **Priority:** High (core math, blocks Phase 3)
- **Status:** Pending
- Pure stateless service — no DB, no Prisma. 100% unit testable.

## Key Insights
- `EloCalculationService` must have ZERO external dependencies — no Prisma, no EventEmitter
- K-factor rule: use `min(k_all_players)` — protects veterans from big swings
- Doubles K = min across ALL 4 players
- Carry weight: `weight_strong = max(0.35, 0.50 - gap * 0.15)` where `gap = |R_A - R_B| / 400`
- Score multiplier for **loser**: winner 2-0 → loser uses `1.0` (not 0.85); winner 2-1 → loser uses `0.85`
- ELO floor: `max(100, computed_elo)`
- `round()` for all delta calculations (spec §5.2, §13)

## Requirements

### Functional
- `calculateSingles(params)` → `SinglesResult`
- `calculateDoubles(params)` → `DoublesResult`
- `getKFactor(totalGames)` → 32 | 24 | 16
- `getScoreMultiplier(score, isWinner)` → number
- `getSynergyBonus(gamesTogether)` → 0 | 5 | 10 | 15
- `getCarryWeights(eloA, eloB)` → `[weightA, weightB]`
- `getMismatchLevel(eloDiff)` → 'none' | 'warning' | 'danger'
- `getTier(eloScore)` → tier string

## Related Code Files
- **Create:** `shuttleup-api/src/elo/services/elo-calculation.service.ts`
- **Create:** `shuttleup-api/src/elo/types/elo-calculation.types.ts`
- **Create:** `shuttleup-api/src/elo/services/elo-calculation.service.spec.ts`

## Implementation Steps

### Step 1 — Create types file

**File:** `src/elo/types/elo-calculation.types.ts`

```typescript
export interface SinglesMatchParams {
  eloA: number;
  eloB: number;
  winner: 'A' | 'B';
  score: '2-0' | '2-1';
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
  scoreMultiplier: number;
}

export interface DoublesMatchParams {
  // Team A
  eloA1: number; eloA2: number;
  totalGamesA1: number; totalGamesA2: number;
  gamesA1A2Together: number;   // synergy count for pair A
  // Team B
  eloB1: number; eloB2: number;
  totalGamesB1: number; totalGamesB2: number;
  gamesB1B2Together: number;   // synergy count for pair B
  winner: 'A' | 'B';
  score: '2-0' | '2-1';
}

export interface PlayerDoublesResult {
  userId?: string;
  newElo: number;
  delta: number;
  carryWeight: number;
}

export interface DoublesResult {
  playerA1: PlayerDoublesResult;
  playerA2: PlayerDoublesResult;
  playerB1: PlayerDoublesResult;
  playerB2: PlayerDoublesResult;
  kFactor: number;
  synergyBonusA: number;
  synergyBonusB: number;
  expectedA: number;
  scoreMultiplier: number;
}

export type MismatchLevel = 'none' | 'warning' | 'danger';
export type EloTier = 'diamond' | 'gold' | 'silver' | 'bronze' | 'iron' | 'beginner';
```

### Step 2 — Create `EloCalculationService`

**File:** `src/elo/services/elo-calculation.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import {
  SinglesMatchParams, SinglesResult,
  DoublesMatchParams, DoublesResult,
  MismatchLevel, EloTier,
} from '../types/elo-calculation.types';

@Injectable()
export class EloCalculationService {

  /** K-factor by total game count (all game types combined) */
  getKFactor(totalGames: number): 32 | 24 | 16 {
    if (totalGames < 20) return 32;
    if (totalGames < 100) return 24;
    return 16;
  }

  /**
   * Score multiplier per spec §7.
   * winner 2-0 → ×1.2  | winner 2-1 → ×1.0
   * loser  2-0 → ×1.0  | loser  2-1 → ×0.85
   */
  getScoreMultiplier(score: '2-0' | '2-1', isWinner: boolean): number {
    if (score === '2-0') return isWinner ? 1.2 : 1.0;
    return isWinner ? 1.0 : 0.85;
  }

  /** Synergy bonus per spec §4 */
  getSynergyBonus(gamesTogether: number): 0 | 5 | 10 | 15 {
    if (gamesTogether >= 20) return 15;
    if (gamesTogether >= 10) return 10;
    if (gamesTogether >= 5) return 5;
    return 0;
  }

  /**
   * Carry weights per spec §5.1.
   * Returns [weightA, weightB] where A is the player with eloA.
   */
  getCarryWeights(eloA: number, eloB: number): [number, number] {
    const gap = Math.abs(eloA - eloB) / 400;
    const wStrong = Math.max(0.35, 0.50 - gap * 0.15);
    const wWeak = 1 - wStrong;
    return eloA >= eloB ? [wStrong, wWeak] : [wWeak, wStrong];
  }

  /** Mismatch warning level per spec §5.3 */
  getMismatchLevel(eloDiff: number): MismatchLevel {
    const diff = Math.abs(eloDiff);
    if (diff > 400) return 'danger';
    if (diff > 200) return 'warning';
    return 'none';
  }

  /** Tier from ELO score per spec §8 */
  getTier(eloScore: number): EloTier {
    if (eloScore >= 2000) return 'diamond';
    if (eloScore >= 1700) return 'gold';
    if (eloScore >= 1400) return 'silver';
    if (eloScore >= 1100) return 'bronze';
    if (eloScore >= 800) return 'iron';
    return 'beginner';
  }

  /** Win probability using standard ELO formula */
  private expectedScore(rA: number, rB: number): number {
    return 1 / (1 + Math.pow(10, (rB - rA) / 400));
  }

  /** Calculate singles ELO update per spec §2 */
  calculateSingles(params: SinglesMatchParams): SinglesResult {
    const { eloA, eloB, winner, score, totalGamesA, totalGamesB } = params;

    const kA = this.getKFactor(totalGamesA);
    const kB = this.getKFactor(totalGamesB);
    const k = Math.min(kA, kB);

    const expectedA = this.expectedScore(eloA, eloB);
    const expectedB = 1 - expectedA;

    const sA = winner === 'A' ? 1 : 0;
    const sB = 1 - sA;

    const multiplierWinner = this.getScoreMultiplier(score, true);
    const multiplierLoser = this.getScoreMultiplier(score, false);

    const mA = sA === 1 ? multiplierWinner : multiplierLoser;
    const mB = sB === 1 ? multiplierWinner : multiplierLoser;

    const deltaA = Math.round(k * (sA - expectedA) * mA);
    const deltaB = Math.round(k * (sB - expectedB) * mB);

    return {
      newEloA: Math.max(100, eloA + deltaA),
      newEloB: Math.max(100, eloB + deltaB),
      deltaA,
      deltaB,
      kFactor: k,
      expectedA,
      expectedB,
      scoreMultiplier: mA,
    };
  }

  /** Calculate doubles ELO update per spec §3–5 */
  calculateDoubles(params: DoublesMatchParams): DoublesResult {
    const {
      eloA1, eloA2, totalGamesA1, totalGamesA2, gamesA1A2Together,
      eloB1, eloB2, totalGamesB1, totalGamesB2, gamesB1B2Together,
      winner, score,
    } = params;

    const synA = this.getSynergyBonus(gamesA1A2Together);
    const synB = this.getSynergyBonus(gamesB1B2Together);

    const rPairA = Math.floor((eloA1 + eloA2) / 2) + synA;
    const rPairB = Math.floor((eloB1 + eloB2) / 2) + synB;

    const k = Math.min(
      this.getKFactor(totalGamesA1),
      this.getKFactor(totalGamesA2),
      this.getKFactor(totalGamesB1),
      this.getKFactor(totalGamesB2),
    );

    const expectedA = this.expectedScore(rPairA, rPairB);
    const expectedB = 1 - expectedA;

    const sA = winner === 'A' ? 1 : 0;
    const sB = 1 - sA;

    const multWinner = this.getScoreMultiplier(score, true);
    const multLoser = this.getScoreMultiplier(score, false);

    const mA = sA === 1 ? multWinner : multLoser;
    const mB = sB === 1 ? multWinner : multLoser;

    const totalDeltaA = k * (sA - expectedA) * mA;
    const totalDeltaB = k * (sB - expectedB) * mB;

    const [wA1, wA2] = this.getCarryWeights(eloA1, eloA2);
    const [wB1, wB2] = this.getCarryWeights(eloB1, eloB2);

    const dA1 = Math.round(totalDeltaA * wA1);
    const dA2 = Math.round(totalDeltaA * wA2);
    const dB1 = Math.round(totalDeltaB * wB1);
    const dB2 = Math.round(totalDeltaB * wB2);

    return {
      playerA1: { newElo: Math.max(100, eloA1 + dA1), delta: dA1, carryWeight: wA1 },
      playerA2: { newElo: Math.max(100, eloA2 + dA2), delta: dA2, carryWeight: wA2 },
      playerB1: { newElo: Math.max(100, eloB1 + dB1), delta: dB1, carryWeight: wB1 },
      playerB2: { newElo: Math.max(100, eloB2 + dB2), delta: dB2, carryWeight: wB2 },
      kFactor: k,
      synergyBonusA: synA,
      synergyBonusB: synB,
      expectedA,
      scoreMultiplier: mA,
    };
  }
}
```

## Todo List
- [ ] Create `src/elo/types/elo-calculation.types.ts`
- [ ] Create `src/elo/services/elo-calculation.service.ts`
- [ ] Write unit tests (see Phase 7)
- [ ] Verify `EloCalculationService` compiles (`npx tsc --noEmit`)

## Success Criteria
- All pure functions return correct values matching spec examples:
  - §2 example: A=1400, B=1200 → E(A) ≈ 0.76
  - §5.2 example: A=1600, B=1000 → gap=1.5, wStrong=0.35, wWeak=0.65
  - §4: 20+ games → synergy=15
- `calculateSingles` delta sum ≈ 0 (zero-sum, rounding ±1)
- ELO never drops below 100

## Risk Assessment
- **Low:** Floating point precision — `Math.round()` handles per spec
- **Low:** Negative delta for winner (if massive underdog) — mathematically impossible with ELO formula
