import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:shuttleup_mobile/features/auth/auth.dart';
import 'package:shuttleup_mobile/features/booking/booking.dart';
import 'package:shuttleup_mobile/features/dashboard/dashboard.dart';
import 'package:shuttleup_mobile/features/profile/profile.dart';
import 'package:shuttleup_mobile/features/session/session.dart';

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
class SessionListRoute extends GoRouteData with $SessionListRoute {
  const SessionListRoute();
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const SessionListPage();
}

class SessionDetailRoute extends GoRouteData with $SessionDetailRoute {
  final String id;
  // ignore: non_constant_identifier_names
  final SessionModel $extra;
  const SessionDetailRoute({required this.id, required this.$extra});
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      SessionDetailPage(session: $extra);
}

class GuestBookingRoute extends GoRouteData with $GuestBookingRoute {
  final String id;
  // ignore: non_constant_identifier_names
  final SessionModel $extra;
  const GuestBookingRoute({required this.id, required this.$extra});
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      GuestBookingPage(session: $extra);
}

@TypedGoRoute<LoginRoute>(path: '/login')
class LoginRoute extends GoRouteData with $LoginRoute {
  const LoginRoute();
  @override
  Widget build(BuildContext context, GoRouterState state) => const AuthPage();
}

@TypedGoRoute<DashboardRoute>(path: '/dashboard')
class DashboardRoute extends GoRouteData with $DashboardRoute {
  const DashboardRoute();
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const DashboardPage();
}

@TypedGoRoute<ProfileRoute>(path: '/profile')
class ProfileRoute extends GoRouteData with $ProfileRoute {
  const ProfileRoute();
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ProfilePage();
}

final GoRouter appRouter = GoRouter(
  initialLocation: const SessionListRoute().location,
  routes: $appRoutes,
);
