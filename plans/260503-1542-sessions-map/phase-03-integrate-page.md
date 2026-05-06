# Phase 3: Integrate into Sessions Page

## Overview
Add a Grid/Map view toggle to the existing sessions page so users can switch between the card grid and the interactive map.

## Implementation Steps

- [ ] Add view toggle state to `sessions/page.tsx`:
  - Use `useState<'grid' | 'map'>('grid')` for view mode
  - Add toggle buttons (Grid icon / Map icon) next to the "Host Session" button in the page header
  - Use `lucide-react` icons: `LayoutGrid` and `Map`

- [ ] Conditionally render:
  - `view === 'grid'` → existing sessions grid (unchanged)
  - `view === 'map'` → `<DynamicMap sessions={sessions} />` component
  - Map should fill available height (e.g., `h-[70vh]` or `calc(100vh - navbar - header)`)

- [ ] Add i18n strings for the toggle:
  - `en.json` → `"gridView": "Grid", "mapView": "Map"`
  - `vi.json` → `"gridView": "Danh sách", "mapView": "Bản đồ"`

- [ ] Style considerations:
  - Toggle buttons should look like segmented controls (active state highlighted)
  - Map container needs `rounded-2xl overflow-hidden` to match the card grid aesthetic
  - Add a subtle fade/scale animation when switching views (framer-motion)

## Related Files
- `src/app/[locale]/sessions/page.tsx` (modify)
- `src/messages/en.json` (add strings)
- `src/messages/vi.json` (add strings)

## Success Criteria
- Toggle switches seamlessly between grid and map views
- Map view shows all sessions with court markers
- Switching back to grid preserves scroll position
- Both views share the same loading/error/empty states
- i18n strings work in both EN and VI
