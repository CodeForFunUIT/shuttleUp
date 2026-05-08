# Phase 02 — Rewrite routes.dart with GoRouteData

## Context Links
- Current routes: `shuttleup-mobile/lib/app/routes.dart`
- Brainstormer: `plans/reports/brainstormer-260507-1122-go-router-builder-migration.md`

## Overview
- **Priority:** High
- **Status:** ⬜ todo
- **Scope:** Full rewrite of `routes.dart` using `GoRouteData` + `@TypedGoRoute`; run build_runner

## Route Inventory (6 routes)

| Route Class | Path | Extra? | Notes |
|-------------|------|--------|-------|
| `SessionListRoute` | `/` | — | Root/home |
| `SessionDetailRoute` | `/sessions/:id` | `SessionModel $extra` | Nested under list |
| `GuestBookingRoute` | `/sessions/:id/book` | `SessionModel $extra` | Nested under detail |
| `LoginRoute` | `/login` | — | Auth page |
| `DashboardRoute` | `/dashboard` | — | Host dashboard |
| `ProfileRoute` | `/profile` | — | User profile |

## Architecture

```
@TypedGoRoute<SessionListRoute>
  path: '/'
  routes:
    @TypedGoRoute<SessionDetailRoute>
      path: 'sessions/:id'
      routes:
        @TypedGoRoute<GuestBookingRoute>
          path: 'book'

@TypedGoRoute<LoginRoute>       path: '/login'
@TypedGoRoute<DashboardRoute>   path: '/dashboard'
@TypedGoRoute<ProfileRoute>     path: '/profile'
```

**Key Rule:** `$extra` field name is special — `go_router_builder` passes via `GoRouterState.extra`. Path param (`:id`) must match constructor field name exactly.

## Related Code Files
| File | Action |
|------|--------|
| `lib/app/routes.dart` | Full rewrite |
| `lib/app/routes.g.dart` | Auto-generated (do not edit) |

## Implementation Steps

1. **Rewrite `lib/app/routes.dart`** — replace entire content:

   ```dart
   import 'package:flutter/material.dart';
   import 'package:go_router/go_router.dart';
   
   import '../features/auth/presentation/pages/auth_page.dart';
   import '../features/booking/presentation/pages/guest_booking_page.dart';
   import '../features/dashboard/presentation/pages/dashboard_page.dart';
   import '../features/profile/presentation/pages/profile_page.dart';
   import '../features/session/data/models/session_model.dart';
   import '../features/session/presentation/pages/session_detail_page.dart';
   import '../features/session/presentation/pages/session_list_page.dart';
   
   part 'routes.g.dart';
   
   @TypedGoRoute<SessionListRoute>(
     path: '/',
     routes: [
       TypedGoRoute<SessionDetailRoute>(
         path: 'sessions/:id',
         routes: [
           TypedGoRoute<GuestBookingRoute>(path: 'book'),
         ],
       ),
     ],
   )
   class SessionListRoute extends GoRouteData {
     const SessionListRoute();
     @override
     Widget build(BuildContext context, GoRouterState state) =>
         const SessionListPage();
   }
   
   class SessionDetailRoute extends GoRouteData {
     final String id;
     final SessionModel $extra;
     const SessionDetailRoute({required this.id, required this.$extra});
     @override
     Widget build(BuildContext context, GoRouterState state) =>
         SessionDetailPage(session: $extra);
   }
   
   class GuestBookingRoute extends GoRouteData {
     final String id;
     final SessionModel $extra;
     const GuestBookingRoute({required this.id, required this.$extra});
     @override
     Widget build(BuildContext context, GoRouterState state) =>
         GuestBookingPage(session: $extra);
   }
   
   @TypedGoRoute<LoginRoute>(path: '/login')
   class LoginRoute extends GoRouteData {
     const LoginRoute();
     @override
     Widget build(BuildContext context, GoRouterState state) => const AuthPage();
   }
   
   @TypedGoRoute<DashboardRoute>(path: '/dashboard')
   class DashboardRoute extends GoRouteData {
     const DashboardRoute();
     @override
     Widget build(BuildContext context, GoRouterState state) =>
         const DashboardPage();
   }
   
   @TypedGoRoute<ProfileRoute>(path: '/profile')
   class ProfileRoute extends GoRouteData {
     const ProfileRoute();
     @override
     Widget build(BuildContext context, GoRouterState state) =>
         const ProfilePage();
   }
   
   final GoRouter appRouter = GoRouter(
     initialLocation: const SessionListRoute().location,
     routes: $appRoutes,
   );
   ```

2. **Run code generation**
   ```bash
   cd shuttleup-mobile
   dart run build_runner build --delete-conflicting-outputs
   ```

3. **Verify `routes.g.dart` was generated** — should contain `$appRoutes` list

## Todo
- [ ] Rewrite `routes.dart` with GoRouteData classes
- [ ] Run `dart run build_runner build --delete-conflicting-outputs`
- [ ] Confirm `routes.g.dart` is generated without errors
- [ ] Run `flutter analyze` — no errors on routes files

## Success Criteria
- `routes.g.dart` exists and compiles
- `$appRoutes` available in scope
- `flutter analyze lib/app/` — zero errors

## Risk
- `SessionDetailRoute` and `GuestBookingRoute` both have `id` + `$extra` — ensure constructor params match path segment names exactly
