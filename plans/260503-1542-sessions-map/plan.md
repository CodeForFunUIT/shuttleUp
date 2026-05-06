---
title: "Interactive Sessions Map with Leaflet"
description: "Display 375 courts and 1000+ sessions on an interactive Leaflet map with marker clustering, popups, and theme-aware tiles"
status: done
priority: high
effort: medium (2-3h)
branch: feature/sessions-map
tags: [frontend, map, leaflet, react-leaflet]
created: 2026-05-03T15:42:00+07:00
---

# Interactive Sessions Map with Leaflet

## Context
- [Brainstorm Report](../reports/brainstormer-260503-1536-map-library-selection.md)
- [Scout Report](./reports/scout-sessions-map.md)
- 375 courts with lat/lng in DB, 1000+ sessions linked to courts
- Sessions API already returns `court` relation with coordinates
- No map library installed yet

## Phases

| # | Phase | Status | Files |
|---|---|---|---|
| 1 | [Install & Setup Leaflet](./phase-01-install-leaflet.md) | ✅ | `package.json`, CSS import |
| 2 | [Build Map Component](./phase-02-map-component.md) | ✅ | 3 new components |
| 3 | [Integrate into Sessions Page](./phase-03-integrate-page.md) | ✅ | 1 modified page |

## Architecture
```
Sessions Page
├── Toggle: Grid View | Map View
├── Grid View (existing cards)
└── Map View (new)
    └── SessionsMap
        ├── react-leaflet MapContainer (CartoDB dark/light tiles)
        ├── MarkerCluster (groups nearby courts)
        └── CourtMarker × N
            └── Popup: court name, session count, price range, "View" link
```

## Dependencies
- `leaflet` + `react-leaflet` — core map rendering
- `react-leaflet-cluster` — marker clustering
- `@types/leaflet` — TypeScript definitions
- CartoDB free tile servers (no API key)

## Risks
- Leaflet requires `window` → must use `dynamic(() => import(...), { ssr: false })` in Next.js
- Leaflet CSS must be imported globally or the map renders broken
- Theme switching (dark/light tiles) needs `useTheme()` integration
