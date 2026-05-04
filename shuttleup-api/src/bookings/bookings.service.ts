import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateBookingDto } from './dto/booking.dto';
import {
  BookingStatus,
  PaymentStatus,
  SessionStatus,
} from '../common/constants/enums';
import {
  BookingCreatedEvent,
  BookingCancelledEvent,
  BookingRequestedEvent,
  BookingApprovedEvent,
  BookingRejectedEvent,
} from '../common/events/booking.events';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a booking request (status: PENDING_APPROVAL).
   * Slots are NOT decremented until host approves.
   */
  async create(createBookingDto: CreateBookingDto, userId?: string) {
    const { sessionId, guestName, guestPhone } = createBookingDto;

    if (!userId && (!guestName || !guestPhone)) {
      throw new BadRequestException('Guest bookings require name and phone');
    }

    const session = await this.prisma.courtSession.findUnique({
      where: { id: sessionId },
      include: { host: { select: { name: true } } },
    });

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    // Prevent host from booking their own session
    if (userId && userId === session.hostId) {
      throw new ForbiddenException('You cannot book your own session');
    }

    if (session.gameType && !userId) {
      throw new BadRequestException(
        'ELO sessions require a registered account.',
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
          status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
        },
      });
      if (existing) {
        throw new ConflictException('You have already booked this session');
      }
    }

    // Prevent guest duplicate bookings with same phone number
    if (!userId && guestPhone) {
      const existingGuest = await this.prisma.booking.findFirst({
        where: {
          sessionId,
          guestPhone,
          status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
        },
      });
      if (existingGuest) {
        throw new ConflictException(
          'A booking with this phone number already exists for this session',
        );
      }
    }

    const booking = await this.prisma.booking.create({
      data: {
        sessionId,
        userId: userId || null,
        guestName: userId ? null : guestName,
        guestPhone: userId ? null : guestPhone,
        status: BookingStatus.PENDING_APPROVAL,
        amountPaid: 0,
      },
    });

    // Emit event for notifications
    const requesterName = guestName || 'A registered user';
    this.eventEmitter.emit(
      'booking.requested',
      new BookingRequestedEvent(
        booking.id,
        session.id,
        session.hostId,
        requesterName,
        session.title,
      ),
    );

    return booking;
  }

  /**
   * Host approves a pending booking request.
   * Decrements availableSlots atomically with Redis lock.
   */
  async approve(bookingId: string, hostUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.session.hostId !== hostUserId) {
      throw new ForbiddenException('Only the session host can approve');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new ConflictException('Booking is not pending approval');
    }

    const lockKey = `lock:session:${booking.sessionId}`;
    const locked = await this.redis.acquireLock(lockKey, 5);
    if (!locked) {
      throw new ConflictException('Please retry briefly.');
    }

    try {
      // Re-check slots under lock
      const session = await this.prisma.courtSession.findUnique({
        where: { id: booking.sessionId },
      });

      if (!session || session.availableSlots <= 0) {
        throw new ConflictException('Session is full — cannot approve');
      }

      const newAvailable = session.availableSlots - 1;

      await this.prisma.$transaction([
        this.prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.PENDING_PAYMENT },
        }),
        this.prisma.courtSession.update({
          where: { id: booking.sessionId },
          data: {
            availableSlots: { decrement: 1 },
            ...(newAvailable === 0 ? { status: SessionStatus.FULL } : {}),
          },
        }),
      ]);

      this.eventEmitter.emit(
        'booking.approved',
        new BookingApprovedEvent(booking.id, booking.sessionId, booking.userId),
      );

      // Also emit the legacy event for existing notification flow
      this.eventEmitter.emit(
        'booking.created',
        new BookingCreatedEvent(
          booking.id,
          booking.sessionId,
          booking.session.hostId,
        ),
      );

      return { message: 'Booking approved' };
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  /**
   * Host rejects a pending booking request.
   */
  async reject(bookingId: string, hostUserId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.session.hostId !== hostUserId) {
      throw new ForbiddenException('Only the session host can reject');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (booking.status !== BookingStatus.PENDING_APPROVAL) {
      throw new ConflictException('Booking is not pending approval');
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.REJECTED },
    });

    this.eventEmitter.emit(
      'booking.rejected',
      new BookingRejectedEvent(booking.id, booking.sessionId, booking.userId),
    );

    return { message: 'Booking rejected' };
  }

  /**
   * Get pending-approval bookings for a specific session (host-only).
   */
  async getPendingBySession(sessionId: string, hostUserId: string) {
    const session = await this.prisma.courtSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new NotFoundException('Session not found');
    if (session.hostId !== hostUserId) {
      throw new ForbiddenException('Not the host of this session');
    }

    return this.prisma.booking.findMany({
      where: { sessionId, status: BookingStatus.PENDING_APPROVAL },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            eloScore: true,
            skillLevel: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get pending-approval counts grouped by session for all sessions hosted by user.
   * Returns { [sessionId]: count } for the dashboard notification dots.
   */
  async getPendingCountsByHost(
    hostUserId: string,
  ): Promise<Record<string, number>> {
    const counts = await this.prisma.booking.groupBy({
      by: ['sessionId'],
      where: {
        status: BookingStatus.PENDING_APPROVAL,
        session: { hostId: hostUserId },
      },
      _count: { id: true },
    });

    const result: Record<string, number> = {};
    for (const row of counts) {
      result[row.sessionId] = row._count.id;
    }
    return result;
  }

  /**
   * Check if the current user already has an active booking for a session.
   */
  async getMyBookingStatus(sessionId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        sessionId,
        userId,
        status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
      },
      select: { id: true, status: true, createdAt: true },
    });
    return { hasActiveBooking: !!booking, booking: booking ?? undefined };
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

    // If still pending approval, just mark as cancelled — no slot to return
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (booking.status === BookingStatus.PENDING_APPROVAL) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });
      return { message: 'Booking request cancelled' };
    }

    // Cancellation logic — return slot and handle refund
    await this.prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (booking.payment && booking.payment.status === PaymentStatus.SUCCESS) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.REFUNDED },
        });
      }

      await tx.courtSession.update({
        where: { id: booking.sessionId },
        data: { availableSlots: { increment: 1 } },
      });
    });

    this.eventEmitter.emit(
      'booking.cancelled',
      new BookingCancelledEvent(booking.id, booking.sessionId),
    );

    return { message: 'Booking cancelled and slots returned' };
  }
}
