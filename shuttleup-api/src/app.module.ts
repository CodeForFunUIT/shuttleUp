import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Config namespaces
import appConfig from './config/app.config';
import redisConfig from './config/redis.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

// Feature modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CourtsModule } from './courts/courts.module';
import { SessionsModule } from './sessions/sessions.module';
import { RedisModule } from './redis/redis.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Config — isGlobal: true so ConfigService is available everywhere
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, redisConfig, databaseConfig, authConfig],
    }),

    // Event bus for decoupled cross-module communication
    EventEmitterModule.forRoot(),

    // 🚧 TẠM THỜI COMMENT ĐỂ TEST AUTH MÀ KHÔNG CẦN REDIS SERVER
    // BullModule.forRootAsync({
    //   useFactory: (config: ConfigService) => ({
    //     connection: {
    //       host: config.get<string>('redis.host'),
    //       port: config.get<number>('redis.port'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),

    ScheduleModule.forRoot(),

    // Infrastructure
    PrismaModule,
    RedisModule, // (Đã được mock RedisService mock)

    // Features
    AuthModule,
    UsersModule,
    CourtsModule,
    SessionsModule,
    BookingsModule,
    PaymentsModule,
    // NotificationsModule, // Tạm disable Module này vì nó phụ thuộc vào BullMQ
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
