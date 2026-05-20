import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../app/di/injection.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_filter.dart';
import '../bloc/session_bloc.dart';
import '../bloc/session_event.dart';
import '../bloc/session_state.dart';
import '../widgets/session_card.dart';
import '../widgets/session_card_skeleton.dart';
import '../widgets/session_filter_chips.dart';
import '../widgets/session_filter_sheet.dart';
import 'package:go_router/go_router.dart';

/// Session list page with shimmer loading and staggered card entry.
class SessionListPage extends StatelessWidget {
  const SessionListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          getIt<SessionBloc>()..add(const SessionEvent.loadSessions()),
      child: Builder(
        builder: (context) => Scaffold(
          appBar: AppBar(
            title: Text(
              'FIND A SESSION',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.tune_rounded),
                onPressed: () => _openFilterSheet(context),
                tooltip: 'Filter sessions',
              ),
              Builder(
                builder: (ctx) => IconButton(
                  icon: const Icon(Icons.person_outline_rounded),
                  onPressed: () => ctx.push('/login'),
                  tooltip: 'Login',
                ),
              ),
            ],
          ),
          body: Column(
            children: [
              // ── Filter chips row ──
              BlocBuilder<SessionBloc, SessionState>(
                builder: (context, state) {
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
                    onFilterTap: () => _openFilterSheet(context),
                  );
                },
              ),
              const SizedBox(height: AppSpacing.xs),
              // ── Session list ──
              Expanded(
                child: BlocBuilder<SessionBloc, SessionState>(
                  builder: (context, state) {
                    return state.map(
                      initial: (_) => _buildSkeletonList(),
                      loading: (_) => _buildSkeletonList(),
                      loaded: (loaded) {
                        if (loaded.sessions.isEmpty) {
                          return _buildEmpty(context);
                        }
                        return RefreshIndicator(
                          color: Theme.of(context).colorScheme.primary,
                          onRefresh: () async {
                            context
                                .read<SessionBloc>()
                                .add(const SessionEvent.loadSessions());
                          },
                          child: ListView.builder(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            itemCount: loaded.sessions.length,
                            itemBuilder: (context, index) {
                              return _StaggeredItem(
                                index: index,
                                child: SessionCard(
                                  session: loaded.sessions[index],
                                ),
                              );
                            },
                          ),
                        );
                      },
                      error: (e) => Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.error_outline_rounded,
                              size: 48,
                              color: Theme.of(context).colorScheme.error,
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              'Something went wrong',
                              style: Theme.of(context).textTheme.titleMedium,
                            ),
                            const SizedBox(height: AppSpacing.sm),
                            Text(
                              e.message,
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
          // ── Map toggle FAB ──
          floatingActionButton: FloatingActionButton(
            heroTag: 'map_toggle_fab',
            onPressed: () => context.push('/map'),
            backgroundColor: AppColors.shuttleGold,
            foregroundColor: Colors.white,
            child: const Icon(Icons.map_rounded),
          ),
        ),
      ),
    );
  }

  void _openFilterSheet(BuildContext context) async {
    final bloc = context.read<SessionBloc>();
    final currentFilter = bloc.state.maybeMap(
      loaded: (s) => s.filter,
      orElse: () => const SessionFilter(),
    );
    final result = await SessionFilterSheet.show(context, currentFilter);
    if (result != null) {
      bloc.add(SessionEvent.updateFilter(result));
    }
  }

  Widget _buildEmpty(BuildContext context) {
    return Center(
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
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }

  /// Shimmer skeleton list shown during loading
  Widget _buildSkeletonList() {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: 5,
      itemBuilder: (context, index) => const SessionCardSkeleton(),
    );
  }
}

/// Staggered fade-in animation for list items.
///
/// Each item delays by [index * 80ms] then fades + slides up.
class _StaggeredItem extends StatefulWidget {
  final int index;
  final Widget child;

  const _StaggeredItem({required this.index, required this.child});

  @override
  State<_StaggeredItem> createState() => _StaggeredItemState();
}

class _StaggeredItemState extends State<_StaggeredItem>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    // Stagger delay per index (max ~400ms delay for 5th item)
    final delay = Duration(milliseconds: widget.index * 80);
    Future.delayed(delay, () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slide,
      child: FadeTransition(
        opacity: _opacity,
        child: widget.child,
      ),
    );
  }
}
