import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate/:bookingId')
  @UseGuards(AuthGuard)
  initiatePayment(@Param('bookingId') bookingId: string, @Req() req) {
    return this.paymentsService.initiatePayment(bookingId, req.user.id);
  }

  @Post('webhook/mock/:bookingId')
  mockWebhook(@Param('bookingId') bookingId: string) {
    return this.paymentsService.mockConfirmPayment(bookingId);
  }
}
