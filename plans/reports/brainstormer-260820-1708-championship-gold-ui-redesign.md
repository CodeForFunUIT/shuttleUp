# Brainstorm Report: ShuttleUp UI/UX Redesign — Championship Gold & Pro Athletic

- **Date:** 2026-08-20 17:08
- **Author:** Solution Brainstormer (Antigravity)
- **Status:** Approved Direction
- **Style Direction:** Championship Gold (Premium Pro Sports & Tournament Broadcast)

---

## 1. Problem Statement & Audit

### Critical Weaknesses in Current UI
1. **Design System Disconnection**:
   - Web used experimental gold tokens (`#F5C842`), Mobile used stock Material 3 green (`#059669`), and `docs/design-guidelines.md` was out of sync.
2. **Visual Flatness**:
   - Homepage Hero relied on a heavy dark overlay over photo without depth/lighting layers.
   - Feature section was basic 3-column cards without visual hierarchy or Bento grid storytelling.
3. **BELo Rank Presentation**:
   - Lacked gamification excitement: no tier progression cards (Bronze, Silver, Gold, Platinum, Diamond, Master), no rank glow, and plain sliders.
4. **Sessions & Court Booking**:
   - Session cards lacked live capacity gauges ("Còn 2/6 slot"), real-time level match indicators, and court amenity badges.
5. **Mobile Theme**:
   - Lacked cohesive dark mode, athletic typography, and sports card tactile feel.

---

## 2. Design System Architecture: "Championship Gold"

### 2.1 Color Palette
| Token | Light Mode | Dark Mode (Default) | Role |
|---|---|---|---|
| `--background` | `#F4F6F9` (Porcelain Slate) | `#0B0E14` (Deep Court Black) | Base page canvas |
| `--surface-card` | `#FFFFFF` | `#131822` (Midnight Plate) | Cards, modals, containers |
| `--surface-hover` | `#EDF1F7` | `#1C2331` | Hover states |
| `--primary` | `#D9A300` (Polished Gold) | `#F5C842` (Shuttle Gold Vibrant) | Key CTAs, active highlights |
| `--accent` | `#FF6B35` (Flame Orange) | `#FF7A45` (Energy Flame) | Badges, live events, rank boosts |
| `--border` | `rgba(15, 23, 42, 0.08)` | `rgba(255, 255, 255, 0.08)` | Subtle crisp borders |
| `--border-highlight`| `rgba(217, 163, 0, 0.4)` | `rgba(245, 200, 66, 0.35)` | Active/focus/tier gold borders |
| `--text-primary` | `#0D1117` | `#F0F4F8` | Primary readable copy |
| `--text-muted` | `#64748B` | `#8B9BB4` | Subtitles, helper text |
| `--color-win` | `#10B981` (Emerald) | `#34D399` | Match won, rating + |
| `--color-loss` | `#EF4444` (Rally Red) | `#F87171` | Match lost, rating - |

### 2.2 Typography
- **Headings & Badges**: `Barlow Condensed` (Weights: 600, 700, 800) — Bold, dynamic, stadium energy.
- **Body & Controls**: `Plus Jakarta Sans` / `Inter` (Weights: 400, 500, 600) — High legibility.
- **Metrics, Elo & Time**: `JetBrains Mono` / Tabular Nums — Precision stats.

### 2.3 Visual Effects & Shadows
- **Card Glow**: `box-shadow: 0 0 24px -6px rgba(245, 200, 66, 0.15)`
- **Glassmorphism**: `backdrop-filter: blur(16px); background: rgba(19, 24, 34, 0.85)`
- **Subtle Court Line Accents**: SVG background badminton doubles boundary grids with opacity `0.04`.

---

## 3. Component Revamp Specifications

### 3.1 Web Homepage (Hero & Bento Grid)
- **Hero**:
  - High-impact headline with Gold text gradient (`bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent`).
  - Dual CTAs: Primary Glowing Gold "Tìm Trận Ngay" + Glass Outlined "Tạo Buổi Chơi".
  - Floating Live Match Pill with pulse indicator ("⚡ 24 trận đang diễn ra tại TP.HCM").
- **Bento Grid Features**:
  - *Tile 1 (Large 2x2)*: Interactive BELo Matchmaker preview with tier badge visualizer.
  - *Tile 2 (Wide 2x1)*: Live Court Map radar with real-time slot availability.
  - *Tile 3 (1x1)*: Community rating & verified host guarantee.
  - *Tile 4 (1x1)*: Instant QR booking & payment slip generator.

### 3.2 BELo Gamification & Simulator
- **Tier Hierarchy Cards**:
  - Bronze (`#CD7F32`), Silver (`#C0C0C0`), Gold (`#F5C842`), Platinum (`#00E5FF`), Diamond (`#A855F7`), Master (`#FF4655`).
- **Interactive Match Simulator**:
  - Two player duel card (Player A vs Player B) with Elo probability gauge.
  - Dynamic score prediction bar with live win/loss point calculation.
  - Animated delta counter with celebratory haptic sound & glow.

### 3.3 Find Sessions & Court Booking
- **Session Card 2.0**:
  - Mini court preview header + Time chip (`18:00 - 20:00`).
  - Level badge (e.g., `Trình TB - Khá • 1400-1600 Elo`).
  - Slots indicator bar (e.g., 4/6 slots taken, color shifts when only 1 slot remains).
  - Host avatar with reputation star badge and verified checkmark.
- **Court Map View**:
  - Custom dark theme map tiles with gold shuttlecock cluster pins.
  - Interactive bottom card slider when tapping pins on map.

### 3.4 Mobile Flutter Synchronization
- **Theme**: Unified `ShuttleUpDarkTheme` matching web (`#0B0E14` base, `#131822` cards, `#F5C842` primary).
- **Navigation**: Sleek floating pill bottom bar with active gold indicator.
- **Match Feed**: Swipeable session cards with quick-join bottom sheets.
- **Player Profile**: Elo rating ring chart, match history timeline, and rank tier badge.

---

## 4. Next Steps
1. Create implementation plan (`/plan`) detailing file-by-file changes across `shuttleup-web`, `shuttleup-mobile`, and documentation.
2. Update design tokens in `globals.css` and `app_theme.dart`.
3. Refactor components sequentially with zero regression.
