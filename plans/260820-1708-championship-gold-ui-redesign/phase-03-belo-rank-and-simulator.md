# Phase 03: BELo Rank & Interactive Match Simulator

## Context Links
- [BELo Simulator Component](../../shuttleup-web/src/components/belo/belo-public-simulator.tsx)
- [Design System Tokens](../../shuttleup-web/src/app/globals.css)

## Overview
- **Priority:** High
- **Status:** Pending
- **Description:** Transform the BELo Simulator into a gamified, high-stakes match preview with interactive rank tier cards, duel gauges, and animated rating delta calculations.

## Key Insights
- BELo ranking is ShuttleUp's key differentiator (fair matching, anti-smurf).
- Making the rank cards visually stunning (Bronze to Master tier glows) drives user engagement and excitement to participate in ranked sessions.

## Requirements
- **Tier Badge Visualizer**:
  - Distinct athletic cards for: Bronze (`#CD7F32`), Silver (`#C0C0C0`), Gold (`#F5C842`), Platinum (`#00E5FF`), Diamond (`#A855F7`), Master (`#FF4655`).
  - Tier progression progress bar showing Elo range (e.g., `Gold III: 1400 - 1599`).
- **Gamified Duel Simulator**:
  - Player 1 vs Player 2 battle view with win probability gauge.
  - Interactive match result toggles (Thắng đậm 2-0, Thắng nghẹt thở 2-1, Thua).
  - Dynamic score calculation with animated `+Δ` / `-Δ` rating delta.
  - Celebratory visual feedback on high rank gain.

## Related Code Files
- `shuttleup-web/src/components/belo/belo-public-simulator.tsx`
- `shuttleup-web/src/components/belo/belo-tier-badge.tsx`

## Implementation Steps
1. Create `belo-tier-badge.tsx` with dedicated SVG tier icons and metallic gradient styles.
2. Upgrade `belo-public-simulator.tsx` layout with dual-player duel visual and interactive sliders.
3. Add animated rating delta counter and probability gauge.

## Todo List
- [ ] Implement `belo-tier-badge.tsx` with 6 competitive tiers
- [ ] Revamp `belo-public-simulator.tsx` duel interface
- [ ] Add interactive probability gauge and smooth delta animation

## Success Criteria
- Interactive controls recalculate instantly (<16ms) without lag.
- Accessible contrast for all rank badges.
