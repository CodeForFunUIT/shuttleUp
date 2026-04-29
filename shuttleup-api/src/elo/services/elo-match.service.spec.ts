import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { GameType } from '../../common/constants/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitMatchDto } from '../dto/submit-match.dto';
import { EloCalculationService } from './elo-calculation.service';
import { EloMatchService } from './elo-match.service';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockRating = (userId: string, eloScore = 1000, totalGames = 10) => ({
  id: `rating-${userId}`,
  userId,
  gameType: 'singles',
  eloScore,
  totalGames,
  isCalibrating: totalGames < 5,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockSession = (hostId: string, id = 'session-1') => ({
  id,
  hostId,
  gameType: 'singles',
  courtId: 'court-1',
  title: 'Test session',
  description: null,
  startTime: new Date(),
  endTime: new Date(),
  totalSlots: 4,
  availableSlots: 2,
  pricePerSlot: 0,
  skillRequired: 'ALL',
  status: 'OPEN',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const makeMockTx = () => ({
  eloMatch: {
    create: jest.fn().mockResolvedValue({
      id: 'match-1',
      sessionId: 'session-1',
      gameType: 'singles',
      score: '2-0',
      status: 'CONFIRMED',
      playedAt: new Date(),
      createdAt: new Date(),
    }),
  },
  eloMatchParticipant: {
    createMany: jest.fn().mockResolvedValue({ count: 2 }),
  },
  userEloRating: { update: jest.fn().mockResolvedValue({}) },
  pairSynergy: { upsert: jest.fn().mockResolvedValue({}) },
});

const makePrismaMock = () => {
  const tx = makeMockTx();
  return {
    courtSession: {
      findUnique: jest.fn(),
    },
    eloMatch: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
    userEloRating: {
      upsert: jest.fn().mockResolvedValue({}),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    eloMatchParticipant: {
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn().mockResolvedValue([]),
    },
    pairSynergy: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
    $transaction: jest
      .fn()
      .mockImplementation((fn: (tx: typeof tx) => Promise<unknown>) => fn(tx)),
  };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EloMatchService', () => {
  let service: EloMatchService;
  let prisma: ReturnType<typeof makePrismaMock>;
  let eventEmitter: { emit: jest.Mock };

  const HOST_ID = 'host-user-1';
  const PLAYER_A = 'player-a';
  const PLAYER_B = 'player-b';
  const SESSION_ID = 'session-1';

  const singlesDto: SubmitMatchDto = {
    gameType: GameType.SINGLES,
    score: '2-0',
    teamA: [PLAYER_A],
    teamB: [PLAYER_B],
    winner: 'A',
  };

  beforeEach(async () => {
    prisma = makePrismaMock();
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EloMatchService,
        EloCalculationService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get(EloMatchService);
  });

  describe('submitMatch — singles', () => {
    beforeEach(() => {
      prisma.courtSession.findUnique.mockResolvedValue(
        mockSession(HOST_ID, SESSION_ID),
      );
      prisma.userEloRating.findMany.mockResolvedValue([
        mockRating(PLAYER_A, 1200, 10),
        mockRating(PLAYER_B, 1000, 10),
      ]);
    });

    it('returns created EloMatch on success', async () => {
      const result = await service.submitMatch(SESSION_ID, singlesDto, HOST_ID);
      expect(result).toBeDefined();
      expect(result.id).toBe('match-1');
    });

    it('emits elo.match.confirmed event after success', async () => {
      await service.submitMatch(SESSION_ID, singlesDto, HOST_ID);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'elo.match.confirmed',
        expect.objectContaining({ matchId: 'match-1' }),
      );
    });

    it('creates participant records via transaction', async () => {
      await service.submitMatch(SESSION_ID, singlesDto, HOST_ID);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('submitMatch — authorization', () => {
    it('throws ForbiddenException if not host', async () => {
      prisma.courtSession.findUnique.mockResolvedValue(
        mockSession('other-host', SESSION_ID),
      );
      await expect(
        service.submitMatch(SESSION_ID, singlesDto, HOST_ID),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException if session does not exist', async () => {
      prisma.courtSession.findUnique.mockResolvedValue(null);
      await expect(
        service.submitMatch(SESSION_ID, singlesDto, HOST_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitMatch — duplicate prevention', () => {
    it('throws ConflictException if session already has ELO match', async () => {
      prisma.courtSession.findUnique.mockResolvedValue(
        mockSession(HOST_ID, SESSION_ID),
      );
      prisma.eloMatch.findUnique.mockResolvedValue({
        id: 'existing-match',
        sessionId: SESSION_ID,
      });
      await expect(
        service.submitMatch(SESSION_ID, singlesDto, HOST_ID),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('submitMatch — validation', () => {
    beforeEach(() => {
      prisma.courtSession.findUnique.mockResolvedValue(
        mockSession(HOST_ID, SESSION_ID),
      );
    });

    it('throws BadRequestException for singles with 2 players per team', async () => {
      const badDto: SubmitMatchDto = {
        ...singlesDto,
        gameType: GameType.SINGLES,
        teamA: ['p1', 'p2'], // wrong size
        teamB: ['p3', 'p4'],
      };
      await expect(
        service.submitMatch(SESSION_ID, badDto, HOST_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for doubles with 1 player per team', async () => {
      const badDto: SubmitMatchDto = {
        ...singlesDto,
        gameType: GameType.DOUBLES,
        teamA: ['p1'], // wrong size
        teamB: ['p2'],
      };
      await expect(
        service.submitMatch(SESSION_ID, badDto, HOST_ID),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for duplicate player IDs', async () => {
      const badDto: SubmitMatchDto = {
        ...singlesDto,
        teamA: [PLAYER_A],
        teamB: [PLAYER_A], // same player on both teams
      };
      await expect(
        service.submitMatch(SESSION_ID, badDto, HOST_ID),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findMatch', () => {
    it('returns match with participants', async () => {
      const matchWithParticipants = { id: 'match-1', participants: [] };
      prisma.eloMatch.findUnique.mockResolvedValue(matchWithParticipants as never);
      const result = await service.findMatch('match-1');
      expect(result.id).toBe('match-1');
    });

    it('throws NotFoundException for unknown match id', async () => {
      prisma.eloMatch.findUnique.mockResolvedValue(null);
      await expect(service.findMatch('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserMatchHistory', () => {
    it('returns paginated match history', async () => {
      prisma.eloMatchParticipant.count.mockResolvedValue(5);
      prisma.eloMatchParticipant.findMany.mockResolvedValue(
        [{ id: 'p1', match: {} }] as never,
      );
      const result = await service.getUserMatchHistory('user-1', 1, 10);
      expect(result.total).toBe(5);
      expect(result.data).toHaveLength(1);
    });
  });
});
