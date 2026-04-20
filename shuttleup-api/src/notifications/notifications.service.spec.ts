import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockQueue = {
    add: jest.fn().mockResolvedValue(undefined),
  };

  const mockPrisma = {
    notification: {
      findMany: jest.fn().mockResolvedValue([]),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getQueueToken('notifications'), useValue: mockQueue },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should dispatch event to queue', async () => {
    await service.dispatch('booking.created', { bookingId: '1' });
    expect(mockQueue.add).toHaveBeenCalledWith(
      'booking.created',
      { bookingId: '1' },
      expect.objectContaining({ attempts: 3 }),
    );
  });

  it('should get user notifications', async () => {
    const result = await service.getUserNotifications('user-123');
    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-123' } }),
    );
    expect(result).toEqual([]);
  });
});
