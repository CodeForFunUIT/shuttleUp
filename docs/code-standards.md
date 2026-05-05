# ShuttleUp — Code Standards

> **Last Updated:** April 20, 2026

## General Conventions

### File Naming

- **All projects:** kebab-case for file names
- **TypeScript:** `user-profile.service.ts`, `booking-flow.controller.ts`
- **Flutter/Dart:** `session_detail_page.dart` (snake_case per Dart convention)
- **Components:** `search-filter.tsx`, `session-card.tsx`

### File Size

- **Target:** Under 200 lines per file
- **Strategy:** Extract services, utilities, and sub-components when approaching limit
- **Exceptions:** Configuration files, generated code (Prisma client)

### Code Quality

- No `any` types in TypeScript (use `unknown` + type guards)
- All public APIs must have JSDoc/dartdoc comments
- Error handling with try-catch; no silent failures
- Use `const` by default; `let` only when reassignment is needed

---

## Backend (NestJS)

### Cấu trúc thư mục

```
src/
├── common/                  # Shared utilities — KHÔNG chứa business logic
│   ├── constants/
│   │   └── enums.ts         # Tất cả enums dùng chung (SessionStatus, BookingStatus...)
│   ├── decorators/
│   │   ├── current-user.decorator.ts  # @CurrentUser()
│   │   └── public.decorator.ts        # @Public()
│   ├── dto/
│   │   ├── api-response.dto.ts        # ApiResponse<T>
│   │   └── pagination.dto.ts          # PaginationDto shared
│   ├── events/
│   │   └── booking.events.ts          # Typed event classes
│   ├── filters/
│   │   ├── http-exception.filter.ts
│   │   └── prisma-exception.filter.ts
│   ├── guards/
│   │   └── auth.guard.ts              # AuthGuard duy nhất, dùng @Public() để bypass
│   └── interceptors/
│       └── transform.interceptor.ts   # Wrap { success, data }
├── config/                  # Typed config namespaces
│   ├── app.config.ts        # registerAs('app', ...)
│   ├── database.config.ts   # registerAs('database', ...)
│   ├── redis.config.ts      # registerAs('redis', ...)
│   └── auth.config.ts       # registerAs('auth', ...)
├── prisma/
├── auth/                    # Chỉ chứa controller + service (KHÔNG có guards/)
├── users/
├── sessions/
├── bookings/
├── payments/
├── courts/
├── notifications/
├── redis/
├── app.module.ts
└── main.ts
```

### NestJS Conventions

| Convention | Rule |
|-----------|------|
| Controllers | HTTP-only logic — delegate hoàn toàn cho service |
| Services | Business logic, Prisma queries |
| DTOs | `class-validator` decorators cho input validation |
| Guards | Chỉ dùng `AuthGuard` từ `common/guards/`, thêm `@Public()` để bypass |
| Interceptors | `TransformInterceptor` wrap response, đăng ký global ở `main.ts` |
| Module exports | Chỉ export service khi module khác cần — ưu tiên EventEmitter thay inject trực tiếp |

### Rule: Authentication

```typescript
// ✅ ĐÚNG — dùng @CurrentUser() decorator
@UseGuards(AuthGuard)
@Get('me')
getProfile(@CurrentUser('id') userId: string) { ... }

// ✅ ĐÚNG — route public, không cần guard
@Public()
@Get('health')
check() { ... }

// ❌ SAI — không dùng @Req() req trực tiếp
@Get('me')
getProfile(@Req() req) { return this.service.get(req.user.id); }
```

### Rule: Enums — Không dùng String Literals

```typescript
// ✅ ĐÚNG — import từ common/constants/enums.ts
import { SessionStatus, BookingStatus } from '../common/constants/enums';
status: SessionStatus.OPEN

// ❌ SAI — string literal hardcode
status: 'OPEN'
```

Enums hiện có (`src/common/constants/enums.ts`):
- `SessionStatus` — OPEN, FULL, CANCELLED, COMPLETED
- `BookingStatus` — PENDING_PAYMENT, CONFIRMED, CANCELLED, ATTENDED
- `PaymentStatus` — PENDING, SUCCESS, FAILED, REFUNDED
- `SkillLevel` — ALL, BEGINNER, INTERMEDIATE, ADVANCED
- `UserRole` — USER, ADMIN
- `PaymentProvider` — MOCK_VNPAY, VNPAY, MOMO

