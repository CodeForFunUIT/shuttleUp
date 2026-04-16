import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService, 
    private redis: RedisService,
    private notifications: NotificationsService
  ) {}

  async create(createBookingDto: CreateBookingDto, userId?: string) {
    const { sessionId, guestName, guestPhone } = createBookingDto;

    if (!userId && (!guestName || !guestPhone)) {
      throw new BadRequestException('Guest bookings require name and phone');
    }

    const lockKey = `lock:session:${sessionId}`;
    const locked = await this.redis.acquireLock(lockKey, 5);
    if (!locked) {
      throw new ConflictException('Session is being booked by another user. Please retry briefly.');
    }

    try {
      const session = await this.prisma.courtSession.findUnique({ where: { id: sessionId } });
      
      if (!session) {
        throw new BadRequestException('Session not found');
      }

      if (session.availableSlots <= 0) {
        throw new ConflictException('No slots available for this session');
      }

      if (userId) {
        const existing = await this.prisma.booking.findFirst({
          where: { sessionId, userId, status: { not: 'CANCELLED' } }
        });
        if (existing) throw new ConflictException('You have already booked this session');
      }

      const [booking] = await this.prisma.$transaction([
        this.prisma.booking.create({
          data: {
            sessionId,
            userId: userId || null,
            guestName: userId ? null : guestName,
            guestPhone: userId ? null : guestPhone,
            status: 'PENDING_PAYMENT',
            amountPaid: 0,
          }
        }),
        this.prisma.courtSession.update({
          where: { id: sessionId },
          data: { availableSlots: { decrement: 1 } }
        })
      ]);

      // Dispatch booking created notification
      this.notifications.dispatch('booking.created', {
        bookingId: booking.id,
        sessionId: session.id,
        hostId: session.hostId
      });

      return booking;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  async cancel(bookingId: string, userId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userId && booking.userId && booking.userId !== userId) {
      throw new ConflictException('Unauthorized cancellation');
    }

    if (booking.status === 'CANCELLED') {
      throw new ConflictException('Booking is already cancelled');
    }

    // Cancellation logic simulating mock refund and freeing up slots
    await this.prisma.$transaction(async (tx) => {
      // 1. Mark booking cancelled
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      });

      // 2. Mock refund if previously paid
      if (booking.payment && booking.payment.status === 'SUCCESS') {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: 'REFUNDED' }
        });
      }

      // 3. Return the slot to the pool
      await tx.courtSession.update({
        where: { id: booking.sessionId },
        data: { availableSlots: { increment: 1 } }
      });
    });

    // Dispatch cancellation notification
    this.notifications.dispatch('booking.cancelled', {
      bookingId: booking.id,
      sessionId: booking.sessionId,
      hostId: booking.payment ? null : null // We'll fetch host downstream in processor
    });

    return { success: true, message: 'Booking cancelled and slots returned' };
  }
}
