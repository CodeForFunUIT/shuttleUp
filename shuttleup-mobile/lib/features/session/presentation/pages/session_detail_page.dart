import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_model.dart';
import 'package:intl/intl.dart';

/// Session detail page with BELo design — hero gradient area,
/// branded info cards, animated slot counter, gold CTA button.
class SessionDetailPage extends StatelessWidget {
  final SessionModel session;

  const SessionDetailPage({super.key, required this.session});

  @override
  Widget build(BuildContext context) {
    final bool isFull = session.bookedPlayers >= session.maxPlayers;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final slotProgress =
        session.maxPlayers > 0 ? session.bookedPlayers / session.maxPlayers : 0.0;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Gradient hero app bar ──
          SliverAppBar(
            expandedHeight: 160,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: isDark
                        ? [AppColors.darkSurface, AppColors.darkBackground]
                        : [
                            AppColors.shuttleGold.withValues(alpha: 0.15),
                            AppColors.energyOrange.withValues(alpha: 0.08),
                            Colors.white,
                          ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.lg,
                      AppSpacing.xxl,
                      AppSpacing.lg,
                      AppSpacing.md,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          session.title,
                          style: theme.textTheme.displaySmall,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            title: Text(
              'Session Details',
              style: theme.textTheme.headlineSmall,
            ),
          ),

          // ── Content ──
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.md),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // ── Info card ──
                Container(
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                    border: Border.all(color: theme.colorScheme.outline),
                  ),
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    children: [
                      _buildInfoRow(
                        context,
                        Icons.access_time_rounded,
                        'Time',
                        '${DateFormat('E, MMM d').format(session.startTime)} • ${DateFormat('HH:mm').format(session.startTime)} - ${DateFormat('HH:mm').format(session.endTime)}',
                      ),
                      Divider(
                        height: AppSpacing.lg,
                        color: theme.colorScheme.outline,
                      ),
                      _buildInfoRow(
                        context,
                        Icons.location_on_outlined,
                        'Court',
                        session.courtName,
                      ),
                      Divider(
                        height: AppSpacing.lg,
                        color: theme.colorScheme.outline,
                      ),
                      _buildInfoRow(
                        context,
                        Icons.attach_money_rounded,
                        'Price',
                        '${NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(session.price)} / slot',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // ── Slot progress ──
                Container(
                  decoration: BoxDecoration(
                    color: theme.cardTheme.color,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                    border: Border.all(color: theme.colorScheme.outline),
                  ),
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Players', style: theme.textTheme.titleSmall),
                          Text(
                            '${session.bookedPlayers}/${session.maxPlayers}',
                            style: theme.textTheme.titleSmall?.copyWith(
                              color: isFull
                                  ? AppColors.rallyRed
                                  : AppColors.netGreen,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: slotProgress,
                          minHeight: 6,
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
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                // ── Requirements ──
                Text('Requirements', style: theme.textTheme.headlineSmall),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    _buildSkillBadge(context, session.requiredSkill),
                    const SizedBox(width: AppSpacing.sm),
                    _buildBadge(
                      context,
                      '${session.bookedPlayers}/${session.maxPlayers} Players',
                      isFull ? AppColors.rallyRed : AppColors.netGreen,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.xl),

                // ── About Host ──
                Text('About Host', style: theme.textTheme.headlineSmall),
                const SizedBox(height: AppSpacing.sm),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: AppColors.brandGradient,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                    ),
                    child: Center(
                      child: Text(
                        'MT',
                        style: theme.textTheme.labelLarge?.copyWith(
                          color: const Color(0xFF0D0F12),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  title: Text(
                    'Minh Tran',
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  subtitle: Text(
                    'ELO: 1450 • Advanced',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ]),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: ElevatedButton(
            onPressed: isFull
                ? null
                : () {
                    context.push(
                      '/sessions/${session.id}/book',
                      extra: session,
                    );
                  },
            child: Text(isFull ? 'Session Full' : 'Book a Slot'),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    final theme = Theme.of(context);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          icon,
          color: theme.colorScheme.onSurfaceVariant,
          size: 20,
        ),
        const SizedBox(width: AppSpacing.md12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSkillBadge(BuildContext context, String skill) {
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
        horizontal: AppSpacing.md12,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        border: Border.all(color: fg.withValues(alpha: 0.3)),
      ),
      child: Text(
        'Skill: $skill',
        style: TextStyle(
          color: fg,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildBadge(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md12,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}
