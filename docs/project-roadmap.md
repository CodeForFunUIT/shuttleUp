# ShuttleUp — Project Roadmap

> **Last Updated:** April 16, 2026 | **Timeline:** ~34 weeks (1–2h/day)

## Roadmap Overview

| Phase | Name | Estimated | Status | Progress |
|-------|------|-----------|--------|----------|
| 0 | Project Setup & Infra | 12h / 2 weeks | ✅ Complete | 100% |
| 1 | Backend Core | 50h / 6 weeks | ✅ Complete | 100% |
| 2 | Search & Booking | 36h / 4 weeks | ✅ Complete | 100% |
| 3 | Notifications | 16h / 2 weeks | ✅ Complete | 100% |
| 4 | Web Frontend | 40h / 4 weeks | ✅ Complete | 100% |
| 5 | Mobile App | 60h / 6 weeks | ⬜ Not Started | 0% |
| 6 | Testing & Launch | 24h / 4 weeks | ⬜ Not Started | 0% |

**Overall Progress:** ██████░░░░ ~57% (Phase 0-4 of 7 complete)

---

## Phase 0 — Project Setup & Infra ✅

**Duration:** 12h | **Status:** Complete

### Deliverables

- [x] Monorepo structure with 3 sub-projects
- [x] NestJS 11 scaffolded (shuttleup-api)
- [x] Next.js 16 + React 19 + Tailwind v4 + shadcn/ui (shuttleup-web)
- [x] Flutter 3.10 + Bloc + GetIt + Dio (shuttleup-mobile)
- [x] Docker Compose: PostgreSQL 16 (PostGIS) + Redis 7
- [x] GitHub Actions CI for all 3 sub-projects
- [x] Environment templates (.env.example)
- [x] Product Requirements Document (ShuttleUp_PRD.md)
- [x] Implementation plan with 7 phases

---

## Phase 1 — Backend Core ✅

**Duration:** ~50h | **Dependencies:** Phase 0 | **Status:** Complete

### Milestones

- [x] Prisma schema with all 9 tables + PostGIS extension
- [x] Database migrations + seed data
- [x] Auth module (Better Auth: email, Google OAuth, anonymous)
- [x] Users module (profile CRUD, skill level)
- [x] Courts module (CRUD, location data)
- [x] Sessions module (single + recurring RRULE, slot management)
- [x] Bookings module (register, approve/reject, state machine)

### Key Risks

| Risk | Mitigation |
|------|-----------|
| Better Auth learning curve | Start with email-only, add OAuth later |
| PostGIS setup complexity | Use Docker image with PostGIS pre-installed |
| Recurring session logic | Use rrule.js library for RRULE parsing |

---

## Phase 2 — Search & Booking ✅

**Duration:** ~36h | **Dependencies:** Phase 1 | **Status:** Complete

### Milestones

- [x] PostGIS geo-search (nearby courts/sessions)
- [x] Feed query with compound filters (time, skill, price, shuttle)
- [x] Full booking flow with state machine
- [x] Mock payment flow (deposit/refund simulation)
- [x] Redis atomic slot locking
- [x] Booking cancellation + auto-refund logic

---

## Phase 3 — Notifications ✅

**Duration:** ~16h | **Dependencies:** Phase 1 | **Status:** Complete

### Milestones

- [x] Bull Queue setup with Redis backend
- [x] Email notifications via Resend
- [x] Firebase Cloud Messaging (FCM) push notifications
- [x] Notification CRUD endpoints (list, mark read)
- [x] Event-driven triggers (booking, approval, session reminder)

---

## Phase 4 — Web Frontend ✅

**Duration:** ~40h | **Dependencies:** Phase 1 (can parallel with Phase 5) | **Status:** Complete

### Milestones

- [x] Design system: color palette, typography, spacing tokens
- [x] Auth pages: login, register, profile
- [x] Session feed page with search & filters
- [x] Session detail page with booking CTA
- [x] My bookings page (upcoming, past)
- [x] Host dashboard: create session, manage bookings
- [x] Responsive mobile-first layout
- [x] Dark mode support

---

## Phase 5 — Mobile App ⬜

**Duration:** ~60h | **Dependencies:** Phase 1 (can parallel with Phase 4)

### Milestones

- [ ] App navigation setup (GoRouter)
- [ ] DI configuration (GetIt + Injectable)
- [ ] Auth screens (login, register, profile)
- [ ] Session feed with filters
- [ ] Session detail + booking flow
- [ ] My bookings screen
- [ ] Push notification handling (FCM)
- [ ] Map view with nearby sessions (Google Maps)

---

## Phase 6 — Testing & Launch ⬜

**Duration:** ~24h | **Dependencies:** All previous phases

### Milestones

- [ ] API unit tests (80%+ coverage)
- [ ] API E2E tests for critical flows
- [ ] Web integration tests
- [ ] Mobile widget + integration tests
- [ ] Performance audit (Lighthouse 90+)
- [ ] Portfolio README + case study
- [ ] Demo video walkthrough
- [ ] Deploy: API → Railway, Web → Vercel

---

## Key Milestones

| Milestone | Target Week | Deliverable |
|-----------|------------|-------------|
| 🏁 M1 — Backend API Ready | Week 12 | Full API with auth + booking flow |
| 🏁 M2 — Web MVP Live | Week 20 | Next.js app deployed on Vercel |
| 🏁 M3 — Mobile App Live | Week 26 | Flutter on TestFlight / Play Store |
| 🏁 M4 — Portfolio Launch | Week 34 | README, case study, demo video |

## Risk Register

| Risk | Severity | Phase | Mitigation |
|------|----------|-------|-----------|
| Payment integration delays | High | 2 | Start with mock, add VNPay later |
| Zalo OA approval process | Medium | 3 | Use FCM as primary, Zalo as bonus |
| Scope creep | High | All | Strict feature freeze per phase |
| Motivation dip (week 8–12) | Medium | 1–2 | Schedule 1 UI session/week for visual progress |
| PostGIS query performance | Low | 2 | GiST index + Redis cache (5-min TTL) |
