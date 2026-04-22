import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/court.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('Courts')
@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new court (admin)' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @ApiOperation({
    summary: 'Get all courts (optionally filter by lat/lng proximity)',
  })
  @Get()
  findAll(@Query('lat') lat?: number, @Query('lng') lng?: number) {
    if (lat && lng) {
      return this.courtsService.findNearby(Number(lat), Number(lng));
    }
    return this.courtsService.findAll();
  }

  @ApiOperation({ summary: 'Get court by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }
}
