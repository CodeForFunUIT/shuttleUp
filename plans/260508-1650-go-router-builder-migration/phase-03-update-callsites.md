# Phase 03 — Update Navigation Call Sites

## Context Links
- Routes plan: `phase-02-routes-rewrite.md`
- Files to update (discovered via grep):

| File | Line | Old Call | New Call |
|------|------|----------|----------|
| `session_card.dart` | 21 | `context.push('/sessions/${session.id}', extra: session)` | `SessionDetailRoute(id: session.id, $extra: session).push(context)` |
| `session_detail_page.dart` | 98 | `context.push('/sessions/${session.id}/book', extra: session)` | `GuestBookingRoute(id: session.id, $extra: session).push(context)` |
| `dashboard_page.dart` | 15 | `context.push('/profile')` | `const ProfileRoute().push(context)` |
| `dashboard_page.dart` | 19 | `context.go('/')` | `const SessionListRoute().go(context)` |
| `guest_booking_page.dart` | 47 | `context.go('/')` | `const SessionListRoute().go(context)` |
| `auth_page.dart` | 23 | `context.go('/dashboard')` | `const DashboardRoute().go(context)` |

## Overview
- **Priority:** High
- **Status:** ⬜ todo
- **Scope:** Replace all 6 string-based navigation calls with generated type-safe calls

## Related Code Files
| File | Action |
|------|--------|
| `lib/features/session/presentation/widgets/session_card.dart` | Update line 21 |
| `lib/features/session/presentation/pages/session_detail_page.dart` | Update line 98 |
| `lib/features/dashboard/presentation/pages/dashboard_page.dart` | Update lines 15, 19 |
| `lib/features/booking/presentation/pages/guest_booking_page.dart` | Update line 47 |
| `lib/features/auth/presentation/pages/auth_page.dart` | Update line 23 |

## Implementation Steps

1. **Add import** to each file that uses route classes:
   ```dart
   import 'package:shuttleup_mobile/app/routes.dart';
   ```

2. **session_card.dart line 21** — replace:
   ```dart
   // BEFORE
   context.push('/sessions/${session.id}', extra: session);
   // AFTER
   SessionDetailRoute(id: session.id, $extra: session).push(context);
   ```

3. **session_detail_page.dart line 98** — replace:
   ```dart
   // BEFORE
   context.push('/sessions/${session.id}/book', extra: session);
   // AFTER
   GuestBookingRoute(id: session.id, $extra: session).push(context);
   ```

4. **dashboard_page.dart** — two replacements:
   ```dart
   // Line 15 BEFORE
   onPressed: () => context.push('/profile'),
   // Line 15 AFTER
   onPressed: () => const ProfileRoute().push(context),
   
   // Line 19 BEFORE
   onPressed: () => context.go('/'),
   // Line 19 AFTER
   onPressed: () => const SessionListRoute().go(context),
   ```

5. **guest_booking_page.dart line 47** — replace:
   ```dart
   // BEFORE
   context.go('/');
   // AFTER
   const SessionListRoute().go(context);
   ```

6. **auth_page.dart line 23** — replace:
   ```dart
   // BEFORE
   context.go('/dashboard');
   // AFTER
   const DashboardRoute().go(context);
   ```

## Todo
- [ ] Update `session_card.dart`
- [ ] Update `session_detail_page.dart`
- [ ] Update `dashboard_page.dart` (2 calls)
- [ ] Update `guest_booking_page.dart`
- [ ] Update `auth_page.dart`
- [ ] Run `flutter analyze` — zero errors

## Success Criteria
- No `context.push('/...')` or `context.go('/...')` string literals remain in features/
- `flutter analyze` — zero errors on updated files

## Risk
- Import path of routes.dart must be correct relative package path
- `$extra` syntax in Dart — ensure IDE doesn't mangle it (valid Dart identifier with `$`)