### Rule: Cross-Module Communication — Event-Driven

Không inject service của module khác trực tiếp. Dùng `EventEmitter2`:

```typescript
// ✅ ĐÚNG — emit typed event
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingCreatedEvent } from '../common/events/booking.events';

this.eventEmitter.emit('booking.created', new BookingCreatedEvent(id, sessionId, hostId));

// Listener phía module notifications:
@OnEvent('booking.created')
handleBookingCreated(event: BookingCreatedEvent) { ... }

// ❌ SAI — tight coupling cross-module
constructor(private notifications: NotificationsService) {}
```

**Khi nào được inject trực tiếp:**
- Infrastructure services: `PrismaService`, `RedisService` — OK
- Same module: service → service cùng feature — OK
- Cross-feature: dùng EventEmitter

### Rule: Config — Không dùng `process.env` trực tiếp

```typescript
// ✅ ĐÚNG — inject ConfigService với typed namespace
constructor(private config: ConfigService) {}
const port = this.config.get<number>('app.port') ?? 3000;

// ❌ SAI — raw process.env
const port = process.env.PORT || 3000;
```

Namespaces (`src/config/`):
- `app.*` — port, nodeEnv, apiPrefix, corsOrigin
- `database.*` — url
- `redis.*` — host, port
- `auth.*` — secret, url

### API Response Format

Tất cả response được wrap tự động bởi `TransformInterceptor`. **KHÔNG** tự wrap thủ công:

```typescript
// ✅ ĐÚNG — return data trực tiếp
return booking;  // TransformInterceptor sẽ wrap thành { success: true, data: booking }

// ❌ SAI — wrap thủ công, sẽ bị double-wrap
return { success: true, data: booking };

// Error response (tự động qua HttpExceptionFilter / PrismaExceptionFilter):
// { success: false, error: { code: string, message: string } }
```

### Rule: Swagger Decorators

Mọi controller cần có:

```typescript
@ApiTags('ResourceName')          // class level
@ApiBearerAuth()                  // nếu yêu cầu auth
@ApiOperation({ summary: '...' }) // mỗi method
```

### Database (Prisma)

- Schema file: `prisma/schema.prisma`
- Naming: snake_case cho table/column trong PostgreSQL
- Relations: Define cả hai chiều explicitly
- Indexes: Define trong schema.prisma, không dùng raw SQL
- Prisma errors (P2002, P2025...) được xử lý tự động bởi `PrismaExceptionFilter`

#### ⚠️ Quy trình bắt buộc sau mỗi thay đổi `schema.prisma`

Mỗi khi sửa file `prisma/schema.prisma`, **PHẢI** thực hiện đầy đủ các bước sau theo thứ tự:

```bash
# 1. Tạo migration file (ghi lại thay đổi SQL)
cd shuttleup-api
npx prisma migrate dev --name <mô-tả-ngắn-gọn>
# VD: npx prisma migrate dev --name remove-score-multiplier

# 2. Prisma client tự động được regenerate sau migrate dev
#    Nếu cần regenerate thủ công:
npx prisma generate
```

**Quy tắc đặt tên migration:**
- Dùng kebab-case, mô tả ngắn gọn thay đổi
- VD: `add-elo-match-tables`, `remove-score-field`, `add-user-avatar-column`

**Lưu ý quan trọng:**
- ❌ **KHÔNG** chỉ chạy `prisma generate` mà bỏ qua `migrate dev` — sẽ gây drift giữa schema và DB thực tế
- ❌ **KHÔNG** dùng `prisma db push` cho development thông thường — chỉ dùng cho prototype nhanh
- ✅ **LUÔN** commit migration files (`prisma/migrations/`) vào git
- ✅ Sau khi migrate, restart dev server nếu đang chạy (`npm run start:dev`)

### Testing

- Unit tests: `*.spec.ts` (colocated với source)
- E2E tests: `test/*.e2e-spec.ts`
- Framework: Jest 30 + Supertest

**Mock pattern chuẩn cho NestJS unit test:**

