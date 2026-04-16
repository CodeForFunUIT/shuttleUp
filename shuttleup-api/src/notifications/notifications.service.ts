import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private prisma: PrismaService
  ) {}

  /**
   * Dispatch an event to BullMQ
   */
  async dispatch(eventName: string, payload: any) {
    try {
      await this.notificationsQueue.add(eventName, payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 }
      });
      this.logger.log(`Dispatched ${eventName} to queue`);
    } catch (error) {
      this.logger.error(`Failed to dispatch ${eventName}:`, error);
    }
  }

  /**
   * Get in-app notifications for user
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });
  }
  
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}
