import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:latlong2/latlong.dart';
import '../../../../app/di/injection.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/shimmer_widget.dart';
import '../../data/models/session_filter.dart';
import '../bloc/session_bloc.dart';
import '../bloc/session_event.dart';
import '../bloc/session_state.dart';
import '../widgets/session_card.dart';
import '../widgets/session_filter_chips.dart';
import '../widgets/session_filter_sheet.dart';
import '../widgets/session_map_view.dart';

/// Split-view page: map on top (~40%), session cards below (~60%).
///
/// Google Maps style — draggable bottom sheet over the map.
/// Filter chips row between map and cards.
class SessionMapPage extends StatelessWidget {
  const SessionMapPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) =>
          getIt<SessionBloc>()..add(const SessionEvent.loadSessions()),
      child: const _SessionMapContent(),
    );
  }
}

class _SessionMapContent extends StatefulWidget {
  const _SessionMapContent();

  @override
  State<_SessionMapContent> createState() => _SessionMapContentState();
}

class _SessionMapContentState extends State<_SessionMapContent> {
  final _scrollController = ScrollController();
  final _sheetController = DraggableScrollableController();
  @override
  void dispose() {
    _scrollController.dispose();
    _sheetController.dispose();
    super.dispose();
  }

  void _openFilterSheet(SessionFilter currentFilter) async {
    final result = await SessionFilterSheet.show(context, currentFilter);
    if (result != null && mounted) {
      context.read<SessionBloc>().add(SessionEvent.updateFilter(result));
    }
  }

  void _handleNearMe() {
    context.read<SessionBloc>().add(const SessionEvent.locateUser());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Find Sessions',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Theme.of(context)
                  .colorScheme
                  .surface
                  .withValues(alpha: 0.85),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back_rounded, size: 20),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: BlocBuilder<SessionBloc, SessionState>(
        builder: (context, state) {
          return Stack(
            children: [
              // ── Map (full screen behind sheet) ──
              _buildMap(state),

              // ── Draggable bottom sheet ──
              DraggableScrollableSheet(
                controller: _sheetController,
                initialChildSize: 0.45,
                minChildSize: 0.15,
                maxChildSize: 0.85,
                snap: true,
                snapSizes: const [0.15, 0.45, 0.85],
                builder: (context, scrollController) {
                  return Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(24),
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 20,
                          offset: const Offset(0, -4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // ── Drag handle ──
                        _buildDragHandle(),

                        // ── Filter chips ──
                        _buildFilterChips(state),

                        const SizedBox(height: AppSpacing.xs),

                        // ── Session list ──
                        Expanded(
                          child: _buildSessionList(state, scrollController),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildMap(SessionState state) {
    final sessions = state.maybeMap(
      loaded: (s) => s.sessions,
      orElse: () => <dynamic>[],
    );

    final userLoc = state.maybeMap(
      loaded: (s) => s.userLocation != null
          ? LatLng(s.userLocation!.latitude, s.userLocation!.longitude)
          : null,
      orElse: () => null,
    );

    return SessionMapView(
      sessions: sessions.cast(),
      userLocation: userLoc,
      onMarkerTap: (session) {
        // Expand the sheet and scroll to the tapped session
        _sheetController.animateTo(
          0.45,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      },
      onNearMeTap: _handleNearMe,
    );
  }

  Widget _buildDragHandle() {
    return Padding(
      padding: const EdgeInsets.only(top: 12, bottom: 4),
      child: Center(
        child: Container(
          width: 40,
          height: 4,
          decoration: BoxDecoration(
            color: Theme.of(context)
                .colorScheme
                .outline
                .withValues(alpha: 0.3),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChips(SessionState state) {
    final filter = state.maybeMap(
      loaded: (s) => s.filter,
      loading: (s) => s.filter ?? const SessionFilter(),
      error: (s) => s.filter ?? const SessionFilter(),
      orElse: () => const SessionFilter(),
    );

    return SessionFilterChips(
      filter: filter,
      onFilterChanged: (newFilter) {
        context
            .read<SessionBloc>()
            .add(SessionEvent.updateFilter(newFilter));
      },
      onFilterTap: () => _openFilterSheet(filter),
    );
  }

  Widget _buildSessionList(
    SessionState state,
    ScrollController scrollController,
  ) {
    return state.map(
      initial: (_) => const SizedBox.shrink(),
      loading: (_) => _buildSkeletons(),
      error: (e) => _buildError(e.message),
      loaded: (loaded) {
        if (loaded.sessions.isEmpty) {
          return _buildEmpty();
        }
        return ListView.separated(
          controller: scrollController,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          itemCount: loaded.sessions.length,
          separatorBuilder: (context, index) =>
              const SizedBox(height: AppSpacing.sm),
          itemBuilder: (context, index) {
            final session = loaded.sessions[index];
            return SessionCard(session: session);
          },
        );
      },
    );
  }

  Widget _buildSkeletons() {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: 4,
      itemBuilder: (_, i) => Padding(
        padding: const EdgeInsets.only(bottom: AppSpacing.sm),
        child: ShimmerWidget(
          width: double.infinity,
          height: 120,
          borderRadius: AppSpacing.radiusMd,
        ),
      ),
    );
  }

  Widget _buildError(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.error_outline_rounded,
              size: 48,
              color: AppColors.rallyRed,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Something went wrong',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: AppSpacing.md),
            FilledButton(
              onPressed: () => context
                  .read<SessionBloc>()
                  .add(const SessionEvent.loadSessions()),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmpty() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.sports_tennis_rounded,
              size: 48,
              color: AppColors.shuttleGold.withValues(alpha: 0.5),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No sessions found',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'Try adjusting your filters',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.outline,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
