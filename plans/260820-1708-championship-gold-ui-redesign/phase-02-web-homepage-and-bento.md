# Phase 02: Web Homepage & Bento Grid Revamp

## Context Links
- [Phase 01](./phase-01-design-tokens-and-theme.md)
- [Homepage Sections](../../shuttleup-web/src/components/homepage/homepage-sections.tsx)
- [Web Page Entry](../../shuttleup-web/src/app/[locale]/page.tsx)

## Overview
- **Priority:** High
- **Status:** Pending
- **Description:** Redesign the Web landing page with a high-energy athletic hero section, real-time activity ticker, and modern Bento-grid feature presentation.

## Key Insights
- Flat 3-card features fail to communicate the multi-dimensional value of ShuttleUp (Skill matching + Court booking + Real-time community + Anti-smurf BELo rating).
- A Bento grid with distinct tile sizes (2x2, 2x1, 1x1) creates visual intrigue and guides conversion.

## Requirements
- **Hero Section**:
  - Gold gradient text clip on main value prop.
  - Floating live match pill with pulse animation.
  - High-contrast primary CTA button with gold glow effect + secondary frosted glass button.
- **Live Stats Strip**:
  - Athletic card background with border-t/border-b subtle gradient glow.
- **Bento Grid Features Section**:
  - Tile 1 (Large 2x2): "BELo Smart Matchmaker" with live Elo tier animation.
  - Tile 2 (Wide 2x1): "Sân Cầu Lông & Bản Đồ Radar" with live slot indicator.
  - Tile 3 (1x1): "Cộng Đồng Xác Thực" with host trust badge.
  - Tile 4 (1x1): "Thanh Toán & QR Nhanh" with auto-split slot cost calculator.
- **CTA Banner**:
  - Premium Championship Gold card with high-impact badminton visual accent.

## Related Code Files
- `shuttleup-web/src/components/homepage/homepage-sections.tsx`
- `shuttleup-web/src/app/[locale]/page.tsx`

## Implementation Steps
1. Refactor `HeroSection` with championship typography, badge, and glow CTAs.
2. Build `BentoFeaturesSection` component replacing old 3-column layout.
3. Update `StatsStrip` and `CtaBanner` with polished dark surfaces and golden accents.

## Todo List
- [ ] Implement new `HeroSection` with gold gradient and floating live indicator
- [ ] Implement `BentoFeaturesSection` with 4 asymmetric feature cards
- [ ] Polish `StatsStrip` and `CtaBanner`
- [ ] Validate responsive layout on Mobile (375px), Tablet (768px), and Desktop (1440px)

## Success Criteria
- Responsive across all screen sizes without overflow.
- Smooth framer-motion stagger animations with reduced-motion fallback.
