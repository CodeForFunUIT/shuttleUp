---
title: "Seed Realistic Mock Data for Sessions"
description: "Implementation plan to generate realistic relational mock data for Court Sessions, Users, and Bookings using Prisma and Faker.js"
status: ready
priority: medium
effort: low (1-2h)
branch: feature/mock-session-data
tags: [backend, prisma, seed, faker]
created: 2026-05-02T21:34:00+07:00
---

# Plan: Seed Realistic Mock Data for Sessions

## Context
- [Brainstormer Report](../../reports/brainstormer-260502-2130-mock-session-data.md)
- Needs to populate a large volume of realistic data for UI testing (pagination, feeds, map integration).
- Needs to accurately associate sessions with existing `Court` entries and generated `User` hosts.

## Phases

| # | Phase | Status | Files |
|---|---|---|---|
| 1 | [Setup Dependencies](./phase-01-setup.md) | ✅ | `package.json` |
| 2 | [Develop Seed Script](./phase-02-seed-script.md) | ✅ | 1 new script |
| 3 | [Test and Verification](./phase-03-test-verify.md) | ✅ | DB state |

## Architecture
```
[npm run seed:mock]
       |
       v
Check Users (< 50?) --> Create Fake Users (Hosts)
       |
       v
Fetch Courts (373)
       |
       v
Generate 1000+ Sessions (relational to courts and hosts)
       |
       v
Generate Bookings (matching math of totalSlots - availableSlots)
```

## Dependencies
- `@faker-js/faker`
- Existing 373 `Court` rows in PostgreSQL

## Risks
- Foreign key constraints (e.g. creating bookings before users/sessions are properly inserted).
- `createMany` limits (must batch the inserts into chunks of ~1,000 if generating massive sets).
