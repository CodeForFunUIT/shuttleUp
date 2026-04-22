import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';
import { SessionStatus, BookingStatus } from '../common/constants/enums';

@Injectable()
export class NotificationsCron {
  private readonly logger = new Logger(NotificationsCron.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Run every 15 minutes to find sessions starting exactly in 1 hour
   * and push reminder events into the queue.
   */
  @Cron('0 */15 * * * *') // Every 15 minutes
  async handleSessionReminders() {
    this.logger.log('Running 1-hour session reminder check...');
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    // Add a 15-minute window for checking, covering until the next cron execution
    const oneHour15MinutesFromNow = new Date(
      oneHourFromNow.getTime() + 15 * 60 * 1000,
    );

    const upcomingSessions = await this.prisma.courtSession.findMany({
      where: {
        status: { notIn: [SessionStatus.CANCELLED, SessionStatus.COMPLETED] },
        startTime: {
          gte: oneHourFromNow,
          lt: oneHour15MinutesFromNow,
        },
      },
      include: {
        host: true,
        bookings: {
          include: { user: true },
        },
      },
    });

    for (const session of upcomingSessions) {
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        session.status !== SessionStatus.OPEN &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        session.status !== SessionStatus.FULL
      )
        continue;

      this.logger.log(`Queueing reminder for session ${session.id}`);

      // Collect all users (host + booked users who have an account)
      const userIds = new Set<string>();
      userIds.add(session.hostId);

      session.bookings.forEach((bk) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (bk.status === BookingStatus.CONFIRMED && bk.userId) {
          userIds.add(bk.userId);
        }
      });

      // Dispatch one event per user or a bulk event depending on preference
      userIds.forEach((userId) => {
        void this.notificationsService.dispatch('session.reminder', {
          sessionId: session.id,
          userId,
        });
      });
    }
  }
}
