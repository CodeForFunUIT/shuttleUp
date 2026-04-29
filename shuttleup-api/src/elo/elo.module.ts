import { Module } from '@nestjs/common';
import { EloController } from './elo.controller';
import { EloCalculationService } from './services/elo-calculation.service';
import { EloLeaderboardService } from './services/elo-leaderboard.service';
import { EloMatchService } from './services/elo-match.service';
import { EloSeedService } from './services/elo-seed.service';

@Module({
  controllers: [EloController],
  providers: [
    EloCalculationService,
    EloMatchService,
    EloLeaderboardService,
    EloSeedService,
  ],
  exports: [EloCalculationService], // expose for potential future use in other modules
})
export class EloModule {}
