# Phase 2: Build Map Component

## Overview
Create the core `SessionsMap` component with marker clustering, court popups, and theme-aware tile layers.

## Implementation Steps

- [ ] Create `src/components/map/sessions-map.tsx`:
  - Use `MapContainer` from react-leaflet, centered on HCMC `[10.78, 106.66]` zoom 12
  - Add `TileLayer` with CartoDB tiles:
    - Light: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
    - Dark: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  - Use `useTheme()` from `next-themes` to switch tile URL dynamically
  - Accept `sessions: CourtSession[]` as prop
  - Group sessions by `courtId` → aggregate per court (session count, price range, available slots)
  - Render a `Marker` per unique court using `lat`, `lng` from `session.court`
  - Wrap markers in `MarkerClusterGroup` from `react-leaflet-cluster`

- [ ] Create `src/components/map/court-popup.tsx`:
  - Display in marker Popup: court name, address, number of active sessions, price range
  - Include a "View Sessions" link to filter or navigate

- [ ] Create `src/components/map/dynamic-map.tsx`:
  - Wrapper that uses Next.js `dynamic(() => import('./sessions-map'), { ssr: false })`
  - This prevents Leaflet's `window is not defined` SSR crash
  - Export this as the public-facing component

- [ ] Create custom marker icon (optional):
  - Use a shuttlecock/badminton SVG icon as the marker instead of the default blue pin
  - Or use `L.divIcon` with a styled div showing session count

## Related Files
- `src/components/map/sessions-map.tsx` (new)
- `src/components/map/court-popup.tsx` (new)
- `src/components/map/dynamic-map.tsx` (new)
- `src/lib/types.ts` (reference only)

## Success Criteria
- Map renders with all court markers
- Markers cluster when zoomed out, expand when zoomed in
- Clicking a marker shows popup with court info and session count
- Map respects dark/light theme toggle
- No SSR errors
