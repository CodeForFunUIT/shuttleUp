import { Injectable } from '@nestjs/common';
import {
  DoublesMatchParams,
  DoublesResult,
  EloTier,
  MismatchLevel,
  SinglesMatchParams,
  SinglesResult,
} from '../types/elo-calculation.types';

/**
 * Pure stateless ELO calculation service — no DB dependencies.
 * All logic based on BELo spec v1.0.
 */
@Injectable()
export class EloCalculationService {
  /**
   * K-factor by total game count (all game types combined).
   * Spec §6: < 20 → 32, 20–99 → 24, ≥ 100 → 16
   */
  getKFactor(totalGames: number): 32 | 24 | 16 {
    if (totalGames < 20) return 32;
    if (totalGames < 100) return 24;
    return 16;
  }

  /**
   * Score multiplier per spec §7.
   * Winner 2-0 → ×1.2  | Winner 2-1 → ×1.0
   * Loser  2-1 → ×0.85 | Loser  2-0 → ×1.0
   */
  getScoreMultiplier(score: '2-0' | '2-1', isWinner: boolean): number {
    if (score === '2-0') return isWinner ? 1.2 : 1.0;
    return isWinner ? 1.0 : 0.85;
  }

  /**
   * Synergy bonus per spec §4.
   * 0–4 games → 0, 5–9 → +5, 10–19 → +10, 20+ → +15
   */
  getSynergyBonus(gamesTogether: number): 0 | 5 | 10 | 15 {
    if (gamesTogether >= 20) return 15;
    if (gamesTogether >= 10) return 10;
    if (gamesTogether >= 5) return 5;
    return 0;
  }

  /**
   * Carry weights per spec §5.1.
   * Returns [weightA, weightB] where A is the player with eloA.
   * The weaker player always gets the larger share.
   */
  getCarryWeights(eloA: number, eloB: number): [number, number] {
    const gap = Math.abs(eloA - eloB) / 400;
    const wStrong = Math.max(0.35, 0.5 - gap * 0.15);
    const wWeak = 1 - wStrong;
    return eloA >= eloB ? [wStrong, wWeak] : [wWeak, wStrong];
  }

  /**
   * Mismatch warning level per spec §5.3.
   * ≤200 → none, 201–400 → warning, >400 → danger
   */
  getMismatchLevel(eloDiff: number): MismatchLevel {
    const diff = Math.abs(eloDiff);
    if (diff > 400) return 'danger';
    if (diff > 200) return 'warning';
    return 'none';
  }

  /**
   * Tier from ELO score per spec §8.
   * ≥2000 → diamond, ≥1700 → gold, ≥1400 → silver,
   * ≥1100 → bronze, ≥800 → iron, <800 → beginner
   */
  getTier(eloScore: number): EloTier {
    if (eloScore >= 2000) return 'diamond';
    if (eloScore >= 1700) return 'gold';
    if (eloScore >= 1400) return 'silver';
    if (eloScore >= 1100) return 'bronze';
    if (eloScore >= 800) return 'iron';
    return 'beginner';
  }

  /** Standard ELO expected score formula: E(A) = 1 / (1 + 10^((R_B - R_A) / 400)) */
  private expectedScore(rA: number, rB: number): number {
    return 1 / (1 + Math.pow(10, (rB - rA) / 400));
  }

  /**
   * Calculate singles ELO update per spec §2.
   * K is min(kA, kB) to protect veterans from big swings.
   */
  calculateSingles(params: SinglesMatchParams): SinglesResult {
    const { eloA, eloB, winner, score, totalGamesA, totalGamesB } = params;

    const k = Math.min(this.getKFactor(totalGamesA), this.getKFactor(totalGamesB));

    const expectedA = this.expectedScore(eloA, eloB);
    const expectedB = 1 - expectedA;

    const sA = winner === 'A' ? 1 : 0;
    const sB = 1 - sA;

    const multiplierA = this.getScoreMultiplier(score, sA === 1);
    const multiplierB = this.getScoreMultiplier(score, sB === 1);

    const deltaA = Math.round(k * (sA - expectedA) * multiplierA);
    const deltaB = Math.round(k * (sB - expectedB) * multiplierB);

    return {
      newEloA: Math.max(100, eloA + deltaA),
      newEloB: Math.max(100, eloB + deltaB),
      deltaA,
      deltaB,
      kFactor: k,
      expectedA,
      expectedB,
      scoreMultiplier: multiplierA,
    };
  }

  /**
   * Calculate doubles ELO update per spec §3–5.
   * K is min across all 4 players.
   * Pair Rating = floor((R_A + R_B) / 2) + synergy_bonus
   * Delta split by carry weight.
   */
  calculateDoubles(params: DoublesMatchParams): DoublesResult {
    const {
      eloA1,
      eloA2,
      totalGamesA1,
      totalGamesA2,
      gamesA1A2Together,
      eloB1,
      eloB2,
      totalGamesB1,
      totalGamesB2,
      gamesB1B2Together,
      winner,
      score,
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

    const multiplierA = this.getScoreMultiplier(score, sA === 1);
    const multiplierB = this.getScoreMultiplier(score, sB === 1);

    // Total team delta before splitting
    const totalDeltaA = k * (sA - expectedA) * multiplierA;
    const totalDeltaB = k * (sB - expectedB) * multiplierB;

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
      scoreMultiplier: multiplierA,
    };
  }
}
