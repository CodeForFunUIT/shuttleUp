# BELo Simulator on Homepage — Brainstorm

## Problem Statement

Add an interactive BELo ELO simulator to the public homepage (`page.tsx`) so any visitor can understand the ranking system without logging in. Must support all 3 game types: Singles, Doubles, Mixed.

## Current State

- **Homepage** (`page.tsx`): Hero → Stats → Features → Image Strip → CTA. ~208 lines.
- **Existing components**: `belo-simulator.tsx` (Singles only, 397 lines), `belo-how-it-works.tsx` (92 lines), `belo-tier-table.tsx`, `belo-hero-section.tsx`
- **Backend calc**: `elo-calculation.service.ts` has `calculateSingles()` and `calculateDoubles()` with synergy, carry weight, K-factor
- **Current simulator**: Only handles Singles. No Doubles/Mixed mode. Lives in `/dashboard/belo` (auth-required)

## Approaches Evaluated

### A) Reuse existing `BeloSimulator` + add tabs for Doubles/Mixed

**Pros:** Reuse existing code, less work
**Cons:** Current component is 397 lines and tightly coupled. Adding doubles logic (4 players + synergy + carry weight) would push it to 600+ lines. Violates 200-line rule.

### B) Build a new modular `BeloPublicSimulator` with tabbed game modes ✅ RECOMMENDED

**Pros:**
- Clean separation: `belo-calc-engine.ts` (pure functions) + `belo-public-simulator.tsx` (UI shell) + per-mode panels
- Each file stays under 200 lines
- Shared calc engine between existing dashboard simulator and new homepage one
- Homepage section is self-contained, can be lazy-loaded

**Cons:** More files to manage (4-5 files)

### C) Embed existing simulator directly on homepage with no changes

**Pros:** Zero new code
**Cons:** No Doubles/Mixed support. Dashboard-styled UI may clash with landing page aesthetic.

## Recommended Solution: Approach B

### Architecture

```
src/components/belo/
├── belo-calc-engine.ts           # Pure calc functions (shared)
├── belo-public-simulator.tsx     # Tabbed shell (Singles | Doubles | Mixed)
├── sim-singles-panel.tsx         # Singles input/output panel
├── sim-doubles-panel.tsx         # Doubles input/output (4 players + synergy)
├── sim-result-display.tsx        # Shared result cards (reusable)
├── belo-simulator.tsx            # Existing dashboard simulator (keep)
├── belo-how-it-works.tsx         # Existing (keep)
├── belo-tier-table.tsx           # Existing (keep)
└── belo-hero-section.tsx         # Existing (keep)
```

### Key Design Decisions

1. **Tabbed interface** — 3 tabs: `🏸 Đơn (Singles)` | `👥 Đôi (Doubles)` | `🔀 Hỗn hợp (Mixed)`
2. **Mixed = Doubles with label change** — Same calculation as Doubles, just different UI labels (must have 1 male + 1 female per pair). No separate calc needed.
3. **Shared calc engine** — Extract pure functions from existing `belo-simulator.tsx` into `belo-calc-engine.ts`. Both dashboard and homepage simulators import from here.
4. **Homepage placement** — New section between "Features" and "Image Strip", with dark gradient background to stand out
5. **Visual**: Animated result transitions, tier badge changes, interactive probability bar

### Doubles Simulator Inputs (per pair)
- Player 1 ELO + total games
- Player 2 ELO + total games
- Games together (for synergy bonus)
- Winner selection (Pair A vs Pair B)

### Doubles Result Display
- Per-player delta with carry weight %
- Pair Rating with synergy bonus
- Team-level expected win probability

### Homepage Section Design
- Section title: "Trải nghiệm BELo Ranking" with subtitle
- Tabs for game mode selection (shadcn Tabs component)
- Two-column layout: Input (left) | Result (right)
- Below simulator: compact "How it Works" summary (3 cards)
- CTA: "Đăng ký để bắt đầu xếp hạng"

## Implementation Considerations

- Extract calc engine first → update existing dashboard simulator → build homepage version
- Use `"use client"` for simulator sections only
- Keep homepage `page.tsx` as Server Component, import client simulator component
- Ensure responsive: stack vertically on mobile
- Use existing shadcn components: Tabs, Card, Input, Select, Badge, Button

## File Size Estimates

| File | Est. Lines | Purpose |
|------|-----------|---------|
| `belo-calc-engine.ts` | ~80 | Pure calc functions |
| `belo-public-simulator.tsx` | ~60 | Tab shell + section wrapper |
| `sim-singles-panel.tsx` | ~150 | Singles I/O panel |
| `sim-doubles-panel.tsx` | ~180 | Doubles I/O panel (4 players) |
| `sim-result-display.tsx` | ~120 | Shared result cards |
| `page.tsx` changes | ~15 | Import + section placement |

## Risks

1. **Doubles UI complexity** — 4 players × 2 inputs each = 8 fields. Mitigate with collapsible panels + smart defaults.
2. **Mobile UX** — Two-column layout won't work on mobile. Stack vertically.
3. **Performance** — All calculations are client-side, O(1). No risk.

## Success Criteria

- [ ] Visitors can simulate Singles, Doubles, Mixed without login
- [ ] Results show per-player delta, tier changes, carry weight, synergy bonus
- [ ] All files under 200 lines
- [ ] Responsive on mobile
- [ ] Calc engine shared between dashboard and homepage simulators

## Next Steps

Create implementation plan with `/plan` if approved.
