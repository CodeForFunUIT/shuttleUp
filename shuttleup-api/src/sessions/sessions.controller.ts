import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/session.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new badminton session (Host only)' })
  @UseGuards(AuthGuard)
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionsService.create(userId, createSessionDto);
  }

  @ApiOperation({ summary: 'Get all sessions' })
  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @ApiOperation({ summary: 'Search nearby sessions (supports geo-search via lat/lng)' })
  @Get('search')
  search(@Query() query: SearchSessionDto) {
    return this.sessionsService.searchNearby(query);
  }

  @ApiOperation({ summary: 'Get session details by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }
}
