import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_filter.dart';

/// HCMC districts list (matches web).
const _districts = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
  'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
  'Quận 11', 'Quận 12', 'Quận Bình Tân', 'Quận Bình Thạnh',
  'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình',
  'Quận Tân Phú', 'Quận Thủ Đức', 'Huyện Bình Chánh',
  'Huyện Cần Giờ', 'Huyện Củ Chi', 'Huyện Hóc Môn',
  'Huyện Nhà Bè', 'Thành phố Thủ Đức',
];

/// Skill options.
const _skillOptions = [
  ('ALL', 'All Levels'),
  ('BEGINNER', 'Beginner'),
  ('INTERMEDIATE', 'Intermediate'),
  ('ADVANCED', 'Advanced'),
  ('PRO', 'Pro'),
];

/// Full filter form in a modal bottom sheet.
///
/// Search, district, skill, price range, date, near me + radius.
class SessionFilterSheet extends StatefulWidget {
  final SessionFilter currentFilter;
  final ValueChanged<SessionFilter> onApply;

  const SessionFilterSheet({
    super.key,
    required this.currentFilter,
    required this.onApply,
  });

  /// Show as modal bottom sheet.
  static Future<SessionFilter?> show(
    BuildContext context,
    SessionFilter currentFilter,
  ) {
    return showModalBottomSheet<SessionFilter>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Theme.of(context).colorScheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SessionFilterSheet(
        currentFilter: currentFilter,
        onApply: (filter) => Navigator.of(ctx).pop(filter),
      ),
    );
  }

  @override
  State<SessionFilterSheet> createState() => _SessionFilterSheetState();
}

class _SessionFilterSheetState extends State<SessionFilterSheet> {
  late TextEditingController _searchController;
  late String _district;
  late String _skill;
  late RangeValues _priceRange;
  late DateTime? _dateFrom;
  late DateTime? _dateTo;
  late double _radiusKm;
  late bool _nearMeEnabled;

