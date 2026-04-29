import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GameType } from '../../common/constants/enums';
import { PrismaService } from '../../prisma/prisma.service';

export class UserCreatedEvent {
  constructor(public readonly userId: string) {}
}

/**
 * Seeds initial EloRating rows for new users.
 * Listens for 'user.created' event emitted after successful registration.
 */
@Injectable()
export class EloSeedService {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    const gameTypes: GameType[] = [
      GameType.SINGLES,
      GameType.DOUBLES,
      GameType.MIXED,
    ];

    // Upsert is idempotent — safe to call multiple times
    await this.prisma.$transaction(
      gameTypes.map((gameType) =>
        this.prisma.userEloRating.upsert({
          where: { userId_gameType: { userId: event.userId, gameType } },
          create: {
            userId: event.userId,
            gameType,
            eloScore: 1000,
            totalGames: 0,
            isCalibrating: true,
          },
          update: {}, // no-op if already exists
        }),
      ),
    );
  }
}
