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
             credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
          });
        }
      }
    } catch (e) {
      this.logger.warn('Firebase Admin not initialized properly', e);
    }
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'booking.created': {
        await this.handleBookingCreated(job.data);
        break;
      }
      case 'booking.cancelled': {
        await this.handleBookingCancelled(job.data);
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleBookingCreated(data: { bookingId: string, sessionId: string, hostId: string }) {
    // 1. Fetch data
    const host = await this.prisma.user.findUnique({ where: { id: data.hostId } });
    const session = await this.prisma.courtSession.findUnique({ where: { id: data.sessionId }, include: { court: true } });
    
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
        link: `/sessions/${session.id}`
      }
    });

    // 3. Send Email (if real API key present)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'ShuttleUp <noreply@shuttleup.io>',
          to: host.email,
          subject: title,
          html: `<p>${message}</p><p>Check your dashboard for more details.</p>`
        });
      } catch (e) {
        this.logger.error('Resend email failed', e);
      }
    }

    // 4. Send FCM Push Notification
    // Assumption: we have device tokens stored somewhere. (We don't yet, so this is a placeholder check.)
    // if (host.fcmToken) {
    //    await admin.messaging().send({ token: host.fcmToken, notification: { title, body: message } });
    // }
  }

  private async handleBookingCancelled(data: { bookingId: string, sessionId: string, hostId: string }) {
    // Logic similar to booking.created
    const host = await this.prisma.user.findUnique({ where: { id: data.hostId } });
    const session = await this.prisma.courtSession.findUnique({ where: { id: data.sessionId }, include: { court: true } });
    
    if (!host || !session) return;

    await this.prisma.notification.create({
      data: {
        userId: host.id,
        title: 'Booking Cancelled',
        message: `A participant cancelled their slot for ${session.court.name}.`,
        type: 'BOOKING_CANCELLED'
      }
    });
  }
}
