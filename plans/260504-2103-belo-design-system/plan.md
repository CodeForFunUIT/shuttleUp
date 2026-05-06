---
title: "Adopt BELo Design System"
description: "Replace Emerald Sports palette with BELo design system - Shuttle Gold primary, dark-first, Inter + Barlow Condensed typography"
status: done
priority: high
effort: medium (1.5h)
branch: feat/map
tags: [frontend, design, ux]
created: 2026-05-04T21:03:00+07:00
---

# Adopt BELo Design System

## Context
Current site uses "Emerald Sports" (green `#059669` primary). BELo spec: "Nike meets Lichess" — Shuttle Gold `#F5C842`, dark-first, Inter/Barlow Condensed/JetBrains Mono.

Reference: [belo-design-system.md](../../.agents/docs/belo-design-system.md)

## Phases

| # | Phase | Status | Files | Effort |
|---|---|---|---|---|
| 1 | Core token swap (fonts, colors, radii) | ⬜ | `globals.css`, `layout.tsx` | 30min |
| 2 | Component color migration (emerald → primary) | ⬜ | ~12 component files | 30min |
| 3 | Map + cluster style updates | ⬜ | `globals.css`, `sessions-map.tsx` | 10min |
| 4 | Visual verification + polish | ⬜ | Various | 15min |

## Key Decisions
- `defaultTheme` changes from `"light"` → `"dark"`
- Shuttle Gold `#F5C842` becomes `--primary` (CTA, highlights)
- Energy Orange `#FF6B35` becomes `--accent`
- Hardcoded `bg-emerald-*` classes → `bg-primary` / BELo Gold equivalents
- Fonts: Space Grotesk → Barlow Condensed (display), Barlow → Inter (body)
