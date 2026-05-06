# Phase 2: Component Color Migration

## Context
Multiple components use hardcoded `bg-emerald-*` classes instead of `bg-primary`. These need updating to use BELo Gold tokens.

## Files to Modify

### High Priority (user-facing pages)
1. `src/app/[locale]/page.tsx` — `bg-slate-950` → use dark surface token
2. `src/app/[locale]/sessions/page.tsx` — `bg-green-500` skill bar color
3. `src/app/[locale]/sessions/[id]/page.tsx` — `bg-emerald-600` booking button
4. `src/app/[locale]/profile/page.tsx` — `bg-emerald-100` avatar

### Dashboard pages
5. `src/app/[locale]/dashboard/page.tsx` — `bg-emerald-600` button
6. `src/app/[locale]/dashboard/layout.tsx` — `bg-emerald-50` active nav
7. `src/app/[locale]/dashboard/sessions/new/page.tsx` — `bg-emerald-600` submit
8. `src/app/[locale]/dashboard/sessions/[id]/page.tsx` — `bg-emerald-*` badges

### BELo simulator components
9. `src/components/belo/belo-public-simulator.tsx` — `border-emerald-500/30`
10. `src/components/belo/belo-simulator.tsx` — `bg-emerald-600`, badges
11. `src/components/belo/sim-singles-panel.tsx` — `bg-emerald-600`
12. `src/components/belo/sim-result-display.tsx` — `bg-emerald-50/60`

## Migration Rules
| Old Pattern | New Pattern |
|---|---|
| `bg-emerald-600` | `bg-primary` |
| `bg-emerald-700` (hover) | `bg-primary/90` |
| `bg-emerald-100` | `bg-primary/10` |
| `text-emerald-700` | `text-primary` |
| `text-emerald-400` | `text-primary` |
| `border-emerald-*` | `border-primary/30` |
| `bg-emerald-50` | `bg-primary/5` |
| `bg-slate-950` | `bg-[var(--bg-base)]` or `bg-background` |

## Todo
- [ ] Fix home page section bg
- [ ] Fix sessions grid skill bar colors
- [ ] Fix session detail booking button
- [ ] Fix profile avatar
- [ ] Fix dashboard pages
- [ ] Fix BELo simulator components

## Success Criteria
- Zero references to `bg-emerald-*` or `text-emerald-*` in codebase
- All buttons/badges use `bg-primary` or BELo semantic tokens
