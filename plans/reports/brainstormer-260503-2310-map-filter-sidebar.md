# Brainstorm: Map View Filter Sidebar

## Problem Statement
Map view currently loads ALL 1000+ sessions without any filtering. Grid has a great filter bar (search, district, skill, near-me), but map has none. User wants a **filter sidebar inside the map container** — not floating above it or in a separate section.

## Key Constraints
1. Map uses `useSessions()` (loads all 1000) — needs to switch to `useSessionSearch()` or filter client-side.
2. Filter sidebar must sit **inside** the map container visually (overlaid on top of the map).
3. Sidebar should be collapsible on mobile (map real estate is precious).
4. Markers must react to filter changes in real time.

## Evaluated Approaches

### Option A: Client-Side Filtering (filter 1000 sessions in JS)
Map already has all data. Just filter `courtGroups` array before rendering markers.
- **Pros:** Instant filtering, no API calls, simple. Map stays responsive — filtering is just array ops.
- **Cons:** Still loads 1000 sessions upfront. But map NEEDS density for clustering to look good. If we paginate, the map looks empty.
- **Verdict:** ✅ **Best for map.** Unlike grid, map benefits from having all data loaded — empty maps with 12 markers look broken.

### Option B: Server-Side Filtering via Search API
Switch map to `useSessionSearch()` with large limit or no pagination.
- **Pros:** Consistent with grid approach.
- **Cons:** Map with 12 results looks terrible — clustering needs density. Would need special large `limit=1000` which defeats the purpose. Geo-search limits to radius which hides markers outside.
- **Verdict:** ❌ Bad fit for map UX.

### Option C: Hybrid — Load all, filter client-side, optional geo-sort
Load all sessions once (already doing this). Overlay a filter sidebar on the map. Apply filters client-side. "Near me" centers the map on user location instead of filtering.
- **Pros:** Best UX. Fast. Map stays full. Filters feel instant. "Near me" = fly to your location.
- **Cons:** Initial 1000-session load remains. Acceptable for map view.
- **Verdict:** ✅ **Recommended.**

## Final Recommended Solution: Option C

### Sidebar Design
```
┌──────────────────────────────────────────────────────────┐
│  MAP CONTAINER (full width)                               │
│  ┌─────────────┐                                          │
│  │ ☰ Filters   │  ← Collapsible sidebar (left)           │
│  │             │                                          │
│  │ 🔍 Search   │  ← Filter by session title              │
│  │ [_________] │                                          │
│  │             │                                          │
│  │ District    │  ← Filter by district                   │
│  │ [Quận 1  ▾] │                                          │
│  │             │                                          │
│  │ Skill       │  ← Filter by skill level                │
│  │ [All     ▾] │                                          │
│  │             │                                          │
│  │ 📍 Near me  │  ← Fly map to user's location           │
│  │             │                                          │
│  │ 42 courts   │  ← Result count                         │
│  │ 156 sessions│                                          │
│  └─────────────┘                                          │
│                           🔴 🟡 🟢  ← Clustered markers   │
│                      🟢                                    │
│                  🟡         🔴                             │
└──────────────────────────────────────────────────────────┘
```

### Implementation Plan
1. **Create `MapFilterSidebar` component** — overlaid on map with absolute positioning, glassmorphism background.
2. **Move filter state into `SessionsMap`** — or lift to page and pass down.
3. **Client-side filtering logic** — filter `courtGroups` by title (includes), district (exact), skill (any session matches).
4. **"Near me" = `map.flyTo()`** — use Leaflet's `flyTo()` to animate to user's GPS coords. No API call needed.
5. **Collapsible** — on mobile, show only a small toggle button. On desktop, sidebar is open by default.

### Key Decisions
- **No API calls for map filtering** — everything client-side since data is already loaded.
- **"Near me" on map = fly to location**, not filter by radius (unlike grid which filters server-side).
- **Sidebar overlays the map** — uses `absolute` positioning inside the map wrapper div.
- **Glassmorphism** — semi-transparent backdrop blur to see map through sidebar.

## Success Metrics
- Filters respond instantly (<16ms, no API delay).
- Sidebar looks premium (glass effect, smooth collapse animation).
- "Near me" smoothly flies map to user location.
- Result count updates live.
- Mobile: sidebar collapses to a small button.

## Next Steps
Implement directly — single component + minor wiring changes.
