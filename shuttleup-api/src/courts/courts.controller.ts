import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/court.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  findAll(@Query('lat') lat?: number, @Query('lng') lng?: number) {
    if (lat && lng) {
      return this.courtsService.findNearby(Number(lat), Number(lng));
    }
    return this.courtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }
}
