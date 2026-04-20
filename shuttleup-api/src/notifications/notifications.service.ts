import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { BookingCreatedEvent, BookingCancelledEvent } from '../common/events/booking.events';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private prisma: PrismaService
  ) {}

  /**
   * Dispatch an event to BullMQ (internal helper)
   */
  async dispatch(eventName: string, payload: unknown) {
    try {
      await this.notificationsQueue.add(eventName, payload, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      });
      this.logger.log(`Dispatched ${eventName} to queue`);
    } catch (error) {
      this.logger.error(`Failed to dispatch ${eventName}:`, error);
    }
  }

  // ─── Event Listeners ───────────────────────────────────────────────────────

  @OnEvent('booking.created')
  handleBookingCreated(event: BookingCreatedEvent) {
    this.dispatch('booking.created', {
      bookingId: event.bookingId,
      sessionId: event.sessionId,
      hostId: event.hostId,
    });
  }

  @OnEvent('booking.cancelled')
  handleBookingCancelled(event: BookingCancelledEvent) {
    this.dispatch('booking.cancelled', {
      bookingId: event.bookingId,
      sessionId: event.sessionId,
    });
  }

  // ─── User-facing Methods ────────────────────────────────────────────────────

  /**
   * Get in-app notifications for user
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
