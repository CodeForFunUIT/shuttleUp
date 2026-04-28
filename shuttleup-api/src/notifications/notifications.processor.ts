import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import * as admin from 'firebase-admin';

// Make sure your .env has RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
    // Initialize Firebase Admin if Service Account JSON is provided in env
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(
              JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT,
              ) as admin.ServiceAccount,
            ),
          });
        }
      }
    } catch (e) {
      this.logger.warn('Firebase Admin not initialized properly', e);
    }
  }

  async process(job: Job<unknown, void, string>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'booking.created': {
        await this.handleBookingCreated(
          job.data as { bookingId: string; sessionId: string; hostId: string },
        );
        break;
      }
      case 'booking.cancelled': {
        await this.handleBookingCancelled(
          job.data as { bookingId: string; sessionId: string; hostId: string },
        );
        break;
      }
      case 'session.reminder': {
        await this.handleSessionReminder(
          job.data as { sessionId: string; userId: string },
        );
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleBookingCreated(data: {
    bookingId: string;
    sessionId: string;
    hostId: string;
  }) {
    // 1. Fetch data
    const host = await this.prisma.user.findUnique({
      where: { id: data.hostId },
    });
    const session = await this.prisma.courtSession.findUnique({
      where: { id: data.sessionId },
      include: { court: true },
    });

    if (!host || !session) return;

    const title = 'New Booking Received!';
    const message = `Someone just booked a slot for your session at ${session.court.name}.`;

    // 2. Save In-App Notification
    await this.prisma.notification.create({
      data: {
        userId: host.id,
        title,
        message,
        type: 'BOOKING_CREATED',
        link: `/sessions/${session.id}`,
      },
    });

    // 3. Send Email (if real API key present)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ShuttleUp <noreply@shuttleup.io>',
          to: host.email,
          subject: title,
          html: `<p>${message}</p><p>Check your dashboard for more details.</p>`,
        });
      } catch (e) {
        this.logger.error('Resend email failed', e);
      }
    }

    // 4. Send FCM Push Notification
    // TODO: fcmToken/pushEnabled will be restored when FCM is re-enabled
    const hostData = host as unknown as {
      pushEnabled?: boolean;
      fcmToken?: string;
    };
    if (hostData.pushEnabled && hostData.fcmToken) {
      try {
        await admin.messaging().send({
          token: hostData.fcmToken,
          notification: { title, body: message },
        });
        this.logger.log(`Sent FCM push to ${host.id}`);
      } catch (e) {
        this.logger.error('Failed to send FCM push', e);
      }
    }
  }

  private async handleBookingCancelled(data: {
    bookingId: string;
    sessionId: string;
    hostId: string;
  }) {
    // Logic similar to booking.created
    const host = await this.prisma.user.findUnique({
      where: { id: data.hostId },
    });
    const session = await this.prisma.courtSession.findUnique({
      where: { id: data.sessionId },
      include: { court: true },
    });

    if (!host || !session) return;

    const title = 'Booking Cancelled';
    const message = `A participant cancelled their slot for ${session.court.name}.`;

    await this.prisma.notification.create({
      data: {
        userId: host.id,
        title,
        message,
        type: 'BOOKING_CANCELLED',
      },
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ShuttleUp <noreply@shuttleup.io>',
          to: host.email,
          subject: title,
          html: `<p>${message}</p>`,
        });
      } catch (e) {
        this.logger.error('Resend email failed', e);
      }
    }

    // TODO: fcmToken/pushEnabled will be restored when FCM is re-enabled
    const hostData = host as unknown as {
      pushEnabled?: boolean;
      fcmToken?: string;
    };
    if (hostData.pushEnabled && hostData.fcmToken) {
      try {
        await admin.messaging().send({
          token: hostData.fcmToken,
          notification: { title, body: message },
        });
      } catch (e) {
        this.logger.error('Failed to send FCM push', e);
      }
    }
  }

  private async handleSessionReminder(data: {
    sessionId: string;
    userId: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });
    const session = await this.prisma.courtSession.findUnique({
      where: { id: data.sessionId },
      include: { court: true },
    });

    if (!user || !session) return;

    const title = 'Session Reminder';
    const message = `Your badminton session at ${session.court.name} starts in 1 hour!`;

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        title,
        message,
        type: 'SESSION_REMINDER',
        link: `/sessions/${session.id}`,
      },
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ShuttleUp <noreply@shuttleup.io>',
          to: user.email,
          subject: title,
          html: `<p>${message}</p>`,
        });
      } catch (e) {
        this.logger.error('Resend email failed', e);
      }
    }

    // TODO: fcmToken/pushEnabled will be restored when FCM is re-enabled
    const userData = user as unknown as {
      pushEnabled?: boolean;
      fcmToken?: string;
    };
    if (userData.pushEnabled && userData.fcmToken) {
      try {
        await admin.messaging().send({
          token: userData.fcmToken,
          notification: { title, body: message },
        });
      } catch (e) {
        this.logger.error('Failed to send FCM push', e);
      }
    }
  }
}
