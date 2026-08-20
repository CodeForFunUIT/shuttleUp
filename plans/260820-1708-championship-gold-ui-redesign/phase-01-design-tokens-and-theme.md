# Phase 01: Harmonize Design Tokens & Core Theme

## Context Links
- [Brainstorm Report](../../plans/reports/brainstormer-260820-1708-championship-gold-ui-redesign.md)
- [Design Guidelines](../../docs/design-guidelines.md)
- [Web Globals CSS](../../shuttleup-web/src/app/globals.css)
- [Mobile App Theme](../../shuttleup-mobile/lib/core/theme/app_theme.dart)

## Overview
- **Priority:** High
- **Status:** Pending
- **Description:** Unify color tokens, typography scales, border radii, shadows, and glassmorphism styles across `shuttleup-web`, `shuttleup-mobile`, and documentation.

## Key Insights
- Currently Web uses Gold/Black while Mobile uses Emerald Green.
- Unifying tokens at the foundation guarantees consistency across all screens and prevents CSS/style divergence.

## Requirements
- Update `shuttleup-web/src/app/globals.css` with Championship Gold tokens (`#0B0E14` dark base, `#131822` dark surface, `#F5C842` primary, `#FF6B35` accent, `#34D399` win, `#F87171` loss).
- Align `docs/design-guidelines.md` with official Championship Gold brand palette.
- Setup `shuttleup-mobile/lib/core/theme/app_theme.dart` with matching `ColorScheme` for light and dark modes.

## Related Code Files
- `docs/design-guidelines.md`
- `shuttleup-web/src/app/globals.css`
- `shuttleup-mobile/lib/core/theme/app_theme.dart`

## Implementation Steps
1. **Update Globals CSS**:
   - Refine `:root` and `.dark` variables for surface contrast, gold highlights, and glow utility classes.
2. **Update Mobile AppTheme**:
   - Define `ShuttleUpDarkTheme` and `ShuttleUpLightTheme` with custom sports colors, button styles, and card styling.
3. **Update Docs**:
   - Update `docs/design-guidelines.md` reflecting typography, color tokens, and elevation scales.

## Todo List
- [ ] Refine `globals.css` theme tokens & glow animations
- [ ] Configure `app_theme.dart` in Flutter for dark/light sports theme
- [ ] Update `docs/design-guidelines.md`

## Success Criteria
- Light & dark theme tokens render cleanly without contrast issues (minimum 4.5:1 ratio).
- Zero compilation or build errors across web & mobile.
