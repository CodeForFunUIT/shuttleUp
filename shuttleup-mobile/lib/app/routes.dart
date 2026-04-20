import 'package:go_router/go_router.dart';
import '../features/session/presentation/pages/session_list_page.dart';
import '../features/session/presentation/pages/session_detail_page.dart';
import '../features/booking/presentation/pages/guest_booking_page.dart';
import '../features/session/data/models/session_model.dart';
import '../features/auth/presentation/pages/auth_page.dart';
import '../features/dashboard/presentation/pages/dashboard_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SessionListPage(),
    ),
    GoRoute(
      path: '/sessions/:id',
      builder: (context, state) {
        final session = state.extra as SessionModel;
        return SessionDetailPage(session: session);
      },
    ),
    GoRoute(
      path: '/sessions/:id/book',
      builder: (context, state) {
        final session = state.extra as SessionModel;
        return GuestBookingPage(session: session);
      },
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const AuthPage(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardPage(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfilePage(),
    ),
  ],
);
