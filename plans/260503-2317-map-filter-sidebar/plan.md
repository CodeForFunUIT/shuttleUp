---
title: "Map Filter Sidebar"
description: "Glassmorphism filter sidebar overlaid on map with client-side filtering and flyTo geolocation"
status: done
priority: high
effort: small (45min)
branch: feature/sessions-map
tags: [frontend, ux, map]
created: 2026-05-03T23:17:00+07:00
---

# Map Filter Sidebar

## Context
Grid view has filtering+pagination via search API. Map view has no filtering — loads all 1000 sessions. Map needs client-side filtering (not API) because clustering needs marker density.

## Phases

| # | Phase | Status | Key Files |
|---|---|---|---|
| 1 | MapFilterSidebar + client-side filtering in SessionsMap | ⬜ | `map-filter-sidebar.tsx`, `sessions-map.tsx` |

## Architecture
```
MapContainer (relative)
├── TileLayer + MarkerClusterGroup (filtered courtGroups)
└── MapFilterSidebar (absolute, left, z-[1000])
    ├── Search input → filters by session title
    ├── District select → filters by court.district
    ├── Skill select → filters by session.skillRequired
    ├── Near me → map.flyTo(userCoords)
    └── Stats: "X courts · Y sessions"
```
