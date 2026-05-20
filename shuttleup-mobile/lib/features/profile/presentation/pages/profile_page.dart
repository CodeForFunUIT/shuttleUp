import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/elo_gauge.dart';
import '../../../../core/widgets/animated_counter.dart';

/// Profile page with BELo design — gradient header, animated ELO gauge,
/// animated stat counters.
class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Gradient header with avatar ──
          SliverAppBar(
            expandedHeight: 200,
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
                            AppColors.shuttleGold.withValues(alpha: 0.2),
                            AppColors.energyOrange.withValues(alpha: 0.1),
                          ],
                  ),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: AppSpacing.xl),
                      // ── Avatar ──
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          gradient: AppColors.brandGradient,
                          borderRadius: BorderRadius.circular(
                            AppSpacing.radiusXl,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            'MT',
                            style: theme.textTheme.headlineLarge?.copyWith(
                              color: const Color(0xFF0D0F12),
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md12),
                      Text(
                        'Minh Tran',
                        style: theme.textTheme.headlineMedium,
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'host@shuttleup.com',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            title: Text('Profile', style: theme.textTheme.headlineMedium),
          ),

          // ── Content ──
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // ── ELO Gauge ──
                Center(child: EloGauge(elo: 1450, size: 140)),
                const SizedBox(height: AppSpacing.lg),

                // ── Stat cards ──
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        label: 'Sessions',
                        value: 24,
                        icon: Icons.sports_tennis_rounded,
                        color: AppColors.shuttleGold,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md12),
                    Expanded(
                      child: _StatCard(
                        label: 'Win Rate',
                        value: 72,
                        suffix: '%',
                        icon: Icons.trending_up_rounded,
                        color: AppColors.netGreen,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md12),
                Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        label: 'Tier',
                        customValue: Text(
                          'Advanced',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: AppColors.energyOrange,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        icon: Icons.star_rounded,
                        color: AppColors.energyOrange,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md12),
                    Expanded(
                      child: _StatCard(
                        label: 'Rating',
                        customValue: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '4.8',
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: AppColors.shuttleGold,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.star_rounded,
                              size: 16,
                              color: AppColors.shuttleGold,
                            ),
                          ],
                        ),
                        icon: Icons.thumb_up_alt_rounded,
                        color: AppColors.shuttleGold,
                      ),
                    ),
                  ],
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final int? value;
  final String? suffix;
  final Widget? customValue;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    this.value,
    this.suffix,
    this.customValue,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
        border: Border.all(color: theme.colorScheme.outline),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: AppSpacing.sm),
          if (customValue != null)
            customValue!
          else
            AnimatedCounter(
              value: value ?? 0,
              suffix: suffix,
              style: theme.textTheme.titleMedium?.copyWith(
                color: color,
                fontWeight: FontWeight.w700,
              ),
            ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            label,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}
