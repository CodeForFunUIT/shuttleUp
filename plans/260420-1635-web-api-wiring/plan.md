---
title: Web API Wiring — Replace Mock Data with Real API Calls
description: Create TypeScript types, React Query hooks, and wire all frontend pages to the NestJS backend
status: done
priority: high
effort: medium
branch: main
tags: [frontend, react-query, api, nextjs]
created: 2026-04-20T16:35:00
---

# Web API Wiring

## Phases

### Phase 1: Foundation Layer ✅
- [x] QueryClientProvider added to root layout

### Phase 2: Types + API Hooks ✅
- [x] Create `src/lib/types.ts` — shared TypeScript interfaces (Session, Court, User, Booking)
- [x] Create `src/lib/hooks/use-sessions.ts` — React Query hooks for sessions
- [x] Create `src/lib/hooks/use-user.ts` — React Query hooks for user profile

### Phase 3: Wire Pages to Real API ✅
- [x] `src/app/sessions/page.tsx` — replaced MOCK_SESSIONS → `useSessions()`
- [x] `src/app/dashboard/page.tsx` — wired summary stats from live sessions
- [x] `src/app/profile/page.tsx` — wired `useSession()` for real user data
- [ ] `src/app/sessions/[id]/page.tsx` — TODO: session detail page (route exists, needs page)

## Files Created/Modified

| File | Action | Description |
|---|---|---|
| `src/components/query-provider.tsx` | Created | QueryClientProvider wrapper |
| `src/lib/types.ts` | Created | Shared TS types (User, Court, CourtSession, Booking) |
| `src/lib/hooks/use-sessions.ts` | Created | `useSessions()`, `useSession(id)` hooks |
| `src/lib/hooks/use-user.ts` | Created | `useUserProfile()` hook |
| `src/app/layout.tsx` | Modified | Added QueryProvider |
| `src/app/sessions/page.tsx` | Modified | Replaced mock → real API |
| `src/app/dashboard/page.tsx` | Modified | Replaced mock → real API |
| `src/app/profile/page.tsx` | Modified | Replaced mock → Better Auth session |
