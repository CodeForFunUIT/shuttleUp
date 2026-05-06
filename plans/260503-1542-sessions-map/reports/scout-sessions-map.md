# Scout: Sessions Map Implementation

## Relevant Files

### Data Layer (already exists)
- `src/lib/types.ts` — `Court` type has `lat`, `lng`, `name`, `address`, `district`
- `src/lib/hooks/use-courts.ts` — `useCourts()` fetches `GET /api/courts` (cached 5min)
- `src/lib/hooks/use-sessions.ts` — `useSessions()` fetches `GET /api/sessions` (includes `court?` relation)
- `src/lib/api.ts` — Axios instance

### Pages
- `src/app/[locale]/sessions/page.tsx` — Current sessions list (grid cards). 256 lines. Uses `useSessions()`.
- `src/app/[locale]/layout.tsx` — Root layout with Navbar, Footer, QueryProvider, NextIntlClientProvider.

### Components
- `src/components/` — No map components exist yet. Contains `ui/`, `layout/`, `homepage/`, etc.

### Backend
- `shuttleup-api/.env` — Has `GOOGLE_MAPS_API_KEY` (not needed for Leaflet)
- `shuttleup-api/prisma/schema.prisma` — `Court` has `lat Float`, `lng Float`. `CourtSession` links via `courtId`.

## Key Observations
1. Sessions API already includes `court?` relation with lat/lng — no new backend endpoint needed.
2. `useCourts()` hook exists but sessions page uses `useSessions()` which includes court data.
3. No map library is currently installed in `shuttleup-web`.
4. The sessions page is 256 lines — already at the modularization threshold.
5. Layout uses dark/light theme via `next-themes` — map tiles should respect theme.