  @override
  void initState() {
    super.initState();
    final f = widget.currentFilter;
    _searchController = TextEditingController(text: f.query);
    _district = f.district;
    _skill = f.skill;
    _priceRange = RangeValues(
      f.minPrice ?? 0,
      f.maxPrice ?? 200000,
    );
    _dateFrom = f.dateFrom;
    _dateTo = f.dateTo;
    _radiusKm = f.radiusKm;
    _nearMeEnabled = f.nearLat != null;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _handleApply() {
    widget.onApply(SessionFilter(
      query: _searchController.text.trim(),
      district: _district,
      skill: _skill == 'ALL' ? '' : _skill,
      minPrice: _priceRange.start > 0 ? _priceRange.start : null,
      maxPrice: _priceRange.end < 200000 ? _priceRange.end : null,
      dateFrom: _dateFrom,
      dateTo: _dateTo,
      nearLat: _nearMeEnabled
          ? widget.currentFilter.nearLat
          : null,
      nearLng: _nearMeEnabled
          ? widget.currentFilter.nearLng
          : null,
      radiusKm: _radiusKm,
    ));
  }

  void _handleClear() {
    setState(() {
      _searchController.clear();
      _district = '';
      _skill = '';
      _priceRange = const RangeValues(0, 200000);
      _dateFrom = null;
      _dateTo = null;
      _nearMeEnabled = false;
      _radiusKm = 5.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return Column(
          children: [
            // ── Handle + header ──
            _buildHeader(theme),
            // ── Scrollable filters ──
            Expanded(
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.all(AppSpacing.lg),
                children: [
                  _buildSearchField(theme),
                  const SizedBox(height: AppSpacing.lg),
                  _buildDistrictDropdown(theme),
                  const SizedBox(height: AppSpacing.lg),
                  _buildSkillChips(theme),
                  const SizedBox(height: AppSpacing.lg),
                  _buildPriceRange(theme),
                  const SizedBox(height: AppSpacing.lg),
                  _buildDatePicker(theme),
                  const SizedBox(height: AppSpacing.lg),
                  _buildNearMe(theme),
                  const SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
            // ── Action buttons ──
            _buildActions(theme),
          ],
        );
      },
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Column(
      children: [
        const SizedBox(height: AppSpacing.sm),
        Center(
          child: Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: theme.colorScheme.outline.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          child: Row(
            children: [
              Icon(Icons.tune_rounded, color: AppColors.shuttleGold),
              const SizedBox(width: AppSpacing.sm),
              Text(
                'Filter Sessions',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: _handleClear,
                child: const Text('Clear All'),
              ),
            ],
          ),
        ),
        const Divider(height: 1),
      ],
    );
  }

  Widget _buildSearchField(ThemeData theme) {
    return TextField(
      controller: _searchController,
      decoration: InputDecoration(
        hintText: 'Search sessions or courts...',
        prefixIcon: const Icon(Icons.search_rounded),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        ),
        filled: true,
        fillColor: theme.colorScheme.surfaceContainerLow,
      ),
    );
  }

  Widget _buildDistrictDropdown(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'District',
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        DropdownButtonFormField<String>(
          initialValue: _district.isEmpty ? null : _district,
          decoration: InputDecoration(
            hintText: 'All Districts',
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            ),
            filled: true,
            fillColor: theme.colorScheme.surfaceContainerLow,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm,
            ),
          ),
          items: [
            const DropdownMenuItem(
              value: '',
              child: Text('All Districts'),
            ),
            ..._districts.map((d) => DropdownMenuItem(
                  value: d,
                  child: Text(d, overflow: TextOverflow.ellipsis),
                )),
          ],
          onChanged: (value) => setState(() => _district = value ?? ''),
        ),
      ],
    );
  }

  Widget _buildSkillChips(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Skill Level',
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Wrap(
          spacing: AppSpacing.xs,
          runSpacing: AppSpacing.xs,
          children: _skillOptions.map((option) {
            final (value, label) = option;
            final isSelected = _skill == value ||
                (_skill.isEmpty && value == 'ALL');

            return ChoiceChip(
              label: Text(label),
              selected: isSelected,
              onSelected: (selected) {
                setState(() => _skill = selected ? value : '');
              },
              selectedColor: AppColors.shuttleGold.withValues(alpha: 0.2),
              labelStyle: TextStyle(
                color: isSelected ? AppColors.shuttleGold : null,
                fontWeight: isSelected ? FontWeight.w600 : null,
              ),
              side: isSelected
                  ? const BorderSide(color: AppColors.shuttleGold)
                  : null,
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildPriceRange(ThemeData theme) {
    final formatter = NumberFormat.currency(
      locale: 'vi_VN',
      symbol: '₫',
      decimalDigits: 0,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Price Range',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            Text(
              '${formatter.format(_priceRange.start)} – ${formatter.format(_priceRange.end)}',
              style: theme.textTheme.bodySmall?.copyWith(
                color: AppColors.shuttleGold,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),
        RangeSlider(
          values: _priceRange,
          min: 0,
          max: 200000,
          divisions: 20,
          activeColor: AppColors.shuttleGold,
          labels: RangeLabels(
            formatter.format(_priceRange.start),
            formatter.format(_priceRange.end),
          ),
          onChanged: (values) => setState(() => _priceRange = values),
        ),
      ],
    );
  }

  Widget _buildDatePicker(ThemeData theme) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Date Range',
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppSpacing.xs),
        Row(
          children: [
            Expanded(
              child: _DateButton(
                label: _dateFrom != null
                    ? dateFormat.format(_dateFrom!)
                    : 'From',
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _dateFrom ?? DateTime.now(),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 90)),
                  );
                  if (picked != null) setState(() => _dateFrom = picked);
                },
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: AppSpacing.xs),
              child: Text('–'),
            ),
            Expanded(
              child: _DateButton(
                label: _dateTo != null
                    ? dateFormat.format(_dateTo!)
                    : 'To',
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _dateTo ?? DateTime.now().add(const Duration(days: 7)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 90)),
                  );
                  if (picked != null) setState(() => _dateTo = picked);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildNearMe(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Near Me',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            Switch.adaptive(
              value: _nearMeEnabled,
              activeTrackColor: AppColors.shuttleGold,
              onChanged: (value) => setState(() => _nearMeEnabled = value),
            ),
          ],
        ),
        if (_nearMeEnabled) ...[
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              const Icon(Icons.radar_rounded, size: 16),
              const SizedBox(width: AppSpacing.xs),
              Text(
                'Radius: ${_radiusKm.toStringAsFixed(1)} km',
                style: theme.textTheme.bodySmall,
              ),
            ],
          ),
          Slider(
            value: _radiusKm,
            min: 1,
            max: 20,
            divisions: 19,
            activeColor: AppColors.shuttleGold,
            label: '${_radiusKm.toStringAsFixed(1)} km',
            onChanged: (value) => setState(() => _radiusKm = value),
          ),
        ],
      ],
    );
  }

  Widget _buildActions(ThemeData theme) {
    return Container(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        bottom: MediaQuery.of(context).padding.bottom + AppSpacing.md,
        top: AppSpacing.md,
      ),
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: theme.colorScheme.outline.withValues(alpha: 0.1),
          ),
        ),
      ),
      child: SizedBox(
        width: double.infinity,
        child: FilledButton(
          onPressed: _handleApply,
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.shuttleGold,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            ),
          ),
          child: const Text(
            'Apply Filters',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}

/// Small date button widget.
class _DateButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _DateButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onTap,
      icon: const Icon(Icons.calendar_today_rounded, size: 14),
      label: Text(label, overflow: TextOverflow.ellipsis),
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.sm,
        ),
        textStyle: const TextStyle(fontSize: 13),
      ),
    );
  }
}
