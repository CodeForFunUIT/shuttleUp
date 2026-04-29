import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EloMatch, EloMatchParticipant, UserEloRating } from '@prisma/client';
import { EloMatchConfirmedEvent } from '../../common/events/elo.events';
import { GameType } from '../../common/constants/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitMatchDto } from '../dto/submit-match.dto';
import { EloCalculationService } from './elo-calculation.service';

/** Shape for a single player's computed ELO result ready for DB write */
interface PlayerResult {
  userId: string;
  team: string;
  isWinner: boolean;
  eloBefore: number;
  eloAfter: number;
  delta: number;
  kFactor: number;
  expectedScore: number;
  carryWeight: number;
  synergyBonus: number;
  scoreMultiplier: number;
}

/** Rating map loaded/initialized before calculation */
type RatingMap = Record<string, UserEloRating>;

@Injectable()
export class EloMatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eloCalc: EloCalculationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ─── Public API ───────────────────────────────────────────────────────────

  /** Host submits final match result for a session → updates ELO for all players */
  async submitMatch(
    sessionId: string,
    dto: SubmitMatchDto,
    hostId: string,
  ): Promise<EloMatch> {
    // 1. Validate session exists + host auth
    const session = await this.prisma.courtSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.hostId !== hostId) {
      throw new ForbiddenException('Only host can submit match result');
    }

    // 2. Prevent duplicate submission
    const existing = await this.prisma.eloMatch.findUnique({
      where: { sessionId },
    });
    if (existing) {
      throw new ConflictException(
        'Match result already submitted for this session',
      );
    }

    // 3. Validate team sizes and no duplicate player IDs
    this.validateTeamSizes(dto);

    // 3.5. Verify all players are registered users (block guest/phantom IDs)
    const allPlayerIds = [...dto.teamA, ...dto.teamB];
    await this.validatePlayersExist(allPlayerIds);

    // 4. Load or initialize ELO ratings for all players
    const ratings = await this.loadOrInitEloRatings(allPlayerIds, dto.gameType);

    // 5. Load pair synergy counts (doubles/mixed only)
    let synergyA = 0;
    let synergyB = 0;
    if (dto.gameType !== GameType.SINGLES && dto.teamA.length === 2) {
      synergyA = await this.getSynergyCount(
        dto.teamA[0],
        dto.teamA[1],
        dto.gameType,
      );
      synergyB = await this.getSynergyCount(
        dto.teamB[0],
        dto.teamB[1],
        dto.gameType,
      );
    }

    // 6. Calculate new ELO for all players
    const playerResults = this.runCalculation(dto, ratings, synergyA, synergyB);

    // 7. Persist atomically
    const match = await this.persistMatchTransaction(
      sessionId,
      dto,
      playerResults,
      ratings,
    );

    // 8. Emit event (for notifications, webhooks in future phases)
    this.eventEmitter.emit(
      'elo.match.confirmed',
      new EloMatchConfirmedEvent(
        match.id,
        sessionId,
        playerResults.map((p) => p.userId),
      ),
    );

    return match;
  }

  /** Get match detail with full audit trail */
  async findMatch(
    id: string,
  ): Promise<EloMatch & { participants: EloMatchParticipant[] }> {
    const match = await this.prisma.eloMatch.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  /** Paginated match history for a user */
  async getUserMatchHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, participants] = await Promise.all([
      this.prisma.eloMatchParticipant.count({ where: { userId } }),
      this.prisma.eloMatchParticipant.findMany({
        where: { userId },
        orderBy: { match: { playedAt: 'desc' } },
        skip,
        take: limit,
        include: {
          match: true,
        },
      }),
    ]);

    return { total, page, limit, data: participants };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /** Verify all submitted player IDs correspond to registered users in DB */
  private async validatePlayersExist(playerIds: string[]): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: playerIds } },
      select: { id: true },
    });

    if (users.length !== playerIds.length) {
      const foundIds = new Set(users.map((u) => u.id));
      const missing = playerIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `The following player IDs are not registered users: ${missing.join(', ')}`,
      );
    }
  }

  private validateTeamSizes(dto: SubmitMatchDto): void {
    const expectedSize = dto.gameType === GameType.SINGLES ? 1 : 2;
    if (
      dto.teamA.length !== expectedSize ||
      dto.teamB.length !== expectedSize
    ) {
      throw new BadRequestException(
        `${dto.gameType} requires ${expectedSize} player(s) per team`,
      );
    }
    const allIds = [...dto.teamA, ...dto.teamB];
    if (new Set(allIds).size !== allIds.length) {
      throw new BadRequestException('Duplicate player IDs detected');
    }
  }

  /** Load existing ratings or create defaults (1000 ELO) for first-time players */
  private async loadOrInitEloRatings(
    userIds: string[],
    gameType: GameType,
  ): Promise<RatingMap> {
    // Upsert ratings for any player who doesn't have one yet
    await Promise.all(
      userIds.map((userId) =>
        this.prisma.userEloRating.upsert({
          where: { userId_gameType: { userId, gameType } },
          create: {
            userId,
            gameType,
            eloScore: 1000,
            totalGames: 0,
            isCalibrating: true,
          },
          update: {},
        }),
      ),
    );

    const ratings = await this.prisma.userEloRating.findMany({
      where: { userId: { in: userIds }, gameType },
    });

    return Object.fromEntries(ratings.map((r) => [r.userId, r]));
  }

  /** Normalize pair key so playerIdA < playerIdB (string comparison) */
  private normalizePairKey(idA: string, idB: string): [string, string] {
    return idA < idB ? [idA, idB] : [idB, idA];
  }

  private async getSynergyCount(
    idA: string,
    idB: string,
    gameType: GameType,
  ): Promise<number> {
    const [playerIdA, playerIdB] = this.normalizePairKey(idA, idB);
    const synergy = await this.prisma.pairSynergy.findUnique({
      where: {
        playerIdA_playerIdB_gameType: { playerIdA, playerIdB, gameType },
      },
    });
    return synergy?.gamesTogether ?? 0;
  }

  /** Build player result list from calculation */
  private runCalculation(
    dto: SubmitMatchDto,
    ratings: RatingMap,
    synergyA: number,
    synergyB: number,
  ): PlayerResult[] {
    if (dto.gameType === GameType.SINGLES) {
      return this.runSinglesCalc(dto, ratings);
    }
    return this.runDoublesCalc(dto, ratings, synergyA, synergyB);
  }

  private runSinglesCalc(
    dto: SubmitMatchDto,
    ratings: RatingMap,
  ): PlayerResult[] {
    const [idA] = dto.teamA;
    const [idB] = dto.teamB;
    const rA = ratings[idA];
    const rB = ratings[idB];

    const result = this.eloCalc.calculateSingles({
      eloA: rA.eloScore,
      eloB: rB.eloScore,
      winner: dto.winner,
      score: dto.score,
      totalGamesA: rA.totalGames,
      totalGamesB: rB.totalGames,
    });

    return [
      {
        userId: idA,
        team: 'TEAM_A',
        isWinner: dto.winner === 'A',
        eloBefore: rA.eloScore,
        eloAfter: result.newEloA,
        delta: result.deltaA,
        kFactor: result.kFactor,
        expectedScore: result.expectedA,
        carryWeight: 1.0, // singles: no split
        synergyBonus: 0,
        scoreMultiplier: result.scoreMultiplier,
      },
      {
        userId: idB,
        team: 'TEAM_B',
        isWinner: dto.winner === 'B',
        eloBefore: rB.eloScore,
        eloAfter: result.newEloB,
        delta: result.deltaB,
        kFactor: result.kFactor,
        expectedScore: result.expectedB,
        carryWeight: 1.0,
        synergyBonus: 0,
        scoreMultiplier: this.eloCalc.getScoreMultiplier(
          dto.score,
          dto.winner === 'B',
        ),
      },
    ];
  }

  private runDoublesCalc(
    dto: SubmitMatchDto,
    ratings: RatingMap,
    synergyA: number,
    synergyB: number,
  ): PlayerResult[] {
    const [idA1, idA2] = dto.teamA;
    const [idB1, idB2] = dto.teamB;
    const rA1 = ratings[idA1];
    const rA2 = ratings[idA2];
    const rB1 = ratings[idB1];
    const rB2 = ratings[idB2];

    const result = this.eloCalc.calculateDoubles({
      eloA1: rA1.eloScore,
      eloA2: rA2.eloScore,
      totalGamesA1: rA1.totalGames,
      totalGamesA2: rA2.totalGames,
      gamesA1A2Together: synergyA,
      eloB1: rB1.eloScore,
      eloB2: rB2.eloScore,
      totalGamesB1: rB1.totalGames,
      totalGamesB2: rB2.totalGames,
      gamesB1B2Together: synergyB,
      winner: dto.winner,
      score: dto.score,
    });

    const synergyBonusA = result.synergyBonusA;
    const synergyBonusB = result.synergyBonusB;

    return [
      {
        userId: idA1,
        team: 'TEAM_A',
        isWinner: dto.winner === 'A',
        eloBefore: rA1.eloScore,
        eloAfter: result.playerA1.newElo,
        delta: result.playerA1.delta,
        kFactor: result.kFactor,
        expectedScore: result.expectedA,
        carryWeight: result.playerA1.carryWeight,
        synergyBonus: synergyBonusA,
        scoreMultiplier: result.scoreMultiplier,
      },
      {
        userId: idA2,
        team: 'TEAM_A',
        isWinner: dto.winner === 'A',
        eloBefore: rA2.eloScore,
        eloAfter: result.playerA2.newElo,
        delta: result.playerA2.delta,
        kFactor: result.kFactor,
        expectedScore: result.expectedA,
        carryWeight: result.playerA2.carryWeight,
        synergyBonus: synergyBonusA,
        scoreMultiplier: result.scoreMultiplier,
      },
      {
        userId: idB1,
        team: 'TEAM_B',
        isWinner: dto.winner === 'B',
        eloBefore: rB1.eloScore,
        eloAfter: result.playerB1.newElo,
        delta: result.playerB1.delta,
        kFactor: result.kFactor,
        expectedScore: 1 - result.expectedA,
        carryWeight: result.playerB1.carryWeight,
        synergyBonus: synergyBonusB,
        scoreMultiplier: this.eloCalc.getScoreMultiplier(
          dto.score,
          dto.winner === 'B',
        ),
      },
      {
        userId: idB2,
        team: 'TEAM_B',
        isWinner: dto.winner === 'B',
        eloBefore: rB2.eloScore,
        eloAfter: result.playerB2.newElo,
        delta: result.playerB2.delta,
        kFactor: result.kFactor,
        expectedScore: 1 - result.expectedA,
        carryWeight: result.playerB2.carryWeight,
        synergyBonus: synergyBonusB,
        scoreMultiplier: this.eloCalc.getScoreMultiplier(
          dto.score,
          dto.winner === 'B',
        ),
      },
    ];
  }

  /** Atomic DB transaction: create match + participants + update ratings + upsert synergy */
  private async persistMatchTransaction(
    sessionId: string,
    dto: SubmitMatchDto,
    playerResults: PlayerResult[],
    ratings: RatingMap,
  ): Promise<EloMatch> {
    return this.prisma.$transaction(async (tx) => {
      // Create EloMatch record
      const match = await tx.eloMatch.create({
        data: {
          sessionId,
          gameType: dto.gameType,
          score: dto.score,
          status: 'CONFIRMED',
          playedAt: dto.playedAt ? new Date(dto.playedAt) : new Date(),
        },
      });

      // Create participant audit records
      await tx.eloMatchParticipant.createMany({
        data: playerResults.map((p) => ({
          matchId: match.id,
          userId: p.userId,
          team: p.team,
          isWinner: p.isWinner,
          eloBefore: p.eloBefore,
          eloAfter: p.eloAfter,
          delta: p.delta,
          kFactor: p.kFactor,
          expectedScore: p.expectedScore,
          carryWeight: p.carryWeight,
          synergyBonus: p.synergyBonus,
          scoreMultiplier: p.scoreMultiplier,
        })),
      });

      // Update UserEloRating for each player
      for (const p of playerResults) {
        const newTotalGames = ratings[p.userId].totalGames + 1;
        await tx.userEloRating.update({
          where: {
            userId_gameType: { userId: p.userId, gameType: dto.gameType },
          },
          data: {
            eloScore: p.eloAfter,
            totalGames: newTotalGames,
            isCalibrating: newTotalGames < 5,
          },
        });
      }

      // Upsert PairSynergy (doubles/mixed only)
      if (dto.gameType !== GameType.SINGLES && dto.teamA.length === 2) {
        const pairs: [string, string][] = [
          [dto.teamA[0], dto.teamA[1]],
          [dto.teamB[0], dto.teamB[1]],
        ];
        for (const [a, b] of pairs) {
          const [playerIdA, playerIdB] = this.normalizePairKey(a, b);
          await tx.pairSynergy.upsert({
            where: {
              playerIdA_playerIdB_gameType: {
                playerIdA,
                playerIdB,
                gameType: dto.gameType,
              },
            },
            create: {
              playerIdA,
              playerIdB,
              gameType: dto.gameType,
              gamesTogether: 1,
            },
            update: { gamesTogether: { increment: 1 } },
          });
        }
      }

      return match;
    });
  }
}
