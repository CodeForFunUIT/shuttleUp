import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

//test
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

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
