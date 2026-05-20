import 'package:freezed_annotation/freezed_annotation.dart';

part 'session_filter.freezed.dart';

/// Filter criteria for session search.
///
/// All fields default to empty/null = no filter applied.
/// Used by SessionBloc to filter API results or send as query params.
@freezed
sealed class SessionFilter with _$SessionFilter {
  const factory SessionFilter({
    @Default('') String query,
    @Default('') String district,
    @Default('') String skill,
    double? minPrice,
    double? maxPrice,
    DateTime? dateFrom,
    DateTime? dateTo,
    double? nearLat,
    double? nearLng,
    @Default(5.0) double radiusKm,
  }) = _SessionFilter;

  const SessionFilter._();

  /// Whether any filter is actively set.
  bool get hasActiveFilters =>
      query.isNotEmpty ||
      district.isNotEmpty ||
      skill.isNotEmpty ||
      minPrice != null ||
      maxPrice != null ||
      dateFrom != null ||
      dateTo != null ||
      nearLat != null;

  /// Count of active filter categories.
  int get activeFilterCount {
    int count = 0;
    if (query.isNotEmpty) count++;
    if (district.isNotEmpty) count++;
    if (skill.isNotEmpty) count++;
    if (minPrice != null || maxPrice != null) count++;
    if (dateFrom != null || dateTo != null) count++;
    if (nearLat != null) count++;
    return count;
  }
}
