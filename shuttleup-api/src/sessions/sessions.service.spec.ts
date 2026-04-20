import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SessionsService', () => {
  let service: SessionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    courtSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a session when found', async () => {
      const mockSession = { id: 'session-id', title: 'Test Session', hostId: 'host-id' };
      
      mockPrismaService.courtSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.findOne('session-id');
      
      expect(prisma.courtSession.findUnique).toHaveBeenCalledWith({
        where: { id: 'session-id' },
        include: {
          court: true,
          host: { select: { id: true, name: true, eloScore: true } },
          bookings: { select: { id: true, status: true, guestName: true, user: { select: { name: true, eloScore: true } } } }
        }
      });
      expect(result).toEqual(mockSession);
    });

    it('should throw NotFoundException when session is not found', async () => {
      mockPrismaService.courtSession.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('invalid-id')).rejects.toThrow('Session not found');
    });
  });

  describe('create', () => {
    it('should successfully create a new session', async () => {
      const createDto = {
        courtId: 'court-1',
        title: 'New Smash',
        description: 'Friendly match',
        startTime: '2026-05-10T10:00:00Z',
        endTime: '2026-05-10T12:00:00Z',
        totalSlots: 10,
        pricePerSlot: 50000,
        skillRequired: 'BEGINNER'
      };

      const expectedCreatedSession = {
        id: 'new-session-id',
        hostId: 'host-1',
        ...createDto,
        status: 'OPEN',
        availableSlots: 10,
        startTime: new Date(createDto.startTime),
        endTime: new Date(createDto.endTime),
      };

      mockPrismaService.courtSession.create.mockResolvedValue(expectedCreatedSession);

      const result = await service.create('host-1', createDto);

      expect(prisma.courtSession.create).toHaveBeenCalledWith({
        data: {
          hostId: 'host-1',
          courtId: 'court-1',
          title: 'New Smash',
          description: 'Friendly match',
          startTime: new Date('2026-05-10T10:00:00Z'),
          endTime: new Date('2026-05-10T12:00:00Z'),
          totalSlots: 10,
          availableSlots: 10,
          pricePerSlot: 50000,
          skillRequired: 'BEGINNER',
          status: 'OPEN',
        }
      });
      
      expect(result).toEqual(expectedCreatedSession);
    });
  });
});
