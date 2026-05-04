import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ── Static GET routes BEFORE param routes ────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get pending-approval bookings for a session (host only)',
  })
  @UseGuards(AuthGuard)
  @Get('pending')
  getPending(
    @CurrentUser('id') userId: string,
    @Query('sessionId') sessionId: string,
  ) {
    return this.bookingsService.getPendingBySession(sessionId, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get pending counts for all host sessions (dashboard dot)',
  })
  @UseGuards(AuthGuard)
  @Get('pending/counts')
  getPendingCounts(@CurrentUser('id') userId: string) {
    return this.bookingsService.getPendingCountsByHost(userId);
  }

  // ── Booking creation ─────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Book a session as guest (no auth required)' })
  @Post('guest')
  createGuest(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a session as authenticated user' })
  @UseGuards(AuthGuard)
  @Post()
  createAuth(
    @CurrentUser('id') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  // ── Approval / Rejection ─────────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a booking request (host only)' })
  @UseGuards(AuthGuard)
  @Patch(':id/approve')
  approve(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.approve(id, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a booking request (host only)' })
  @UseGuards(AuthGuard)
  @Patch(':id/reject')
  reject(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.reject(id, userId);
  }

  // ── Cancellation ─────────────────────────────────────────────────────────

  @ApiOperation({ summary: 'Cancel a booking as guest' })
  @Post(':id/cancel/guest')
  cancelGuest(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking as authenticated user' })
  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  cancelAuth(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.bookingsService.cancel(id, userId);
  }
}
