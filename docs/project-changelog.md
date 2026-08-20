# ShuttleUp — Project Changelog

> All notable changes to this project will be documented in this file.

## [Unreleased]

### 2026-08-19 — Full-Stack (Flutter, Next.js, NestJS) Engineering Rules & Standards Application

**Added & Enhanced:**
- **Backend (`shuttleup-api`)**:
  - Created dedicated `shuttleup-api/AGENTS.md` rulebook establishing modular monolith boundaries, event-driven cross-module communication (`EventEmitter2`), `AuthGuard` + `@CurrentUser()` conventions, unified response interceptor wrapping, typed `ConfigService`, and BullMQ asynchronous queues.
  - Enhanced `eslint.config.mjs` with `@typescript-eslint/no-floating-promises: error`, `@typescript-eslint/no-explicit-any: warn`, and clean variable rules.
  - Synchronized Prisma Client code generation and updated `sessions.service.spec.ts` unit test expectations (100% of 76 tests passing).
- **Mobile (`shuttleup-mobile`)**:
  - Upgraded `analysis_options.yaml` with strict analyzer flags (`strict-casts`, `strict-inference`, `strict-raw-types`) and comprehensive lint rules (`prefer_const_constructors`, `prefer_final_locals`, `avoid_dynamic_calls`, `unawaited_futures`).
  - Updated `shuttleup-mobile/AGENTS.md` with Freezed v3 sealed class pattern, 100% GetIt/Injectable constructor injection, async `context.mounted` safety, and 200-line modularization limits.
  - Resolved static analysis warnings across mobile codebase (`api_client`, `app_theme`, `notification_service`, `session_detail_page`, etc.) and verified all unit/smoke tests pass.
- **Web (`shuttleup-web`)**:
  - Established full `shuttleup-web/AGENTS.md` rulebook for Next.js 16 + React 19 + Tailwind v4 + shadcn/ui + Better Auth.
  - Enhanced `eslint.config.mjs` with strict `@next/next/no-img-element: error`, console policies, and TypeScript safety rules.
  - Configured Vitest test runner with dynamic imports and next-intl navigation resolution.
- **Documentation (`docs/code-standards.md`)**:
  - Expanded Backend NestJS, Frontend Web, and Mobile sections with concrete code patterns, do's & don'ts, DI patterns, and async safety.

### 2026-04-16 — Web Frontend Implementation (Phase 4)

**Added:**
- Established Next.js 16 app structure leveraging `shadcn/ui` components and Tailwind v4.
- Implemented core Authentication UI components mapping to Better Auth (Login, Register).
- Developed Session lifecycle components (Feed UI, generic filters, Session Profile).
- Integrated generic protected layouts and implemented Dashboard routing for Host tools ("Host New Session" form).
- Ensured comprehensive TypeScript validation and Zod form checks across data exchanges.

### 2026-04-16 — Notification System (Phase 3)

**Added:**
- Setup BullMQ with Redis for background notification processing.
- Installed generic Resend template integration for Email dispatch hooks.
- Implemented `NotificationsController` endpoint for notification state (marking as read).

### 2026-04-16 — Search & Booking Implementation (Phase 2)

**Added:**
- PostGIS geo-spatial distance calculation implementation `searchNearby()`.
- Advanced Query filter endpoints mapping parameters inside `$queryRaw`.
- Mock Payments Module establishing mocked logic to handle simulated success/redirect configurations.
- Advanced cancellation functionality `cancel()` interacting directly with mock refund system and concurrency unlocking.


### 2026-04-16 — Backend Core Implementation (Phase 1)

**Added:**
- PostgreSQL structure fully configured with PostGIS and 9 main tables within `prisma.schema`.
- Seeding and migration tools via Prisma with basic initial courts and setup admin user.
- Authentication implemented with Better Auth (`email` and `anonymous` for guests).
- NestJS API Modules configured (`Users`, `Courts`, `Sessions`, `Bookings`, `Auth`).
- Redis-based atomic lock integration implemented to solve slot concurrency issues in Bookings.

### 2026-04-16 — Documentation Initialization

**Added:**
- `README.md` — Project overview with setup instructions (110 lines)
- `docs/project-overview-pdr.md` — Product overview & development requirements
- `docs/codebase-summary.md` — Codebase structure and file statistics
- `docs/code-standards.md` — Code standards across NestJS, Next.js, Flutter
- `docs/system-architecture.md` — System topology, module deps, DB schema
- `docs/project-roadmap.md` — 7-phase roadmap with milestones
- `docs/design-guidelines.md` — Brand identity, colors, typography, components
- `docs/deployment-guide.md` — Local dev setup, CI/CD, production targets

### 2026-04-15 — Project Bootstrap (Phase 0)

**Added:**
- NestJS 11 API scaffold (`shuttleup-api/`)
- Next.js 16 + React 19 + Tailwind v4 + shadcn/ui scaffold (`shuttleup-web/`)
- Flutter 3.10 + Bloc + GetIt + Dio scaffold (`shuttleup-mobile/`)
- Docker Compose: PostgreSQL 16 (PostGIS) + Redis 7
- GitHub Actions CI pipelines (API, Web, Mobile)
- Environment templates (`.env.example`)
- Product Requirements Document (`ShuttleUp_PRD.md`)
- Implementation plan with 7 phases (`plans/260415-1127-shuttleup-bootstrap/`)
