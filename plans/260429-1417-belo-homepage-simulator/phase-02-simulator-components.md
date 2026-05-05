# Phase 2: Build Simulator Components

## Context

- [Phase 1: Calc Engine](phase-01-calc-engine.md) — must be completed first
- [Existing result cards](file:///d:/portfolio/shuttleUp/shuttleup-web/src/components/belo/belo-simulator.tsx#L298-L396) — `PlayerResultCard` + `DetailRow` to extract

## Overview

- **Priority:** High
- **Status:** ⬜ Planned (depends on Phase 1)

Build 4 focused components: tab shell, singles panel, doubles panel, shared result display.

## Related Code Files

| Action | File | ~Lines | Purpose |
|--------|------|--------|---------|
| CREATE | `src/components/belo/belo-public-simulator.tsx` | ~60 | Tab shell: Đơn \| Đôi \| Hỗn hợp |
| CREATE | `src/components/belo/sim-singles-panel.tsx` | ~130 | Singles input form + result |
| CREATE | `src/components/belo/sim-doubles-panel.tsx` | ~190 | Doubles input form + result (4 players) |
| CREATE | `src/components/belo/sim-result-display.tsx` | ~120 | Shared result cards (PlayerResultCard, DetailRow) |

## Implementation Steps

### 1. Create `sim-result-display.tsx` (~120 lines)

Extract from existing `belo-simulator.tsx` lines 298-396:
- `PlayerResultCard` — shows before/after ELO, delta arrow, tier badge, win probability bar
- `DetailRow` — key-value pair for calculation details
- `DoublesPlayerCard` — NEW, compact version for doubles (shows carry weight %)
- `TeamResultCard` — NEW, wraps 2 players + team-level synergy info

### 2. Create `sim-singles-panel.tsx` (~130 lines)

Simplified version of existing simulator:
- 2 player inputs (ELO + total games)
- Winner selector
- "Tính ELO" + Reset buttons
- Import `PlayerResultCard` + `DetailRow` from `sim-result-display`
- Import `simulateSingles` from `belo-calc-engine`

### 3. Create `sim-doubles-panel.tsx` (~190 lines)

New component for doubles simulation:

**Inputs (per team):**
- Player 1: ELO + total games
- Player 2: ELO + total games
- Games together (synergy input)
- Winner: Team A / Team B

**Results show:**
- Per-player: delta, new ELO, carry weight %, tier change
- Per-team: pair rating, synergy bonus applied
- Match: K-factor, expected win %, total team delta

**UX Notes:**
- Use collapsible sections for each team to manage visual complexity
- Smart defaults: ELO=1200, games=10, together=5
- "Games together" has helper tooltip explaining synergy bonus

### 4. Create `belo-public-simulator.tsx` (~60 lines)

Tab shell wrapper for homepage:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// 3 tabs:
// "singles" → <SimSinglesPanel />
// "doubles" → <SimDoublesPanel gameLabel="Đôi thuần" />
// "mixed"   → <SimDoublesPanel gameLabel="Đôi hỗn hợp" />
```

**Key design:** Mixed reuses `SimDoublesPanel` with different labels. No separate component.

**Visual design:**
- Section heading: "Trải nghiệm BELo Ranking"
- Subtitle: "Giả lập tính điểm ELO cho cầu lông — chọn chế độ chơi và thử ngay"
- Tab icons: 🏸 Đơn | 👥 Đôi | 🔀 Hỗn hợp
- Below tabs: compact How-It-Works (3 cards) + CTA

## Todo List

- [ ] Create `sim-result-display.tsx` with shared result components
- [ ] Create `sim-singles-panel.tsx`
- [ ] Create `sim-doubles-panel.tsx`
- [ ] Create `belo-public-simulator.tsx` tab shell
- [ ] Test all 3 modes produce correct results
- [ ] Verify responsive layout on mobile

## Success Criteria

- All 3 game mode tabs render correctly
- Singles matches existing dashboard simulator results
- Doubles shows carry weight + synergy breakdown
- Mixed is doubles with different labels
- All files under 200 lines
- Mobile responsive (stacked layout)
