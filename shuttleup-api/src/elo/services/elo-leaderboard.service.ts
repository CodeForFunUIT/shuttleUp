import { Injectable, NotFoundException } from '@nestjs/common';
import { GameType } from '../../common/constants/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { EloCalculationService } from './elo-calculation.service';

@Injectable()
export class EloLeaderboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eloCalc: EloCalculationService,
  ) {}

  /**
   * Paginated ELO leaderboard for a specific game type.
   * Excludes calibrating players (< 5 completed matches).
   */
  async getLeaderboard(gameType: GameType, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, ratings] = await Promise.all([
      this.prisma.userEloRating.count({
        where: { gameType, isCalibrating: false },
      }),
      this.prisma.userEloRating.findMany({
        where: { gameType, isCalibrating: false },
        orderBy: { eloScore: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, image: true, skillLevel: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: ratings.map((r, idx) => ({
        rank: skip + idx + 1,
        userId: r.userId,
        user: r.user,
        eloScore: r.eloScore,
        totalGames: r.totalGames,
        tier: this.eloCalc.getTier(r.eloScore),
        gameType: r.gameType,
      })),
    };
  }

  /**
   * Returns all 3 game type ELO ratings for a user, with tier.
   * Calibrating users show null tier (not enough games).
   */
  async getUserProfile(userId: string) {
    const [user, ratings] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, image: true, skillLevel: true },
      }),
      this.prisma.userEloRating.findMany({ where: { userId } }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      user,
      eloProfile: ratings.map((r) => ({
        gameType: r.gameType,
        eloScore: r.eloScore,
        totalGames: r.totalGames,
        isCalibrating: r.isCalibrating,
        tier: r.isCalibrating ? null : this.eloCalc.getTier(r.eloScore),
      })),
    };
  }

  /**
   * Pair chemistry info: synergy bonus + mismatch level between two players.
   * Used by frontend to show warnings before pairing uneven players.
   */
  async getPairInfo(userIdA: string, userIdB: string, gameType: GameType) {
    const [normA, normB] =
      userIdA < userIdB ? [userIdA, userIdB] : [userIdB, userIdA];

    const [synergy, ratingA, ratingB] = await Promise.all([
      this.prisma.pairSynergy.findUnique({
        where: {
          playerIdA_playerIdB_gameType: {
            playerIdA: normA,
            playerIdB: normB,
            gameType,
          },
        },
      }),
      this.prisma.userEloRating.findUnique({
        where: { userId_gameType: { userId: userIdA, gameType } },
      }),
      this.prisma.userEloRating.findUnique({
        where: { userId_gameType: { userId: userIdB, gameType } },
      }),
    ]);

    const eloA = ratingA?.eloScore ?? 1000;
    const eloB = ratingB?.eloScore ?? 1000;
    const eloDiff = Math.abs(eloA - eloB);
    const gamesTogether = synergy?.gamesTogether ?? 0;

    return {
      gamesTogether,
      synergyBonus: this.eloCalc.getSynergyBonus(gamesTogether),
      mismatchLevel: this.eloCalc.getMismatchLevel(eloDiff),
      eloDiff,
      eloA,
      eloB,
    };
  }
}
