import 'package:go_router/go_router.dart';
import '../features/session/presentation/pages/session_list_page.dart';
import '../features/session/presentation/pages/session_detail_page.dart';
import '../features/session/presentation/pages/session_map_page.dart';
import '../features/booking/presentation/pages/guest_booking_page.dart';
import '../features/session/data/models/session_model.dart';
import '../features/auth/presentation/pages/auth_page.dart';
import '../features/dashboard/presentation/pages/dashboard_page.dart';
import '../features/profile/presentation/pages/profile_page.dart';
import '../features/splash/presentation/pages/splash_screen.dart';
import '../core/animations/animated_page_route.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    // ── Splash (entry point) ──
    GoRoute(
      path: '/',
      pageBuilder: (context, state) => beloFadeTransition(
        state: state,
        child: const SplashScreen(),
      ),
    ),

    // ── Home (session list) ──
    GoRoute(
      path: '/home',
      pageBuilder: (context, state) => beloFadeTransition(
        state: state,
        child: const SessionListPage(),
      ),
    ),

    // ── Map (split view) ──
    GoRoute(
      path: '/map',
      pageBuilder: (context, state) => beloPageTransition(
        context: context,
        state: state,
        child: const SessionMapPage(),
      ),
    ),

    // ── Session detail ──
    GoRoute(
      path: '/sessions/:id',
      pageBuilder: (context, state) {
        final session = state.extra as SessionModel;
        return beloPageTransition(
          context: context,
          state: state,
          child: SessionDetailPage(session: session),
        );
      },
    ),

    // ── Booking ──
    GoRoute(
      path: '/sessions/:id/book',
      pageBuilder: (context, state) {
        final session = state.extra as SessionModel;
        return beloPageTransition(
          context: context,
          state: state,
          child: GuestBookingPage(session: session),
        );
      },
    ),

    // ── Auth ──
    GoRoute(
      path: '/login',
      pageBuilder: (context, state) => beloPageTransition(
        context: context,
        state: state,
        child: const AuthPage(),
      ),
    ),

    // ── Dashboard ──
    GoRoute(
      path: '/dashboard',
      pageBuilder: (context, state) => beloPageTransition(
        context: context,
        state: state,
        child: const DashboardPage(),
      ),
    ),

    // ── Profile ──
    GoRoute(
      path: '/profile',
      pageBuilder: (context, state) => beloPageTransition(
        context: context,
        state: state,
        child: const ProfilePage(),
      ),
    ),
  ],
);
