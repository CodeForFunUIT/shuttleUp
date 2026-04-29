import { EloCalculationService } from './elo-calculation.service';

describe('EloCalculationService', () => {
  let service: EloCalculationService;

  beforeEach(() => {
    service = new EloCalculationService();
  });

  // ─── K-factor ─────────────────────────────────────────────────────────────

  describe('getKFactor', () => {
    it('returns 32 for 0 games (new player)', () => {
      expect(service.getKFactor(0)).toBe(32);
    });

    it('returns 32 for 19 games (still provisional)', () => {
      expect(service.getKFactor(19)).toBe(32);
    });

    it('returns 24 for 20 games (intermediate)', () => {
      expect(service.getKFactor(20)).toBe(24);
    });

    it('returns 24 for 99 games', () => {
      expect(service.getKFactor(99)).toBe(24);
    });

    it('returns 16 for 100 games (veteran)', () => {
      expect(service.getKFactor(100)).toBe(16);
    });

    it('returns 16 for 500 games', () => {
      expect(service.getKFactor(500)).toBe(16);
    });
  });

  // ─── Synergy Bonus ────────────────────────────────────────────────────────

  describe('getSynergyBonus', () => {
    it('returns 0 for 0 games together', () => {
      expect(service.getSynergyBonus(0)).toBe(0);
    });

    it('returns 0 for 4 games together', () => {
      expect(service.getSynergyBonus(4)).toBe(0);
    });

    it('returns 5 for 5 games together', () => {
      expect(service.getSynergyBonus(5)).toBe(5);
    });

    it('returns 5 for 9 games together', () => {
      expect(service.getSynergyBonus(9)).toBe(5);
    });

    it('returns 10 for 10 games together', () => {
      expect(service.getSynergyBonus(10)).toBe(10);
    });

    it('returns 10 for 19 games together', () => {
      expect(service.getSynergyBonus(19)).toBe(10);
    });

    it('returns 15 for 20 games together', () => {
      expect(service.getSynergyBonus(20)).toBe(15);
    });

    it('returns 15 for 100 games together (max)', () => {
      expect(service.getSynergyBonus(100)).toBe(15);
    });
  });

  // ─── Carry Weights ────────────────────────────────────────────────────────

  describe('getCarryWeights — spec §5.2', () => {
    it('equal ELO → 50/50 split', () => {
      const [wA, wB] = service.getCarryWeights(1200, 1200);
      expect(wA).toBeCloseTo(0.5, 5);
      expect(wB).toBeCloseTo(0.5, 5);
    });

    it('A=1600, B=1000 → A stronger, gets 0.35 (min floor), B gets 0.65', () => {
      const [wA, wB] = service.getCarryWeights(1600, 1000);
      expect(wA).toBeCloseTo(0.35, 5);
      expect(wB).toBeCloseTo(0.65, 5);
    });

    it('A=1000, B=1600 → A weaker gets larger share (0.65)', () => {
      const [wA, wB] = service.getCarryWeights(1000, 1600);
      expect(wA).toBeCloseTo(0.65, 5);
      expect(wB).toBeCloseTo(0.35, 5);
    });

    it('weights always sum to 1.0', () => {
      const cases: [number, number][] = [
        [1000, 1200],
        [1500, 1100],
        [2000, 800],
        [1000, 1000],
      ];
      for (const [a, b] of cases) {
        const [wA, wB] = service.getCarryWeights(a, b);
        expect(wA + wB).toBeCloseTo(1.0, 5);
      }
    });

    it('strong player weight floor is 0.35 for extreme ELO gaps', () => {
      const [, wB] = service.getCarryWeights(800, 3000); // B is very strong
      expect(wB).toBeCloseTo(0.35, 5); // capped at floor
    });
  });

  // ─── Score Multiplier ─────────────────────────────────────────────────────

  describe('getScoreMultiplier — spec §7', () => {
    it('winner 2-0 → ×1.2', () => {
      expect(service.getScoreMultiplier('2-0', true)).toBe(1.2);
    });

    it('winner 2-1 → ×1.0', () => {
      expect(service.getScoreMultiplier('2-1', true)).toBe(1.0);
    });

    it('loser 2-0 → ×1.0 (reduced loss for close defeat)', () => {
      expect(service.getScoreMultiplier('2-0', false)).toBe(1.0);
    });

    it('loser 2-1 → ×0.85 (smaller loss for close match)', () => {
      expect(service.getScoreMultiplier('2-1', false)).toBe(0.85);
    });
  });

  // ─── Mismatch Level ───────────────────────────────────────────────────────

  describe('getMismatchLevel', () => {
    it('0 diff → none', () => expect(service.getMismatchLevel(0)).toBe('none'));
    it('200 diff → none (boundary)', () =>
      expect(service.getMismatchLevel(200)).toBe('none'));
    it('201 diff → warning', () =>
      expect(service.getMismatchLevel(201)).toBe('warning'));
    it('400 diff → warning (boundary)', () =>
      expect(service.getMismatchLevel(400)).toBe('warning'));
    it('401 diff → danger', () =>
      expect(service.getMismatchLevel(401)).toBe('danger'));
    it('negative diff uses abs value', () =>
      expect(service.getMismatchLevel(-300)).toBe('warning'));
  });

  // ─── Tier ─────────────────────────────────────────────────────────────────

  describe('getTier', () => {
    it('≥2000 → diamond', () => expect(service.getTier(2000)).toBe('diamond'));
    it('2500 → diamond', () => expect(service.getTier(2500)).toBe('diamond'));
    it('1999 → gold', () => expect(service.getTier(1999)).toBe('gold'));
    it('1700 → gold', () => expect(service.getTier(1700)).toBe('gold'));
    it('1699 → silver', () => expect(service.getTier(1699)).toBe('silver'));
    it('1400 → silver', () => expect(service.getTier(1400)).toBe('silver'));
    it('1399 → bronze', () => expect(service.getTier(1399)).toBe('bronze'));
    it('1100 → bronze', () => expect(service.getTier(1100)).toBe('bronze'));
    it('1099 → iron', () => expect(service.getTier(1099)).toBe('iron'));
    it('800 → iron', () => expect(service.getTier(800)).toBe('iron'));
    it('799 → beginner', () => expect(service.getTier(799)).toBe('beginner'));
    it('100 → beginner', () => expect(service.getTier(100)).toBe('beginner'));
  });

  // ─── Calculate Singles ────────────────────────────────────────────────────

  describe('calculateSingles', () => {
    it('spec §2 example: A=1400, B=1200 → E(A)≈0.76', () => {
      const result = service.calculateSingles({
        eloA: 1400,
        eloB: 1200,
        winner: 'A',
        score: '2-1',
        totalGamesA: 50,
        totalGamesB: 50,
      });
      expect(result.expectedA).toBeCloseTo(0.76, 1);
    });

    it('winner gains ELO, loser loses ELO', () => {
      const result = service.calculateSingles({
        eloA: 1200,
        eloB: 1200,
        winner: 'A',
        score: '2-0',
        totalGamesA: 10,
        totalGamesB: 10,
      });
      expect(result.deltaA).toBeGreaterThan(0);
      expect(result.deltaB).toBeLessThan(0);
      expect(result.newEloA).toBeGreaterThan(1200);
      expect(result.newEloB).toBeLessThan(1200);
    });

    it('ELO floor: loser never drops below 100', () => {
      const result = service.calculateSingles({
        eloA: 100,
        eloB: 2000,
        winner: 'B',
        score: '2-0',
        totalGamesA: 5,
        totalGamesB: 5,
      });
      expect(result.newEloA).toBeGreaterThanOrEqual(100);
    });

    it('K selection uses minimum (veteran vs newbie → K=16)', () => {
      const result = service.calculateSingles({
        eloA: 1200,
        eloB: 1200,
        winner: 'A',
        score: '2-1',
        totalGamesA: 5, // K=32
        totalGamesB: 150, // K=16 → min wins
      });
      expect(result.kFactor).toBe(16);
    });

    it('K=32 for both new players', () => {
      const result = service.calculateSingles({
        eloA: 1000,
        eloB: 1000,
        winner: 'A',
        score: '2-0',
        totalGamesA: 0,
        totalGamesB: 0,
      });
      expect(result.kFactor).toBe(32);
    });

    it('upset win: low ELO beats high ELO → larger delta', () => {
      const result = service.calculateSingles({
        eloA: 800,
        eloB: 1600,
        winner: 'A',
        score: '2-0',
        totalGamesA: 10,
        totalGamesB: 10,
      });
      // Underdog wins → large positive delta
      expect(result.deltaA).toBeGreaterThan(15);
    });

    it('returns correct scoreMultiplier for winner 2-0', () => {
      const result = service.calculateSingles({
        eloA: 1200,
        eloB: 1200,
        winner: 'A',
        score: '2-0',
        totalGamesA: 10,
        totalGamesB: 10,
      });
      expect(result.scoreMultiplier).toBe(1.2);
    });
  });

  // ─── Calculate Doubles ────────────────────────────────────────────────────

  describe('calculateDoubles', () => {
    const baseParams = {
      eloA1: 1200,
      eloA2: 1200,
      totalGamesA1: 30,
      totalGamesA2: 30,
      gamesA1A2Together: 0,
      eloB1: 1200,
      eloB2: 1200,
      totalGamesB1: 30,
      totalGamesB2: 30,
      gamesB1B2Together: 0,
      winner: 'A' as const,
      score: '2-0' as const,
    };

    it('synergy bonus included in pair rating — team with synergy has advantage', () => {
      const result = service.calculateDoubles({
        ...baseParams,
        gamesA1A2Together: 20, // synergy = 15
        gamesB1B2Together: 0, // synergy = 0
      });
      expect(result.synergyBonusA).toBe(15);
      expect(result.synergyBonusB).toBe(0);
      // A wins with synergy advantage → should win more ELO due to lower expected win prob
      expect(result.playerA1.delta).toBeGreaterThan(0);
    });

    it('K factor uses minimum across all 4 players', () => {
      const result = service.calculateDoubles({
        ...baseParams,
        totalGamesA1: 5, // K=32
        totalGamesA2: 30, // K=24
        totalGamesB1: 150, // K=16 ← minimum
        totalGamesB2: 30, // K=24
      });
      expect(result.kFactor).toBe(16);
    });

    it('ELO floor enforced for all losers', () => {
      const result = service.calculateDoubles({
        ...baseParams,
        eloB1: 100,
        eloB2: 100,
        winner: 'A',
        score: '2-0',
      });
      expect(result.playerB1.newElo).toBeGreaterThanOrEqual(100);
      expect(result.playerB2.newElo).toBeGreaterThanOrEqual(100);
    });

    it('weaker player in pair gets higher carryWeight', () => {
      const result = service.calculateDoubles({
        ...baseParams,
        eloA1: 1600, // stronger
        eloA2: 800, // weaker → should get higher carry weight
      });
      expect(result.playerA2.carryWeight).toBeGreaterThan(
        result.playerA1.carryWeight,
      );
    });

    it('equal team → players split delta equally', () => {
      const result = service.calculateDoubles(baseParams);
      // Equal ELO → equal carry weights
      expect(result.playerA1.carryWeight).toBeCloseTo(0.5, 5);
      expect(result.playerA2.carryWeight).toBeCloseTo(0.5, 5);
    });
  });
});
