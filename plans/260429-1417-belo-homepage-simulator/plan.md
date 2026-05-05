---
title: BELo Homepage Public Simulator
description: Add interactive ELO simulator to homepage with Singles/Doubles/Mixed tabs
status: planned
priority: medium
effort: medium
branch: feature/belo-homepage-simulator
tags: [belo, frontend, simulator, homepage]
created: 2026-04-29T14:17:00+07:00
---

# BELo Homepage Public Simulator

## Context

- [Brainstorm Report](../reports/brainstormer-260429-1415-belo-homepage-simulator.md)
- [BELo Spec](../260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md)

## Goal

Add interactive BELo ELO simulator to public homepage supporting all 3 game modes (Singles, Doubles, Mixed) so any visitor can understand the ranking system without login.

## Phases

| # | Phase | Status | Files |
|---|-------|--------|-------|
| 1 | [Extract Calc Engine](phase-01-calc-engine.md) | ⬜ | 2 files |
| 2 | [Build Simulator Components](phase-02-simulator-components.md) | ⬜ | 4 files |
| 3 | [Integrate into Homepage](phase-03-homepage-integration.md) | ⬜ | 1 file |

## Dependencies

- Phase 2 depends on Phase 1 (calc engine)
- Phase 3 depends on Phase 2 (components ready)

## Success Criteria

- [ ] Visitors can simulate Singles, Doubles, Mixed without login
- [ ] Doubles shows carry weight, synergy bonus per player
- [ ] All new files under 200 lines
- [ ] Responsive on mobile (stack vertically)
- [ ] Existing dashboard simulator still works (uses shared calc engine)
- [ ] `npm run lint` passes
