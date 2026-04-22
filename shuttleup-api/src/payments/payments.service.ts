import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // In guest bookings there is no userId, but this route is protected right now
    if (booking.userId !== userId && booking.userId !== null) {
      throw new BadRequestException('Unauthorized payment attempt');
    }

    if (booking.status !== 'PENDING_PAYMENT') {
      throw new ConflictException('Booking is not awaiting payment');
    }

    // Set a transaction inside payments table as PENDING
    const payment = await this.prisma.payment.upsert({
      where: { bookingId },
      update: {},
      create: {
        bookingId,
        provider: 'MOCK_VNPAY',
        amount: booking.session.pricePerSlot,
        status: 'PENDING',
        transactionId: `mock_txn_${Date.now()}`,
      },
    });

    // Return mock redirect link
    return {
      success: true,
      data: {
        redirectUrl: `http://localhost:3000/mock-payment?txn=${payment.transactionId}&callback=/payments/webhook/mock/${booking.id}`,
      },
    };
  }

  async mockConfirmPayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING_PAYMENT')
      throw new ConflictException('Booking already processed');

    // Simulate webhook logic updates
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { bookingId },
        data: { status: 'SUCCESS' },
      }),
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED', amountPaid: booking.session.pricePerSlot },
      }),
    ]);

    return { success: true, message: 'Mock payment verified' };
  }
}
