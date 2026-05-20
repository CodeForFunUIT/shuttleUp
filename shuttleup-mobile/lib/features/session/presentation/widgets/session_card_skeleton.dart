import 'package:flutter/material.dart';
import '../../../../core/widgets/shimmer_widget.dart';
import '../../../../core/theme/app_spacing.dart';

/// Skeleton placeholder matching the redesigned session card layout.
///
/// Shows shimmer blocks for: title + badge, time, location,
/// skill chip + price. Matches the real card's proportions.
class SessionCardSkeleton extends StatelessWidget {
  const SessionCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color,
        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline,
        ),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title row: title + badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ShimmerWidget(width: 180, height: 20),
              ShimmerWidget(width: 50, height: 24, borderRadius: 12),
            ],
          ),
          SizedBox(height: AppSpacing.md12),

          // Time row
          Row(
            children: [
              ShimmerWidget(width: 16, height: 16, borderRadius: 4),
              SizedBox(width: AppSpacing.xs),
              ShimmerWidget(width: 140, height: 14),
            ],
          ),
          SizedBox(height: AppSpacing.sm),

          // Location row
          Row(
            children: [
              ShimmerWidget(width: 16, height: 16, borderRadius: 4),
              SizedBox(width: AppSpacing.xs),
              ShimmerWidget(width: 120, height: 14),
            ],
          ),
          SizedBox(height: AppSpacing.md),

          // Divider placeholder
          ShimmerWidget(width: double.infinity, height: 1),
          SizedBox(height: AppSpacing.md),

          // Bottom row: skill badge + price
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ShimmerWidget(width: 90, height: 28, borderRadius: 4),
              ShimmerWidget(width: 80, height: 16),
            ],
          ),
        ],
      ),
    );
  }
}
