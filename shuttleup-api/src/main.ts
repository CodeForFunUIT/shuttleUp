import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // ── Global Pipes ──────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown properties
      transform: true,       // Auto-transform to DTO types
      forbidNonWhitelisted: false,
    }),
  );

  // ── Global Interceptors & Filters ─────────────────────────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );

  // ── API Prefix & CORS ─────────────────────────────────────────────────────
  const apiPrefix = config.get<string>('app.apiPrefix') ?? 'api';
  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: config.get<string>('app.corsOrigin'),
    credentials: true,
  });

  // ── Swagger / OpenAPI ─────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ShuttleUp API')
    .setDescription(
      'Full-stack badminton session platform — booking, courts, ELO matching, payments.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication via Better Auth')
    .addTag('Sessions', 'Badminton session management')
    .addTag('Courts', 'Court management')
    .addTag('Bookings', 'Session booking (guest & authenticated)')
    .addTag('Payments', 'Payment initiation and webhooks')
    .addTag('Notifications', 'In-app push notifications')
    .addTag('Users', 'User profile management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = config.get<number>('app.port') ?? 3000;
  await app.listen(port);
  console.log(`🏸 ShuttleUp API running at http://localhost:${port}/${apiPrefix}`);
  console.log(`📄 Swagger UI at http://localhost:${port}/docs`);
}

bootstrap();
