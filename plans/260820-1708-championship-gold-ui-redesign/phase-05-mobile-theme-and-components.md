# Phase 05: Flutter Mobile Theme & Component Synchronization

## Context Links
- [Mobile Theme](../../shuttleup-mobile/lib/core/theme/app_theme.dart)
- [Session Card Widget](../../shuttleup-mobile/lib/features/session/presentation/widgets/session_card.dart)
- [Dashboard Page](../../shuttleup-mobile/lib/features/dashboard/presentation/pages/dashboard_page.dart)

## Overview
- **Priority:** High
- **Status:** Pending
- **Description:** Align Flutter mobile application styling with the Championship Gold design language, supporting full Dark and Light modes with custom athletic widgets.

## Key Insights
- Mobile users expect a dark, tactical, sports-oriented feel with smooth transitions, prominent CTAs, and easy thumb-reach touch targets (min 48px).

## Requirements
- **Theme Definition**:
  - `ShuttleUpDarkTheme`: Background `#0B0E14`, Cards `#131822`, Accent Gold `#F5C842`, Energy Flame `#FF6B35`.
  - `ShuttleUpLightTheme`: Background `#F4F6F9`, Cards `#FFFFFF`, Primary `#D9A300`.
- **Custom Mobile Widgets**:
  - `ShuttleSessionCard`: Card with level badge, time badge, slot capacity indicator, and direct join action.
  - `BeloRankCard`: Player Elo rating card with radial progress and rank tier emblem.
  - `FloatingBottomNavBar`: Modern curved bottom navigation bar with active gold indicator.

## Related Code Files
- `shuttleup-mobile/lib/core/theme/app_theme.dart`
- `shuttleup-mobile/lib/features/session/presentation/widgets/session_card.dart`
- `shuttleup-mobile/lib/features/dashboard/presentation/pages/dashboard_page.dart`
- `shuttleup-mobile/lib/features/auth/presentation/pages/auth_page.dart`

## Implementation Steps
1. Refactor `app_theme.dart` with complete dark/light color schemes and elevated button themes.
2. Update mobile `session_card.dart` with modern layout matching web design.
3. Polish `dashboard_page.dart` with quick-match action cards and rank overview.

## Todo List
- [ ] Implement `app_theme.dart` with dark & light theme modes
- [ ] Upgrade mobile `session_card.dart` with slot capacity bar
- [ ] Polish dashboard header & bottom navigation bar
- [ ] Run `flutter test` or widget tests to verify zero regression

## Success Criteria
- Mobile UI adheres to 48x48px touch targets.
- All Flutter tests pass without theme or widget errors.