```typescript
// ✅ ĐÚNG — mock bằng class token
{ provide: PrismaService, useValue: mockPrisma }
{ provide: getQueueToken('notifications'), useValue: mockQueue }
.overrideGuard(AuthGuard).useValue({ canActivate: () => true })

// ✅ ĐÚNG — mock better-auth (ESM) phải đặt TRƯỚC import
jest.mock('../auth/auth.service', () => ({ AuthService: jest.fn()... }));
// ... rồi mới import

// ❌ SAI — mock bằng string token thay class
{ provide: 'PrismaService', useValue: mockPrisma }
```

**Jest config** (`package.json`):
```json
"transformIgnorePatterns": ["/node_modules/(?!(better-auth)/)"],
```

---

## Frontend — Web (Next.js)

### Architecture

```
src/
├── app/                     # App Router (pages + layouts)
│   ├── (auth)/              # Auth route group
│   ├── (dashboard)/         # Dashboard route group
│   ├── sessions/            # Session pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── forms/               # Form components
│   ├── layouts/             # Layout components
│   └── features/            # Feature-specific components
├── lib/
│   ├── api/                 # API client functions
│   ├── auth/                # Better Auth client
│   ├── hooks/               # Custom React hooks
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript type definitions
```

### Next.js Conventions

| Convention | Rule |
|-----------|------|
| Server Components | Default for pages and layouts |
| Client Components | Only when interactivity is needed (`"use client"`) |
| Data Fetching | Server-side `fetch()` in Server Components |
| Route Handlers | `app/api/` for BFF endpoints if needed |
| Error Boundaries | `error.tsx` per route segment |
| Loading UI | `loading.tsx` per route segment |

### Styling

- **Framework:** Tailwind CSS v4 with CSS variables
- **Component Library:** shadcn/ui (base-nova style)
- **Design Tokens:** Defined in `globals.css` via CSS custom properties
- **Responsive:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Dark Mode:** CSS variables + `dark:` variant

### shadcn/ui Usage

```bash
# Add new components
npx shadcn@latest add button
npx shadcn@latest add card
```

- Style: `base-nova`
- RSC: Enabled
- Import alias: `@/components/ui`

---

## Frontend — Mobile (Flutter)

### Architecture

```
lib/
├── app/                     # App-level config
│   ├── app.dart             # MaterialApp root
│   ├── router.dart          # GoRouter config
│   └── di.dart              # GetIt dependency injection
├── features/                # Feature-first organization
│   ├── auth/
│   │   ├── bloc/
│   │   ├── pages/
│   │   ├── widgets/
│   │   └── data/
│   ├── sessions/
│   ├── bookings/
│   └── profile/
├── core/                    # Shared utilities
│   ├── api/                 # Dio client + interceptors
│   ├── theme/               # App theme
│   ├── widgets/             # Common widgets
│   └── constants/           # App constants
└── main.dart
```

### Flutter Conventions

| Convention | Rule |
|-----------|------|
| State Management | Bloc pattern (flutter_bloc) |
| DI | GetIt + Injectable |
| HTTP | Dio with interceptors (auth token, error handling) |
| Navigation | GoRouter (declarative routing) |
| Naming | snake_case files, PascalCase classes |

### Dart Style

- Follow official [Effective Dart](https://dart.dev/effective-dart) guidelines
- Use `final` for local variables when possible
- Widget composition over inheritance
- Separate presentation logic (Bloc) from UI (Widgets)

---

## Git Conventions

### Branch Naming

```
feature/<issue-id>-<short-description>
fix/<issue-id>-<short-description>
hotfix/<description>
```

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <description>

Types: feat, fix, docs, refactor, test, chore, style, perf, ci, build
Scopes: api, web, mobile, infra, docs
```

**Examples:**
```
feat(api): add session CRUD endpoints
fix(web): resolve search filter reset bug
docs: update codebase summary
chore(infra): upgrade Node.js to 22.x in CI
```

### Pre-commit Checklist

- [ ] Run linter (`npm run lint` / `flutter analyze`)
- [ ] Run tests (`npm test` / `flutter test`)
- [ ] No `.env` files or secrets committed
- [ ] Commit message follows conventional format

---

## Environment Variables

### API (.env)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_HOST` | Redis host for cache/queue |
| `REDIS_PORT` | Redis port |
| `BETTER_AUTH_SECRET` | Auth signing secret |
| `BETTER_AUTH_URL` | Auth callback URL |
| `RESEND_API_KEY` | Email service key |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging key |

### Web (.env)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Web app base URL |

> ⚠️ Never commit `.env` files. Use `.env.example` as template.
