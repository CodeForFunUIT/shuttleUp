import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GameType } from '../common/constants/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { SubmitMatchDto } from './dto/submit-match.dto';
import { EloLeaderboardService } from './services/elo-leaderboard.service';
import { EloMatchService } from './services/elo-match.service';

@ApiTags('ELO')
@Controller('elo')
export class EloController {
  constructor(
    private readonly eloMatch: EloMatchService,
    private readonly eloLeaderboard: EloLeaderboardService,
  ) {}

  // ─── Submit ───────────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit match result for a session (host only)',
    description:
      'Host submits the final score. ELO ratings are updated immediately.',
  })
  @UseGuards(AuthGuard)
  @Post('sessions/:sessionId/result')
  submitResult(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitMatchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.eloMatch.submitMatch(sessionId, dto, userId);
  }

  // ─── Match detail ─────────────────────────────────────────────────────────

  @Public()
  @ApiOperation({ summary: 'Get match detail with full audit trail' })
  @Get('matches/:id')
  getMatch(@Param('id') id: string) {
    return this.eloMatch.findMatch(id);
  }

  // ─── Leaderboard ─────────────────────────────────────────────────────────

  @Public()
  @ApiOperation({
    summary: 'Get ELO leaderboard by game type',
    description: 'Only shows players with ≥ 5 completed matches (settled ELO)',
  })
  @ApiQuery({ name: 'gameType', enum: GameType, required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('leaderboard')
  getLeaderboard(
    @Query('gameType') gameType: GameType = GameType.SINGLES,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.eloLeaderboard.getLeaderboard(gameType, +page, +limit);
  }

  // ─── User profile ─────────────────────────────────────────────────────────

  @Public()
  @ApiOperation({ summary: 'Get user ELO profile across all game types' })
  @Get('users/:userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.eloLeaderboard.getUserProfile(userId);
  }

  @Public()
  @ApiOperation({ summary: 'Get paginated match history for a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('users/:userId/history')
  getUserHistory(
    @Param('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.eloMatch.getUserMatchHistory(userId, +page, +limit);
  }

  // ─── Pair info ────────────────────────────────────────────────────────────

  @Public()
  @ApiOperation({
    summary: 'Get pair synergy and mismatch level between two players',
    description:
      'Returns chemistry score and ELO mismatch warning level. Used for pre-match player compatibility display.',
  })
  @ApiQuery({ name: 'gameType', enum: GameType, required: false })
  @Get('pairs/:userIdA/:userIdB')
  getPairInfo(
    @Param('userIdA') userIdA: string,
    @Param('userIdB') userIdB: string,
    @Query('gameType') gameType: GameType = GameType.SINGLES,
  ) {
    return this.eloLeaderboard.getPairInfo(userIdA, userIdB, gameType);
  }
}
