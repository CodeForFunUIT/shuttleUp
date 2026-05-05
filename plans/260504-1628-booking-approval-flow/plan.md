---
title: Session Booking Approval Flow
description: Add host approval gate for session bookings — participants request to join, host accepts/rejects via dashboard manage panel with notification dot
status: planned
priority: high
effort: ~7 hours
branch: feat/booking-approval
tags: [booking, dashboard, notifications, approval]
created: 2026-05-04T16:28:00+07:00
---

# Session Booking Approval Flow

## Context

- [Brainstorm Report](../reports/brainstormer-260504-1615-booking-approval-flow.md)

## Overview

Add `PENDING_APPROVAL` + `REJECTED` statuses to existing `Booking` model. Users request to join → host sees notification dot on "Manage" button → host views participant list → accepts or rejects.

## Phases

| # | Phase | Status | Dependencies |
|---|---|---|---|
| 1 | [Backend: Schema + Enums + Service](./phase-01-backend-schema-service.md) | ✅ Done | None |
| 2 | [Backend: API Endpoints + Events](./phase-02-backend-api-events.md) | ✅ Done | Phase 1 |
| 3 | [Frontend: Dashboard Manage Panel](./phase-03-frontend-dashboard-manage.md) | ✅ Done | Phase 2 |

## Key Dependencies

- Existing `BookingsService` with Redis lock pattern
- Existing `NotificationsService` + `EventEmitter2` pipeline
- shadcn/ui `Sheet` component (already installed)
- `@tanstack/react-query` for data fetching hooks

## Unresolved Questions

- Should host be able to toggle between "approval required" and "auto-approve" per session? (Deferred — YAGNI for now, all sessions require approval)
- Real-time WebSocket for instant dot updates? (Deferred — MVP uses polling)
