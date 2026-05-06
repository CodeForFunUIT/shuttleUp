# Brainstorm: Adopt BELo Design System

## Problem Statement
Current site uses "Emerald Sports" palette (green primary, orange accent) with Space Grotesk + Barlow fonts. User has a well-defined **BELo Design System** ("Nike meets Lichess") with completely different identity: **Shuttle Gold primary**, dark-first, Inter + Barlow Condensed + JetBrains Mono typography.

## Current vs BELo: Gap Analysis

| Area | Current | BELo Target | Impact |
|---|---|---|---|
| **Primary** | Emerald green `#059669` | Shuttle Gold `#F5C842` | Total brand shift |
| **Default theme** | Light-first | **Dark-first** | Layout + defaultTheme change |
| **Display font** | Space Grotesk | **Barlow Condensed** | Font import + CSS |
| **Body font** | Barlow | **Inter** | Font import + CSS |
| **Mono font** | Geist Mono | **JetBrains Mono** | Font import + CSS |
| **Background (dark)** | `#0A0F1A` (blue-tinted) | `#0D0F12` (neutral Court Black) | CSS tokens |
| **Surfaces** | oklch-based | Hex-based BELo tokens | CSS tokens |
| **Border radius** | `0.625rem` base | 6/10/14/20px scale | CSS tokens |
| **CTA style** | Green bg + white text | Gold bg + dark text | Button component |
| **Motion** | 200ms default | 150ms default (faster, sportier) | CSS tokens |
| **Cluster icons** | Emerald green | Shuttle Gold → Orange → Red gradient | CSS |

## Approach: CSS-First Token Swap

**The great news:** shadcn/ui + Tailwind CSS already use CSS variables. We just need to swap the tokens — no component rewrites needed.

### Scope of Changes

1. **`globals.css`** — The big one. Swap all color tokens, fonts, radii, cluster styles.
2. **`layout.tsx`** — Change font imports (Inter, Barlow Condensed, JetBrains Mono), defaultTheme → "dark".
3. **`tailwind.config`** — May need BELo semantic color tokens if used directly.
4. **Components** — Mostly zero changes (they use `bg-primary`, `text-foreground` etc). Some hardcoded colors in map cluster icons need updating.

### What stays the same
- All component logic, hooks, API integration
- i18n system
- Page structure and layout
- Map functionality

## Recommended Solution

### Phase 1: Core Token Swap (~30 min)
1. Replace Google Fonts import → Inter, Barlow Condensed, JetBrains Mono
2. Rewrite `:root` light mode tokens to BELo light palette
3. Rewrite `.dark` tokens to BELo dark palette (Court Black surfaces)
4. Update `--font-display`, `--font-body`, `--font-mono`
5. Update border radius scale to BELo values
6. Add BELo semantic colors (win/loss/info/danger)
7. Update `defaultTheme` in layout.tsx from "light" → "dark"

### Phase 2: Component Polish (~15 min)
1. Update map cluster icon colors → Gold/Orange/Red
2. Update skill badge colors if needed
3. Update leaflet popup dark styles
4. Verify CTA buttons render Gold on dark

### Risk Assessment
- **Low risk** — CSS variable swap is non-destructive
- **Contrast check** — Gold `#F5C842` on dark `#0D0F12` = 10.7:1 ratio ✅ (AAA)
- **Gold on white** — 1.7:1 ⚠️ needs border treatment per BELo spec

## Success Metrics
- Dark mode feels like "Nike meets Lichess"
- Gold CTA buttons are prominent and clear
- Typography hierarchy: Barlow Condensed for display, Inter for body
- All existing functionality unchanged

## Next Steps
Implement directly — purely CSS + font changes, no logic changes.
