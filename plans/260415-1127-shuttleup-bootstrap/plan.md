---
title: ShuttleUp Bootstrap Plan
description: Full-stack badminton partner-finding platform — Web (Next.js 15) + Mobile (Flutter) + API (NestJS)
status: draft
priority: high
effort: 334h (~34 weeks)
branch: main
tags: [fullstack, next.js, nestjs, flutter, supabase, better-auth]
created: 2026-04-15
---

# ShuttleUp Bootstrap Plan

## Overview

Build a badminton partner-finding platform with 3 separate repos:
- **shuttleup-web** — Next.js 15 + Tailwind + shadcn/ui
- **shuttleup-api** — NestJS + Prisma + Supabase (PostgreSQL)
- **shuttleup-mobile** — Flutter + Bloc + GetIt

## Key Decisions

| Decision | Choice |
|----------|--------|
| Auth | Better Auth (email for hosts, anonymous plugin for guests) |
| Database | Supabase PostgreSQL + PostGIS |
| Storage | Supabase Storage |
| Payment | Mock flow (MVP) |
| Notifications | Email + FCM + local push (no Zalo) |
| Guest booking | No login required (name + phone only) |
| Court data | Host self-input, saved to localStorage |
| Skill system | ELO scoring |
| Sessions | Single + weekly recurring (RRULE) |
| Mobile state | Bloc + GetIt DI |

## Phases

| # | Phase | Link | Status |
|---|-------|------|--------|
| 0 | [Project Setup & Infra](./phase-00-project-setup.md) | Setup repos, Docker, Supabase, CI/CD | ✅ |
| 1 | [Backend Core](./phase-01-backend-core.md) | Auth, Users, Courts, Sessions, Bookings | ✅ |
| 2 | [Search & Booking](./phase-02-search-booking.md) | PostGIS search, booking flow, mock payment | ✅ |
| 3 | [Notifications](./phase-03-notifications.md) | Email, FCM, Bull Queue | ✅ |
| 4 | [Web Frontend](./phase-04-web-frontend.md) | Design system, pages, flows | ✅ |
| 5 | [Mobile App](./phase-05-mobile-app.md) | Flutter Bloc + GetIt, core flows | ✅ |
| 6 | [Testing & Launch](./phase-06-testing-launch.md) | Tests, perf, portfolio | ✅ |

## Brand Identity (Proposed)

See [design-guidelines](./research/researcher-01-brand-identity.md)

## Dependencies

- Phase 0 → all other phases
- Phase 1 → Phase 2, 3, 4, 5
- Phase 4 & 5 can run in parallel after Phase 1
