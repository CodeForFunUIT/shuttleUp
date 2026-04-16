import { Controller, Post, Body, Req, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('guest')
  createGuest(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  createAuth(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Post(':id/cancel/guest')
  cancelGuest(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  cancelAuth(@Req() req, @Param('id') id: string) {
    return this.bookingsService.cancel(id, req.user.id);
  }
}
