---
title: "Session Filtering, Pagination & Geolocation"
description: "Switch from findAll to search API, add filter bar, pagination, and near-me sorting"
status: done
priority: high
effort: medium (1.5h)
branch: feature/sessions-map
tags: [frontend, performance, ux]
created: 2026-05-03T17:47:00+07:00
---

# Session Filtering, Pagination & Geolocation

## Context
Sessions page loads all 1000+ sessions via `GET /api/sessions`. Backend already has `GET /api/sessions/search` with pagination, district, skill, price, and geo-search. Frontend just isn't using it.

## Phases

| # | Phase | Status | Key Files |
|---|---|---|---|
| 1 | Backend: Add title search + paginated response | ✅ | `sessions.service.ts`, `search-session.dto.ts` |
| 2 | Frontend: Hook + FilterBar + Pagination | ✅ | `use-session-search.ts`, `sessions-filter-bar.tsx`, `sessions/page.tsx` |

## Architecture
```
GET /api/sessions/search?title=fun&district=Quận 1&skill=BEGINNER&page=1&limit=12
→ { data: CourtSession[], total: number, page: number, limit: number }
→ Frontend renders 12 cards + pagination + filter bar
```
