// Mock better-auth ESM dependency before any imports to prevent Jest parse error
jest.mock('../auth/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    auth: {
      api: {
        getSession: jest.fn(),
      },
    },
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../common/guards/auth.guard';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockNotificationsService = {
    getUserNotifications: jest.fn().mockResolvedValue([]),
    markAsRead: jest.fn().mockResolvedValue({ count: 1 }),
    markAllAsRead: jest.fn().mockResolvedValue({ count: 5 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return notifications for user', async () => {
    const result = await controller.getMine('user-123');
    expect(result).toEqual([]);
    expect(mockNotificationsService.getUserNotifications).toHaveBeenCalledWith('user-123');
  });

  it('should mark notification as read', async () => {
    const result = await controller.markAsRead('notif-1', 'user-123');
    expect(result).toEqual({ count: 1 });
    expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith('notif-1', 'user-123');
  });
});
