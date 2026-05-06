# Phase 1: Core Token Swap

## Context
- [BELo Design System](../../../.agents/docs/belo-design-system.md)
- [Current globals.css](../../../shuttleup-web/src/app/globals.css)
- [Current layout.tsx](../../../shuttleup-web/src/app/[locale]/layout.tsx)

## Overview
Replace all CSS design tokens and font stack to match BELo spec.

## Files to Modify
1. `shuttleup-web/src/app/globals.css` — Full token rewrite
2. `shuttleup-web/src/app/[locale]/layout.tsx` — Font imports + defaultTheme

## Implementation Steps

### 1.1 Update Google Fonts import in globals.css
Replace `Space Grotesk + Barlow` with:
```
Inter (400, 500) + Barlow Condensed (500, 600) + JetBrains Mono (400)
```

### 1.2 Rewrite `:root` (Light Mode) tokens
Per BELo §2.3 + §12:
- `--primary`: Shuttle Gold `#F5C842`
- `--primary-foreground`: `#0D0F12` (dark text on gold bg)
- `--background`: `#F5F6F8`
- `--card`: `#FFFFFF`
- `--accent`: Energy Orange `#FF6B35`
- `--border`: `rgba(0,0,0,0.12)`
- Add BELo semantic: `--color-win`, `--color-loss`, `--color-info`, `--color-danger`

### 1.3 Rewrite `.dark` tokens
Per BELo §2.2 + §12:
- `--primary`: `#F5C842` (Gold stays same in dark — it's the brand)
- `--primary-foreground`: `#0D0F12`
- `--background`: Court Black `#0D0F12`
- `--card`: `#161A20` (bg-surface)
- `--popover`: `#1C2128` (bg-elevated)
- `--muted-foreground`: `#6B7280` (text-muted)
- `--border`: `rgba(255,255,255,0.12)`

### 1.4 Update font CSS variables
```css
--font-display: 'Barlow Condensed', 'Inter', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 1.5 Update border radius scale
Per BELo §5.1: `--radius: 10px` base → sm=6px, md=10px, lg=14px, xl=20px

### 1.6 Update layout.tsx
- Replace `Geist` font import with `Inter`, `Barlow_Condensed`, `JetBrains_Mono` from `next/font/google`
- Change `defaultTheme="light"` → `defaultTheme="dark"`
- Update CSS variable classes on `<html>`

### 1.7 Update cluster icon colors
Per BELo brand gradient:
- `.cluster-small` → Shuttle Gold `#F5C842`
- `.cluster-medium` → Energy Orange `#FF6B35`
- `.cluster-large` → Rally Red `#E8385A`

### 1.8 Update motion duration
Per BELo §8.1: transition-duration 200ms → 150ms

## Todo
- [ ] 1.1 Update font import
- [ ] 1.2 Rewrite light mode tokens
- [ ] 1.3 Rewrite dark mode tokens
- [ ] 1.4 Update font variables
- [ ] 1.5 Update radius scale
- [ ] 1.6 Update layout.tsx
- [ ] 1.7 Update cluster colors
- [ ] 1.8 Update motion speed

## Success Criteria
- Build passes (`next build`)
- Dark mode shows Court Black background with Gold primary
- Light mode shows `#F5F6F8` background with Gold primary
- Fonts render as Inter (body) + Barlow Condensed (headings)
