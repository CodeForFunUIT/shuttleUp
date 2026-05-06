---
title: "Create Session – Real API Integration"
description: "Replace mock form submission with real React Hook Form + Zod + React Query integration to POST /api/sessions, including searchable court picker from 373 seeded courts"
status: ready
priority: high
effort: medium (3-4h)
branch: feature/create-session-integration
tags: [frontend, api, forms, react-hook-form, zod]
created: 2026-05-02T18:07:00+07:00
---

# Create Session – Real API Integration

## Context
- [Brainstormer Report](../reports/brainstormer-260502-1037-create-real-api-integration.md)
- [Scout Report](./reports/scout-create-session.md)
- 373 courts seeded in DB with name, address, district, lat/lng
- All required libs already installed (react-hook-form, zod, @hookform/resolvers, react-query)
- Auth is cookie-based (Better Auth) — `withCredentials: true` handles auth automatically

## Phases

| # | Phase | Status | Files |
|---|---|---|---|
| 1 | [Zod Schema + Court Picker Hook](./phase-01-schema-and-hooks.md) | ✅ | 3 new files |
| 2 | [Refactor Form with RHF + API](./phase-02-refactor-form.md) | ✅ | 1 modified, 1 new |
| 3 | [Verify & Polish](./phase-03-verify-polish.md) | ⬜ | testing + fixes |

## Architecture
```
User fills form → RHF validates (Zod) → useMutation POST /api/sessions → toast + redirect
                                          ↑ courtId from court picker
                                          ↑ endTime = startTime + duration
```

## Dependencies
- Backend `POST /api/sessions` ✅ ready
- Backend `GET /api/courts` ✅ ready (373 courts)
- Frontend libs ✅ installed
- Auth flow ✅ working (cookie-based)

## Risks
- Court list (373 items) may need search/filter for usability — use Combobox pattern
- Zod v4 API slightly differs from v3 — verify `@hookform/resolvers` compatibility
