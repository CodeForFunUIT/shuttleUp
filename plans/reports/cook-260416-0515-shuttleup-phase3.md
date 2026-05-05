---
title: ShuttleUp Phase 3 Implementation Report
description: Report on implementing notifications using BullMQ, Resend, and FCM
status: completed
priority: high
effort: low
branch: main
tags: [nestjs, bullmq, notifications, resend, fcm]
created: 2026-04-16T05:15:00Z
---

# ShuttleUp Phase 3 — Notifications Implementation Report

## Overview
Phase 3 of ShuttleUp focuses on creating an async, event-driven notification system using Redis + BullMQ. This prevents main thread blocking when dispatching notifications across multiple channels (in-app, email, push).

## Key Implementation Details

1. **BullMQ Infrastructure**:
   - Integrated `@nestjs/bullmq` globally in `AppModule`.
   - Created `NotificationsModule` with a registered queue `notifications`.

2. **Notifications Service**:
   - `NotificationsService` exposes an agnostic generic `.dispatch(event, payload)` method using BullMQ to enqueue jobs.
   - Provided CRUD utilities: `getUserNotifications`, `markAsRead`, `markAllAsRead`.

3. **Background Worker (Processor)**:
   - Implemented `notifications.processor.ts` resolving Bull jobs asynchronously.
   - Integrated `Resend` logic for Email delivery on `booking.created` events.
   - Bootstrapped `Firebase Admin SDK` initialization ready for mobile push messages.
   - Built dual event handlers: `handleBookingCreated` and `handleBookingCancelled`.

4. **Event Integration**:
   - Wired the `BookingsService` to dispatch `booking.created` after database writes.
   - Dispatched `booking.cancelled` when users cancel slots.

5. **API Surface**:
   - Created `NotificationsController` under the `/notifications` rest resource protected by `AuthGuard`.

## Project Status Updates
- Validated TS compilation (run `npx nest build`).
- `docker-compose.yml` depends on Docker Desktop correctly starting PostGIS/Redis.
- Marked **Phase 3 as Complete** in the project roadmap (now tracking at ~43% overall progress).

## Next Steps
- Verify the local Docker runtime.
- Run the remaining migrations to push `Notification` schema to Postgres (`npx prisma migrate dev`).
- Switch focus to either `Phase 4 (Web Frontend)` or `Phase 5 (Mobile App)`.
