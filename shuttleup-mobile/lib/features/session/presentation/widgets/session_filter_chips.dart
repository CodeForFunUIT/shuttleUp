import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_filter.dart';

/// Horizontal scrollable chip row showing active filters.
///
/// Each chip shows the filter value + X to remove.
/// BELo gold active, muted inactive.
/// Leading filter icon chip opens the full filter sheet.
class SessionFilterChips extends StatelessWidget {
  final SessionFilter filter;
  final ValueChanged<SessionFilter> onFilterChanged;
  final VoidCallback? onFilterTap;

  const SessionFilterChips({
    super.key,
    required this.filter,
    required this.onFilterChanged,
    this.onFilterTap,
  });

  @override
  Widget build(BuildContext context) {
    final chips = <Widget>[];

    // ── Leading filter button ──
    chips.add(
      ActionChip(
        avatar: Icon(
          Icons.tune_rounded,
          size: 16,
          color: filter.hasActiveFilters
              ? AppColors.shuttleGold
              : null,
        ),
        label: Text(
          filter.hasActiveFilters
              ? 'Filters (${filter.activeFilterCount})'
              : 'Filters',
        ),
        onPressed: onFilterTap,
        backgroundColor: filter.hasActiveFilters
            ? AppColors.shuttleGold.withValues(alpha: 0.12)
            : null,
        side: filter.hasActiveFilters
            ? const BorderSide(color: AppColors.shuttleGold, width: 1.5)
            : null,
        labelStyle: TextStyle(
          fontWeight: filter.hasActiveFilters
              ? FontWeight.w600
              : FontWeight.w500,
          color: filter.hasActiveFilters ? AppColors.shuttleGold : null,
        ),
      ),
    );

    // ── Active filter chips ──
    if (filter.query.isNotEmpty) {
      chips.add(_buildChip(
        context,
        label: '"${filter.query}"',
        icon: Icons.search_rounded,
        onDelete: () => onFilterChanged(filter.copyWith(query: '')),
      ));
    }

    if (filter.district.isNotEmpty) {
      chips.add(_buildChip(
        context,
        label: filter.district,
        icon: Icons.location_city_rounded,
        onDelete: () => onFilterChanged(filter.copyWith(district: '')),
      ));
    }

    if (filter.skill.isNotEmpty) {
      chips.add(_buildChip(
        context,
        label: filter.skill,
        icon: Icons.star_rounded,
        onDelete: () => onFilterChanged(filter.copyWith(skill: '')),
      ));
    }

    if (filter.minPrice != null || filter.maxPrice != null) {
      final label = filter.minPrice != null && filter.maxPrice != null
          ? '₫${_formatK(filter.minPrice!)}–${_formatK(filter.maxPrice!)}'
          : filter.minPrice != null
              ? '≥ ₫${_formatK(filter.minPrice!)}'
              : '≤ ₫${_formatK(filter.maxPrice!)}';
      chips.add(_buildChip(
        context,
        label: label,
        icon: Icons.payments_rounded,
        onDelete: () => onFilterChanged(
          filter.copyWith(minPrice: null, maxPrice: null),
        ),
      ));
    }

    if (filter.dateFrom != null || filter.dateTo != null) {
      chips.add(_buildChip(
        context,
        label: 'Date filter',
        icon: Icons.calendar_today_rounded,
        onDelete: () => onFilterChanged(
          filter.copyWith(dateFrom: null, dateTo: null),
        ),
      ));
    }

    if (filter.nearLat != null) {
      chips.add(_buildChip(
        context,
        label: '${filter.radiusKm.toStringAsFixed(0)}km',
        icon: Icons.near_me_rounded,
        onDelete: () => onFilterChanged(
          filter.copyWith(nearLat: null, nearLng: null),
        ),
      ));
    }

    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
        itemCount: chips.length,
        separatorBuilder: (context, index) => const SizedBox(width: AppSpacing.xs),
        itemBuilder: (_, i) => chips[i],
      ),
    );
  }

  Widget _buildChip(
    BuildContext context, {
    required String label,
    required IconData icon,
    required VoidCallback onDelete,
  }) {
    return Chip(
      avatar: Icon(icon, size: 14, color: AppColors.shuttleGold),
      label: Text(
        label,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
      ),
      deleteIcon: const Icon(Icons.close, size: 14),
      onDeleted: onDelete,
      backgroundColor: AppColors.shuttleGold.withValues(alpha: 0.08),
      side: BorderSide(
        color: AppColors.shuttleGold.withValues(alpha: 0.3),
      ),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }

  String _formatK(double value) {
    if (value >= 1000) return '${(value / 1000).toStringAsFixed(0)}k';
    return value.toStringAsFixed(0);
  }
}
