---
title: Enhance ShuttleUp Blueprint Design
description: Port BELo design system to Flutter + full-premium animations + 3D web landing
status: complete
priority: high
effort: 40-50h
branch: feature/belo-mobile-design
tags: [design-system, flutter, animation, three.js, ui-ux]
created: 2026-05-20
---

# Enhance ShuttleUp Blueprint Design

Port BELo design system to Flutter mobile, add full-premium animations, floating 3D shuttlecock on web.

## Phase Overview

| Phase | Name | Est. Hours | Status |
|-------|------|-----------|--------|
| 1 | Design Foundation | 8-10h | ✅ Complete |
| 2 | Core Animations | 10-12h | ✅ Complete |
| 3 | Hero & Interactions | 8-10h | ✅ Complete |
| 4 | Polish & Portfolio | 6-8h | ✅ Complete |
| 5 | Web 3D Enhancement | 8-10h | ✅ Complete |

## Key Dependencies

- Phase 1 blocks all other phases (foundation)
- Phase 2 depends on Phase 1 (animations use design tokens)
- Phase 3 depends on Phase 2 (hero uses animation utilities)
- Phase 4 can start after Phase 2
- Phase 5 is independent (web only)

## Key Decisions

- **Color:** BELo Gold/Orange (port from web)
- **Typography:** Barlow Condensed + Barlow (via google_fonts)
- **Animations:** Full premium (all 7 features)
- **3D:** Floating shuttlecock hero only (React Three Fiber)
