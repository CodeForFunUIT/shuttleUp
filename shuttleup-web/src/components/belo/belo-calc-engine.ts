/**
 * Shared BELo ELO calculation engine — pure functions, no side effects.
 * Mirrors backend EloCalculationService logic exactly.
 * Used by both dashboard simulator and homepage public simulator.
 */

// ─── Types ────────────────────────────────────────────────────────────────

export interface TierInfo {
  name: string;
  emoji: string;
  color: string;
}

export interface SinglesSimResult {
  expectedA: number;
  expectedB: number;
  deltaA: number;
  deltaB: number;
  newEloA: number;
  newEloB: number;
  kFactor: number;
}

export interface DoublesPlayerResult {
  newElo: number;
  delta: number;
  carryWeight: number;
}

export interface DoublesSimResult {
  playerA1: DoublesPlayerResult;
  playerA2: DoublesPlayerResult;
  playerB1: DoublesPlayerResult;
  playerB2: DoublesPlayerResult;
  kFactor: number;
  synergyBonusA: number;
  synergyBonusB: number;
  pairRatingA: number;
  pairRatingB: number;
  expectedA: number;
  expectedB: number;
}

// ─── Core Functions ───────────────────────────────────────────────────────

/** K-factor by total game count. Spec §6 */
export function getKFactor(totalGames: number): number {
  if (totalGames < 20) return 32;
  if (totalGames < 100) return 24;
  return 16;
}

/** Synergy bonus per spec §4: 0-4→0, 5-9→+5, 10-19→+10, 20+→+15 */
export function getSynergyBonus(gamesTogether: number): number {
  if (gamesTogether >= 20) return 15;
  if (gamesTogether >= 10) return 10;
  if (gamesTogether >= 5) return 5;
  return 0;
}

/** Carry weights per spec §5.1. Weaker player gets larger share. */
export function getCarryWeights(eloA: number, eloB: number): [number, number] {
  const gap = Math.abs(eloA - eloB) / 400;
  const wStrong = Math.max(0.35, 0.5 - gap * 0.15);
  const wWeak = 1 - wStrong;
  return eloA >= eloB ? [wStrong, wWeak] : [wWeak, wStrong];
}

/** Tier from ELO score per spec §8 */
export function getTierInfo(elo: number): TierInfo {
  if (elo >= 2000) return { name: "Kim Cương", emoji: "💎", color: "text-cyan-700 bg-cyan-100" };
  if (elo >= 1700) return { name: "Vàng", emoji: "🥇", color: "text-amber-700 bg-amber-100" };
  if (elo >= 1400) return { name: "Bạc", emoji: "🥈", color: "text-slate-700 bg-slate-100" };
  if (elo >= 1100) return { name: "Đồng", emoji: "🥉", color: "text-orange-700 bg-orange-100" };
  if (elo >= 800) return { name: "Sắt", emoji: "⚙️", color: "text-stone-700 bg-stone-100" };
  return { name: "Nhập môn", emoji: "🌱", color: "text-green-700 bg-green-50" };
}

/** Singles ELO calculation per spec §2 */
export function simulateSingles(
  eloA: number, eloB: number, winner: "A" | "B",
  gamesA: number, gamesB: number,
): SinglesSimResult {
  const k = Math.min(getKFactor(gamesA), getKFactor(gamesB));
  const expectedA = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const expectedB = 1 - expectedA;
  const sA = winner === "A" ? 1 : 0;
  const deltaA = Math.round(k * (sA - expectedA));
  const deltaB = Math.round(k * ((1 - sA) - expectedB));
  return { expectedA, expectedB, deltaA, deltaB,
    newEloA: Math.max(100, eloA + deltaA),
    newEloB: Math.max(100, eloB + deltaB), kFactor: k };
}

/** Doubles ELO calculation per spec §3-5 (also used for Mixed) */
export function simulateDoubles(
  eloA1: number, eloA2: number, gamesA1: number, gamesA2: number, togetherA: number,
  eloB1: number, eloB2: number, gamesB1: number, gamesB2: number, togetherB: number,
  winner: "A" | "B",
): DoublesSimResult {
  const synA = getSynergyBonus(togetherA);
  const synB = getSynergyBonus(togetherB);
  const pairA = Math.floor((eloA1 + eloA2) / 2) + synA;
  const pairB = Math.floor((eloB1 + eloB2) / 2) + synB;
  const k = Math.min(getKFactor(gamesA1), getKFactor(gamesA2), getKFactor(gamesB1), getKFactor(gamesB2));
  const expectedA = 1 / (1 + Math.pow(10, (pairB - pairA) / 400));
  const sA = winner === "A" ? 1 : 0;
  const totalDeltaA = k * (sA - expectedA);
  const totalDeltaB = k * ((1 - sA) - (1 - expectedA));
  const [wA1, wA2] = getCarryWeights(eloA1, eloA2);
  const [wB1, wB2] = getCarryWeights(eloB1, eloB2);
  return {
    playerA1: { newElo: Math.max(100, eloA1 + Math.round(totalDeltaA * wA1)), delta: Math.round(totalDeltaA * wA1), carryWeight: wA1 },
    playerA2: { newElo: Math.max(100, eloA2 + Math.round(totalDeltaA * wA2)), delta: Math.round(totalDeltaA * wA2), carryWeight: wA2 },
    playerB1: { newElo: Math.max(100, eloB1 + Math.round(totalDeltaB * wB1)), delta: Math.round(totalDeltaB * wB1), carryWeight: wB1 },
    playerB2: { newElo: Math.max(100, eloB2 + Math.round(totalDeltaB * wB2)), delta: Math.round(totalDeltaB * wB2), carryWeight: wB2 },
    kFactor: k, synergyBonusA: synA, synergyBonusB: synB,
    pairRatingA: pairA, pairRatingB: pairB,
    expectedA, expectedB: 1 - expectedA,
  };
}
