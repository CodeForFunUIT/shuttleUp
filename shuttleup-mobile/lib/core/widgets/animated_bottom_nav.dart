import 'package:flutter/material.dart';
import 'dart:ui';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Animated bottom navigation with BELo styling.
///
/// Features:
/// - Frosted glass background
/// - Animated sliding dot indicator
/// - Icon scale animation on selection
/// - Shuttle Gold active color
class AnimatedBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;
  final List<AnimatedBottomNavItem> items;

  const AnimatedBottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          height: 64 + MediaQuery.of(context).padding.bottom,
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).padding.bottom,
          ),
          decoration: BoxDecoration(
            color: isDark
                ? AppColors.darkSurface.withValues(alpha: 0.9)
                : Colors.white.withValues(alpha: 0.9),
            border: Border(
              top: BorderSide(
                color: Theme.of(context).colorScheme.outline,
              ),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(items.length, (index) {
              final isActive = index == currentIndex;
              return _NavItem(
                item: items[index],
                isActive: isActive,
                onTap: () => onTap(index),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class AnimatedBottomNavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const AnimatedBottomNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}

class _NavItem extends StatelessWidget {
  final AnimatedBottomNavItem item;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.item,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 64,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // ── Animated icon ──
            AnimatedScale(
              scale: isActive ? 1.15 : 1.0,
              duration: AppSpacing.durationFast,
              curve: Curves.easeOutCubic,
              child: Icon(
                isActive ? item.activeIcon : item.icon,
                color: isActive
                    ? AppColors.shuttleGold
                    : Theme.of(context).colorScheme.onSurfaceVariant,
                size: 24,
              ),
            ),
            const SizedBox(height: 2),

            // ── Label ──
            AnimatedDefaultTextStyle(
              duration: AppSpacing.durationFast,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: isActive
                    ? AppColors.shuttleGold
                    : Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              child: Text(item.label),
            ),
            const SizedBox(height: 2),

            // ── Active dot indicator ──
            AnimatedContainer(
              duration: AppSpacing.durationFast,
              curve: Curves.easeOutCubic,
              width: isActive ? 16 : 0,
              height: 3,
              decoration: BoxDecoration(
                color: AppColors.shuttleGold,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
