import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateBookingDto } from './dto/booking.dto';
import { BookingStatus, PaymentStatus } from '../common/constants/enums';
import {
  BookingCreatedEvent,
  BookingCancelledEvent,
} from '../common/events/booking.events';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId?: string) {
    const { sessionId, guestName, guestPhone } = createBookingDto;

    if (!userId && (!guestName || !guestPhone)) {
      throw new BadRequestException('Guest bookings require name and phone');
    }

    const lockKey = `lock:session:${sessionId}`;
    const locked = await this.redis.acquireLock(lockKey, 5);
    if (!locked) {
      throw new ConflictException(
        'Session is being booked by another user. Please retry briefly.',
      );
    }

    try {
      const session = await this.prisma.courtSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new BadRequestException('Session not found');
      }

      // ELO sessions require registered users (guests cannot participate in ranked matches)
      if (session.gameType && !userId) {
        throw new BadRequestException(
          'ELO sessions require a registered account. Please sign up to join this session.',
        );
      }

      if (session.availableSlots <= 0) {
        throw new ConflictException('No slots available for this session');
      }

      if (userId) {
        const existing = await this.prisma.booking.findFirst({
          where: {
            sessionId,
            userId,

            status: { not: BookingStatus.CANCELLED },
          },
        });
        if (existing)
          throw new ConflictException('You have already booked this session');
      }

      const [booking] = await this.prisma.$transaction([
        this.prisma.booking.create({
          data: {
            sessionId,
            userId: userId || null,
            guestName: userId ? null : guestName,
            guestPhone: userId ? null : guestPhone,
            status: BookingStatus.PENDING_PAYMENT,
            amountPaid: 0,
          },
        }),
        this.prisma.courtSession.update({
          where: { id: sessionId },
          data: { availableSlots: { decrement: 1 } },
        }),
      ]);

      // Emit event — NotificationsService listens via @OnEvent()
      this.eventEmitter.emit(
        'booking.created',
        new BookingCreatedEvent(booking.id, session.id, session.hostId),
      );

      return booking;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  async cancel(bookingId: string, userId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userId && booking.userId && booking.userId !== userId) {
      throw new ConflictException('Unauthorized cancellation');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException('Booking is already cancelled');
    }

    // Cancellation logic simulating mock refund and freeing up slots
    await this.prisma.$transaction(async (tx) => {
      // 1. Mark booking cancelled
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // Mock refund if previously paid
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (booking.payment && booking.payment.status === PaymentStatus.SUCCESS) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.REFUNDED },
        });
      }

      // 3. Return the slot to the pool
      await tx.courtSession.update({
        where: { id: booking.sessionId },
        data: { availableSlots: { increment: 1 } },
      });
    });

    // Emit event — NotificationsService listens via @OnEvent()
    this.eventEmitter.emit(
      'booking.cancelled',
      new BookingCancelledEvent(booking.id, booking.sessionId),
    );

    return { message: 'Booking cancelled and slots returned' };
  }
}
