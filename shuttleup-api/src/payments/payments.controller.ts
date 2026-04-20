import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Initiate payment for a booking' })
  @Post('initiate/:bookingId')
  initiatePayment(
    @Param('bookingId') bookingId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentsService.initiatePayment(bookingId, userId);
  }

  @ApiOperation({ summary: 'Mock payment webhook confirmation (dev only)' })
  @Post('webhook/mock/:bookingId')
  mockWebhook(@Param('bookingId') bookingId: string) {
    return this.paymentsService.mockConfirmPayment(bookingId);
  }
}
