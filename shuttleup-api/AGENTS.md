# ShuttleUp API — Agent Instructions & Rules

## Context

Backend service for **ShuttleUp** — a full-stack badminton session booking, court management, and ELO ranking platform.
Part of the monorepo: `shuttleup-api` (NestJS) + `shuttleup-web` (Next.js) + `shuttleup-mobile` (Flutter).

**Shared Docs:** `../docs/` (Code Standards, System Architecture, Database Schema).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 (Modular Monolith) |
| Runtime & Language | Node.js 22+ / TypeScript 5.7+ |
| Database & ORM | PostgreSQL 16 + PostGIS via Prisma 7 |
| Cache & Queue | Redis 7 + BullMQ (`@nestjs/bullmq`) |
| Authentication | Better Auth (Bearer JWT + anonymous guest mode) |
| Validation | `class-validator` + `class-transformer` |
| Documentation | OpenAPI / Swagger (`@nestjs/swagger`) |
| Testing | Jest 30 + Supertest |

---

## Commands

```bash
npm run start:dev    # Start dev server with file watch (port 3000)
npm run build        # Compile TypeScript bundle
npm run lint         # Run ESLint check & auto-fix
npm test             # Run Jest unit test suite
npm run test:e2e     # Run end-to-end tests
npx prisma migrate dev --name <migration_name>  # Create & apply DB migration
npx prisma generate  # Regenerate Prisma Client types
```

---

## Architecture & Directory Layout

```
src/
├── common/                  # Shared utilities — NO domain business logic
│   ├── constants/           # Shared enums (SessionStatus, BookingStatus...)
│   ├── decorators/          # @CurrentUser(), @Public()...
│   ├── dto/                 # ApiResponseDto, PaginationDto...
│   ├── events/              # Typed event classes (BookingCreatedEvent...)
│   ├── filters/             # HttpExceptionFilter, PrismaExceptionFilter...
│   ├── guards/              # Central AuthGuard
│   └── interceptors/        # TransformInterceptor ({ success: true, data })
├── config/                  # Namespaced typed configuration
│   ├── app.config.ts        # registerAs('app', ...)
│   ├── database.config.ts   # registerAs('database', ...)
│   ├── redis.config.ts      # registerAs('redis', ...)
│   └── auth.config.ts       # registerAs('auth', ...)
├── prisma/                  # PrismaService & global PrismaModule
├── redis/                   # RedisService & cache layer
├── auth/                    # Auth controller & Better Auth integration
├── users/                   # User profile & rating management
├── sessions/                # Session lifecycle & slots
├── bookings/                # Booking reservations & locking
├── payments/                # Payment providers & webhooks
├── courts/                  # Badminton courts & PostGIS geo-search
├── notifications/           # BullMQ queue & push notifications
├── elo/                     # ELO score calculation service
├── app.module.ts            # Root module
└── main.ts                  # Entry point
```

---

## Core Engineering Rules

### 1. Separation of Concerns & Controllers
- **Controllers**: HTTP transport only. Validate inputs using DTOs, delegate business logic to Services, and declare Swagger decorators.
  - Every controller must have `@ApiTags('ResourceName')` and `@ApiBearerAuth()` (if protected).
  - Every endpoint must have `@ApiOperation({ summary: '...' })`.
- **Services**: Pure business logic and database queries using `PrismaService`.

### 2. Cross-Module Communication (Event-Driven)
- **NEVER** inject services directly across different feature modules (e.g. `BookingsService` injecting `NotificationsService`).
- **ALWAYS** emit typed events via `EventEmitter2` (`@nestjs/event-emitter`):
  ```typescript
  // In bookings.service.ts
  this.eventEmitter.emit('booking.created', new BookingCreatedEvent(bookingId, sessionId, hostId));

  // In notifications.listener.ts
  @OnEvent('booking.created')
  async handleBookingCreated(event: BookingCreatedEvent) { ... }
  ```
- **Allowed Direct Injections**: Infrastructure services (`PrismaService`, `RedisService`) and intra-module services.

### 3. Authentication & `@CurrentUser()`
- Central `AuthGuard` handles token verification.
- Use `@CurrentUser()` decorator to extract user data:
  ```typescript
  // ✅ CORRECT
  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@CurrentUser('id') userId: string) { ... }

  // ✅ CORRECT — public route
  @Public()
  @Get('public-feed')
  getFeed() { ... }

  // ❌ FORBIDDEN — inspecting raw @Req() req
  @Get('me')
  getProfile(@Req() req) { ... }
  ```

### 4. Response Wrapping & Exception Handling
- All HTTP responses are automatically wrapped by `TransformInterceptor` into `{ success: true, data }`.
- **NEVER** wrap `{ success: true, data }` manually in controllers or services.
- Database errors (Prisma P2002, P2025) and HTTP exceptions are handled by global exception filters.

### 5. Configuration via `ConfigService`
- **NEVER** access `process.env` directly in services or controllers.
- Inject `ConfigService` and access typed namespaces:
  ```typescript
  const port = this.config.get<number>('app.port');
  ```

### 6. Prisma Database Migration Protocol
- Whenever `prisma/schema.prisma` is modified, you **MUST** run:
  1. `npx prisma migrate dev --name <kebab-case-description>`
  2. `npx prisma generate`
- Commit migration SQL files (`prisma/migrations/`) into git.

### 7. Background Jobs with BullMQ
- Any slow or external network operations (FCM notifications, Resend emails, ELO batch recalculations) **MUST** be pushed to a BullMQ queue:
  ```typescript
  await this.notificationsQueue.add('send-push', { userId, title, body });
  ```

### 8. File Size & Modularization
- **Strict Limit**: Keep every TypeScript file **under 200 lines**.
- Extract helper services, repositories, or listeners when a module approaches the limit.

---

## Forbidden Patterns

- ❌ Direct `process.env` usage outside `src/config/`.
- ❌ Cross-module service injection (use `EventEmitter2`).
- ❌ String literals for enums — always import from `src/common/constants/enums.ts`.
- ❌ Manual response wrapping `{ success: true, data }`.
- ❌ Unhandled floating promises (`@typescript-eslint/no-floating-promises`).
- ❌ Using `any` type in TypeScript without explicit justification.
- ❌ Running `prisma db push` in regular feature development (use `migrate dev`).
- ❌ Files exceeding 200 lines.

---

## Git Convention

```
<type>(api): <description>
Types: feat, fix, docs, refactor, test, chore, perf
```
