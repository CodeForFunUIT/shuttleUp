---
title: BELo ELO Ranking System — Phase 1 (MVP)
description: Implement core ELO ranking for badminton sessions. Host submits match result → ELO updated immediately. 3 game types, full audit trail, leaderboard.
status: pending
priority: high
effort: 4–5 days
branch: feat/elo-score
tags: [elo, ranking, belo, nestjs, prisma]
created: 2026-04-29
---

# BELo Phase 1 — Implementation Plan

## Context
- Brainstorm: `plans/reports/brainstormer-260429-0931-belo-elo-ranking-system.md`
- Spec: `plans/260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md`

## Phases

| Phase | File | Status | Effort |
|-------|------|--------|--------|
| 1 — Schema & Enums | [phase-01-schema-and-enums.md](./phase-01-schema-and-enums.md) | ✅ done | 0.5d |
| 2 — ELO Calculation Service | [phase-02-elo-calculation-service.md](./phase-02-elo-calculation-service.md) | ✅ done | 1d |
| 3 — ELO Match Service | [phase-03-elo-match-service.md](./phase-03-elo-match-service.md) | ✅ done | 1d |
| 4 — Leaderboard Service | [phase-04-leaderboard-service.md](./phase-04-leaderboard-service.md) | ✅ done | 0.5d |
| 5 — Controller & Module | [phase-05-controller-and-module.md](./phase-05-controller-and-module.md) | ✅ done | 0.5d |
| 6 — Session Integration | [phase-06-session-integration.md](./phase-06-session-integration.md) | ✅ done | 0.5d |
| 7 — Unit Tests | [phase-07-unit-tests.md](./phase-07-unit-tests.md) | ✅ done | 1d |

## Key Dependencies
- `PrismaService` (exists) — needed by all ELO services
- `EventEmitter2` (exists in app.module) — for session.completed event
- `CourtSession` model — add `gameType` field
- `User` model — add `UserEloRating` relation

## Out of Scope (Phase 2)
- 2-sided confirmation, challenge system, inactivity decay, anti-cheat
