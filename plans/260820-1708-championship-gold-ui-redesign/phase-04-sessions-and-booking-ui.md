# Phase 04: Sessions Feed, Match Capacity Gauges & Map Polish

## Context Links
- [Sessions Page](../../shuttleup-web/src/app/[locale]/sessions/page.tsx)
- [Map Components](../../shuttleup-web/src/components/map/)
- [Court Select](../../shuttleup-web/src/components/court-select.tsx)

## Overview
- **Priority:** High
- **Status:** Pending
- **Description:** Redesign the session exploration feed and court cards with live player capacity bars, level match badges, and sleek dark map markers.

## Key Insights
- Players need to see 3 critical pieces of info at a glance: 1) Time & Location, 2) Target Elo / Skill Level, 3) Remaining Slots ("Còn 1 slot cuối!").
- Highlighting urgency with color shifts (`#FF6B35` / `#E8385A` when almost full) boosts booking conversion.

## Requirements
- **Session Card 2.0**:
  - Time chip with court name and address badge.
  - Required Elo / Level badge with clear tier coloring.
  - Real-time Slot Gauge bar (e.g. `4/6 Đã đăng ký` - visual segmented bar).
  - Host info chip with rating star and verified check.
  - Clear "Tham gia" action button with price per player (`50k/người`).
- **Filter & Search Bar**:
  - Floating pill search container with date picker, skill level pills, and district filter.
- **Interactive Map**:
  - Championship Gold court cluster pins with custom dark popup cards.

## Related Code Files
- `shuttleup-web/src/app/[locale]/sessions/page.tsx`
- `shuttleup-web/src/components/sessions/`
- `shuttleup-web/src/components/map/session-map.tsx`

## Implementation Steps
1. Modernize Session card component with slot gauge and tier badge.
2. Refactor session filter bar into a sleek sticky pill bar.
3. Update Leaflet custom markers to match Championship Gold styling.

## Todo List
- [ ] Implement SessionCard 2.0 with slot progress gauge and level badge
- [ ] Redesign sticky filter bar
- [ ] Polish map cluster icons & card popup styling

## Success Criteria
- Filter changes update the session list immediately.
- Card actions and buttons have visible focus states and cursor-pointer.
