# Research Report: Backend NestJS 11 Engineering Standards & Rules

> **Date:** 2026-08-19 | **Type:** researcher | **Project:** ShuttleUp Monorepo (`shuttleup-api`)

## Executive Summary

This research establishes standard engineering rules, architectural constraints, and static analysis configurations for **NestJS 11 (TypeScript)** with **Prisma 7 + PostgreSQL 16**, **Redis / BullMQ**, and **Better Auth** in the ShuttleUp monorepo. It focuses on modular monolith decoupling, event-driven cross-module communication, typed configuration, error transformation consistency, and strict static analysis.

## Key Findings & Core Rules

### 1. Architecture & Modular Boundaries

* **Modular Monolith**: Each domain (`auth`, `sessions`, `bookings`, `payments`, `courts`, `notifications`, `elo`, `users`) is self-contained.
* **Separation of Concerns**:
  * **Controllers**: HTTP-only logic. Validate inputs with DTOs, delegate immediately to services, declare Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`).
  * **Services**: Contain business logic and database operations via Prisma.
  * **DTOs**: Enforce runtime validation via `class-validator` and Swagger schema generation via `@ApiProperty()`.
* **Decoupled Cross-Module Communication**:
  * Cross-feature coupling is prohibited. Use `EventEmitter2` for asynchronous events (`booking.created`, `payment.success`, `session.cancelled`).
  * Direct injection is permitted only for infrastructure providers (`PrismaService`, `RedisService`) or internal same-module services.

### 2. Authentication & Authorization

* **Better Auth Integration**:
  * Central `AuthGuard` handles JWT validation.
  * Use `@CurrentUser()` decorator to extract typed user session (e.g. `@CurrentUser('id') userId: string`).
  * Use `@Public()` decorator to bypass authentication for guest/public endpoints.
  * Never inspect raw `@Req() req` for user credentials.

### 3. Response Transformation & Exception Handling

* **Unified API Format**: All HTTP responses are automatically wrapped by `TransformInterceptor` into `{ success: true, data }`.
* **Zero Manual Wrapping**: Controllers and services must return raw DTOs or entity objects directly (avoid double-wrapping).
* **Exception Filters**: Catch and serialize domain and DB exceptions via `HttpExceptionFilter` and `PrismaExceptionFilter`.

### 4. Configuration & Database Management

* **Typed ConfigService**: Access configuration exclusively via registered namespaces (`app.*`, `database.*`, `redis.*`, `auth.*`). Raw `process.env` is prohibited outside `src/config/`.
* **Prisma Migrations**: Every schema update requires running `npx prisma migrate dev --name <migration-name>` and generating the Prisma Client. No uncommitted DB drift.

### 5. Queues & Asynchronous Processing

* **BullMQ & Redis**: Offload CPU-heavy or external tasks (Firebase FCM push, Resend email dispatch, ELO batch recalculations) to BullMQ queues. Never execute slow external network requests in the HTTP request-response cycle.

### 6. TypeScript & ESLint Strictness

* **Zero `any` Policy**: Require `unknown` + type narrowing or explicit DTOs.
* **Floating Promises**: Enforce awaiting or returning all promises (`@typescript-eslint/no-floating-promises: error`).
* **File Size Management**: Target under 200 lines per file; extract helper services when exceeding limits.

## Implementation Strategy for `shuttleup-api`

1. **`shuttleup-api/AGENTS.md`**: Create dedicated backend agent rulebook covering NestJS 11 best practices, DI, event patterns, and strict constraints.
2. **`shuttleup-api/eslint.config.mjs`**: Tighten ESLint flat config with floating promise and type safety checks.
3. **`docs/code-standards.md`**: Ensure backend NestJS documentation is synchronized with practical examples.
4. **`src/sessions/sessions.service.spec.ts`**: Update unit test mock expectation to match current session creation payload.

## Unresolved Questions

- None. Framework versions and architecture patterns align with existing monorepo setup.
