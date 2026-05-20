import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_model.dart';
import 'package:intl/intl.dart';

/// Redesigned session card with BELo design system.
///
/// Features:
/// - Gradient accent top stripe
/// - Slot progress bar
/// - BELo-colored skill badges
/// - Tap scale animation
class SessionCard extends StatefulWidget {
  final SessionModel session;

  const SessionCard({super.key, required this.session});

  @override
  State<SessionCard> createState() => _SessionCardState();
}

class _SessionCardState extends State<SessionCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _scaleController;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      vsync: this,
      duration: AppSpacing.durationMicro,
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scale = Tween<double>(begin: 1.0, end: 0.98).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final session = widget.session;
    final bool isFull = session.bookedPlayers >= session.maxPlayers;
    final double slotProgress =
        session.maxPlayers > 0 ? session.bookedPlayers / session.maxPlayers : 0;
    final theme = Theme.of(context);

    return GestureDetector(
      onTapDown: (_) => _scaleController.forward(),
      onTapUp: (_) {
        _scaleController.reverse();
        context.push('/sessions/${session.id}', extra: session);
      },
      onTapCancel: () => _scaleController.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: Container(
          margin: const EdgeInsets.only(bottom: AppSpacing.md),
          decoration: BoxDecoration(
            color: theme.cardTheme.color,
            borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
            border: Border.all(color: theme.colorScheme.outline),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Gradient accent top stripe ──
              Container(
                height: 4,
                decoration: const BoxDecoration(
                  gradient: AppColors.brandGradient,
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ── Title + status badge ──
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            session.title,
                            style: theme.textTheme.titleLarge,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: AppSpacing.sm),
                        _buildStatusBadge(isFull, session),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md12),

                    // ── Time ──
                    _buildInfoRow(
                      context,
                      Icons.access_time_rounded,
                      '${DateFormat('E, MMM d').format(session.startTime)} • ${DateFormat('HH:mm').format(session.startTime)}',
                    ),
                    const SizedBox(height: AppSpacing.sm),

                    // ── Location ──
                    _buildInfoRow(
                      context,
                      Icons.location_on_outlined,
                      session.courtName,
                    ),
                    const SizedBox(height: AppSpacing.md),

                    // ── Slot progress bar ──
                    ClipRRect(
                      borderRadius: BorderRadius.circular(2),
                      child: LinearProgressIndicator(
                        value: slotProgress,
                        minHeight: 4,
                        backgroundColor: theme.colorScheme.outline,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          isFull
                              ? AppColors.rallyRed
                              : slotProgress > 0.7
                                  ? AppColors.energyOrange
                                  : AppColors.netGreen,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md12),

                    // ── Skill badge + price ──
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildSkillBadge(session.requiredSkill),
                        Text(
                          '${NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(session.price)}/slot',
                          style: theme.textTheme.titleSmall?.copyWith(
                            color: AppColors.shuttleGold,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, IconData icon, String text) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
        const SizedBox(width: AppSpacing.sm),
        Expanded(
          child: Text(
            text,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge(bool isFull, SessionModel session) {
    final Color bg;
    final Color fg;
    if (isFull) {
      bg = AppColors.skillProBg;
      fg = AppColors.skillProFg;
    } else {
      bg = AppColors.skillBeginnerBg;
      fg = AppColors.skillBeginnerFg;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        isFull ? 'FULL' : '${session.bookedPlayers}/${session.maxPlayers}',
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: fg,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _buildSkillBadge(String skill) {
    final skillLower = skill.toLowerCase();
    Color bg;
    Color fg;

    if (skillLower.contains('beginner')) {
      bg = AppColors.skillBeginnerBg;
      fg = AppColors.skillBeginnerFg;
    } else if (skillLower.contains('intermediate')) {
      bg = AppColors.skillIntermediateBg;
      fg = AppColors.skillIntermediateFg;
    } else if (skillLower.contains('advanced')) {
      bg = AppColors.skillAdvancedBg;
      fg = AppColors.skillAdvancedFg;
    } else if (skillLower.contains('pro')) {
      bg = AppColors.skillProBg;
      fg = AppColors.skillProFg;
    } else {
      bg = Theme.of(context).colorScheme.surfaceContainerHighest;
      fg = Theme.of(context).colorScheme.onSurface;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: Text(
        skill,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: fg,
        ),
      ),
    );
  }
}
