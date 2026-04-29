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
  eloA1: number;
  eloA2: number;
  totalGamesA1: number;
  totalGamesA2: number;
  gamesA1A2Together: number; // synergy count for pair A
  // Team B
  eloB1: number;
  eloB2: number;
  totalGamesB1: number;
  totalGamesB2: number;
  gamesB1B2Together: number; // synergy count for pair B
  winner: 'A' | 'B';
  score: '2-0' | '2-1';
}

export interface PlayerDoublesResult {
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

export type EloTier =
  | 'diamond'
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'iron'
  | 'beginner';
