// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'routes.dart';

// **************************************************************************
// GoRouterGenerator
// **************************************************************************

List<RouteBase> get $appRoutes => [
  $sessionListRoute,
  $loginRoute,
  $dashboardRoute,
  $profileRoute,
];

RouteBase get $sessionListRoute => GoRouteData.$route(
  path: '/',
  factory: $SessionListRoute._fromState,
  routes: [
    GoRouteData.$route(
      path: 'sessions/:id',
      factory: $SessionDetailRoute._fromState,
      routes: [
        GoRouteData.$route(
          path: 'book',
          factory: $GuestBookingRoute._fromState,
        ),
      ],
    ),
  ],
);

mixin $SessionListRoute on GoRouteData {
  static SessionListRoute _fromState(GoRouterState state) =>
      const SessionListRoute();

  @override
  String get location => GoRouteData.$location('/');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

mixin $SessionDetailRoute on GoRouteData {
  static SessionDetailRoute _fromState(GoRouterState state) =>
      SessionDetailRoute(
        id: state.pathParameters['id']!,
        $extra: state.extra as SessionModel,
      );

  SessionDetailRoute get _self => this as SessionDetailRoute;

  @override
  String get location =>
      GoRouteData.$location('/sessions/${Uri.encodeComponent(_self.id)}');

  @override
  void go(BuildContext context) => context.go(location, extra: _self.$extra);

  @override
  Future<T?> push<T>(BuildContext context) =>
      context.push<T>(location, extra: _self.$extra);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location, extra: _self.$extra);

  @override
  void replace(BuildContext context) =>
      context.replace(location, extra: _self.$extra);
}

mixin $GuestBookingRoute on GoRouteData {
  static GuestBookingRoute _fromState(GoRouterState state) => GuestBookingRoute(
    id: state.pathParameters['id']!,
    $extra: state.extra as SessionModel,
  );

  GuestBookingRoute get _self => this as GuestBookingRoute;

  @override
  String get location =>
      GoRouteData.$location('/sessions/${Uri.encodeComponent(_self.id)}/book');

  @override
  void go(BuildContext context) => context.go(location, extra: _self.$extra);

  @override
  Future<T?> push<T>(BuildContext context) =>
      context.push<T>(location, extra: _self.$extra);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location, extra: _self.$extra);

  @override
  void replace(BuildContext context) =>
      context.replace(location, extra: _self.$extra);
}

RouteBase get $loginRoute =>
    GoRouteData.$route(path: '/login', factory: $LoginRoute._fromState);

mixin $LoginRoute on GoRouteData {
  static LoginRoute _fromState(GoRouterState state) => const LoginRoute();

  @override
  String get location => GoRouteData.$location('/login');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $dashboardRoute =>
    GoRouteData.$route(path: '/dashboard', factory: $DashboardRoute._fromState);

mixin $DashboardRoute on GoRouteData {
  static DashboardRoute _fromState(GoRouterState state) =>
      const DashboardRoute();

  @override
  String get location => GoRouteData.$location('/dashboard');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}

RouteBase get $profileRoute =>
    GoRouteData.$route(path: '/profile', factory: $ProfileRoute._fromState);

mixin $ProfileRoute on GoRouteData {
  static ProfileRoute _fromState(GoRouterState state) => const ProfileRoute();

  @override
  String get location => GoRouteData.$location('/profile');

  @override
  void go(BuildContext context) => context.go(location);

  @override
  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  @override
  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  @override
  void replace(BuildContext context) => context.replace(location);
}
