# Brainstorm: Session Filtering, Pagination & Nearest-Court Sorting

## Problem Statement
The sessions page fetches ALL 1000+ sessions via `GET /api/sessions` and renders them at once. This causes:
1. **Slow initial load** — large JSON payload (~500KB+), all rendered into DOM at once.
2. **No filtering** — users can't search by name, court, district, or skill.
3. **No geolocation sorting** — sessions near the user aren't prioritized.
4. **No pagination** — infinite scroll or page controls are missing.

## Key Discovery: Backend Already Supports This! ✅
The `GET /api/sessions/search` endpoint (`SearchSessionDto`) already supports:
- `page` + `limit` — cursor-based pagination
- `district` — filter by district name
- `skillRequired` — filter by skill level
- `priceMax` — max price filter
- `lat` + `lng` + `radiusMm` — geo-search with PostGIS (sort by distance)

**The frontend just isn't using it.** The `useSessions()` hook calls `GET /api/sessions` (the unfiltered `findAll()`) instead of `GET /api/sessions/search`.

## What Needs to Change

### Backend: Minor Enhancement
The `findAll()` → needs a `title` search param (currently only `search` supports filtering, but no `title` param there either). Add `title?: string` to `SearchSessionDto` and use `ILIKE` in the Prisma query.

Also: `searchNearby` doesn't return `totalCount` — need that for pagination UI.

### Frontend: Switch to Search API + Add Filter UI + Pagination

## Evaluated Approaches for Frontend Filtering

### Option A: Client-Side Filtering (filter 1000 sessions in JS)
*   **Pros:** Simple, instant filtering, no API changes needed.
*   **Cons:** Still loads 1000 sessions upfront. Defeats the purpose. Bad for mobile bandwidth. Not scalable.

### Option B: Server-Side Filtering via `GET /sessions/search` (Recommended)
*   **Pros:** Sends only 12-20 sessions per page. Leverages existing PostGIS geo-search. Fast. Scalable. Already 90% built.
*   **Cons:** Requires updating the frontend hook and adding filter state. Minor backend tweaks.

### Option C: Hybrid (load first page server-side, then infinite scroll)
*   **Pros:** Fast first paint. Progressive loading.
*   **Cons:** More complex state management. TanStack Query's `useInfiniteQuery` handles this well, but adds code complexity vs. simple pagination.

## Final Recommended Solution

**Option B: Server-Side Filtering + Simple Pagination**

### Architecture
```
┌──────────────────────────────────────────────────────┐
│ Sessions Page                                         │
│ ┌──────────────────────────────────────────────────┐  │
│ │ FilterBar                                         │  │
│ │ [🔍 Search by name...] [District ▾] [Skill ▾]    │  │
│ │ [📍 Near me] [Price max ▾]                        │  │
│ └──────────────────────────────────────────────────┘  │
│                                                        │
│ Grid View / Map View toggle                            │
│                                                        │
│ ┌─────┐ ┌─────┐ ┌─────┐                              │
│ │Card1│ │Card2│ │Card3│ ... (12 per page)              │
│ └─────┘ └─────┘ └─────┘                              │
│                                                        │
│ [← Prev]  Page 1 of 84  [Next →]                      │
└──────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Backend (small changes)
1. Add `title?: string` to `SearchSessionDto` — search by session title with `ILIKE`.
2. Return `{ data: [...], total: number, page: number, limit: number }` from `searchNearby()` instead of bare array — needed for pagination UI.
3. Make `GET /api/sessions` (findAll) also support basic `page`+`limit` as fallback.

#### Frontend
1. Create `useSessionSearch(filters)` hook → calls `GET /api/sessions/search?page=&limit=&district=&...`
2. Create `FilterBar` component:
   - Text input: search by session title (debounced 300ms)
   - Select: district (unique list from courts data)
   - Select: skill level (BEGINNER/INTERMEDIATE/ADVANCED/PRO/ALL)
   - Toggle: "Near me" (requests browser geolocation, sends lat/lng)
   - Price slider or max price input (optional, can add later)
3. Pagination: simple `[Prev] Page X of Y [Next]` controls below the grid.
4. Filter state managed via URL search params (`useSearchParams`) — enables shareable URLs.
5. Map view: keeps using full `useSessions()` for now (map needs all markers), or switches to search API with large limit.

### Districts List
Pre-populate from existing court data. The 375 courts span ~15 districts in HCMC.

## Success Metrics
- Initial page load sends ≤20 sessions (vs 1000 today) — ~95% payload reduction.
- Filter changes trigger new API call with debounce.
- Pagination works with total page count.
- "Near me" sorts by distance using PostGIS.
- URL params are bookmarkable (e.g. `/sessions?district=Quận 1&skill=BEGINNER&page=2`).

## Risks
- PostGIS `ST_Distance` requires `geometry` column on courts — verify it exists or fall back to Haversine in SQL.
- Browser geolocation permission may be denied → graceful fallback to default sort.

## Next Steps
Create a plan with 2 phases:
1. **Backend**: Add title search + paginated response shape
2. **Frontend**: FilterBar + useSessionSearch hook + pagination UI
