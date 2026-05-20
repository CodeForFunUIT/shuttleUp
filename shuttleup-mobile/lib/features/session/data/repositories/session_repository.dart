import 'dart:math';
import 'package:injectable/injectable.dart';
import 'package:logger/logger.dart';
import '../models/session_model.dart';
import '../models/session_filter.dart';
import '../../../../core/api/api_client.dart';

/// Session repository — fetches from API with filter query params.
///
/// Falls back to mock data when API is unavailable (portfolio demo).
@injectable
class SessionRepository {
  final ApiClient _apiClient;
  final Logger _logger = Logger();

  SessionRepository(this._apiClient);

  /// Fetch sessions with optional filter criteria.
  Future<List<SessionModel>> fetchSessions({SessionFilter? filter}) async {
    try {
      final queryParams = _buildQueryParams(filter);
      final response = await _apiClient.get(
        '/sessions',
        queryParameters: queryParams,
      );

      final List<dynamic> data = response.data is List
          ? response.data
          : (response.data['data'] ?? []);

      return data
          .map((json) => _mapApiSessionToModel(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      _logger.w('API unavailable, using mock data: $e');
      return _getMockSessions(filter);
    }
  }

  /// Build query params from filter model.
  Map<String, dynamic> _buildQueryParams(SessionFilter? filter) {
    if (filter == null) return {};
    final params = <String, dynamic>{};

    if (filter.query.isNotEmpty) params['search'] = filter.query;
    if (filter.district.isNotEmpty) params['district'] = filter.district;
    if (filter.skill.isNotEmpty) params['skill'] = filter.skill;
    if (filter.minPrice != null) params['minPrice'] = filter.minPrice;
    if (filter.maxPrice != null) params['maxPrice'] = filter.maxPrice;
    if (filter.dateFrom != null) {
      params['dateFrom'] = filter.dateFrom!.toIso8601String();
    }
    if (filter.dateTo != null) {
      params['dateTo'] = filter.dateTo!.toIso8601String();
    }
    if (filter.nearLat != null && filter.nearLng != null) {
      params['lat'] = filter.nearLat;
      params['lng'] = filter.nearLng;
      params['radius'] = filter.radiusKm;
    }

    return params;
  }

  /// Map backend JSON (CourtSession shape) to SessionModel.
  SessionModel _mapApiSessionToModel(Map<String, dynamic> json) {
    final court = json['court'] as Map<String, dynamic>?;
    final host = json['host'] as Map<String, dynamic>?;

    return SessionModel(
      id: json['id'] as String,
      title: json['title'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      courtName: court?['name'] as String? ?? 'Unknown Court',
      maxPlayers: json['totalSlots'] as int? ?? 0,
      bookedPlayers:
          (json['totalSlots'] as int? ?? 0) -
          (json['availableSlots'] as int? ?? 0),
      price: (json['pricePerSlot'] as num?)?.toDouble() ?? 0,
      requiredSkill: json['skillRequired'] as String? ?? 'ALL',
      courtId: json['courtId'] as String?,
      district: court?['district'] as String?,
      latitude: (court?['lat'] as num?)?.toDouble(),
      longitude: (court?['lng'] as num?)?.toDouble(),
      description: json['description'] as String?,
      hostName: host?['name'] as String?,
    );
  }

  /// Mock data with realistic HCMC court locations.
  List<SessionModel> _getMockSessions(SessionFilter? filter) {
    final now = DateTime.now();
    final sessions = [
      SessionModel(
        id: '1',
        title: 'Weekend Smash District 7',
        startTime: now.add(const Duration(days: 1, hours: 9)),
        endTime: now.add(const Duration(days: 1, hours: 11)),
        courtName: 'Phu My Hung Courts',
        maxPlayers: 8,
        bookedPlayers: 5,
        price: 50000,
        requiredSkill: 'INTERMEDIATE',
        courtId: 'c1',
        district: 'Quận 7',
        latitude: 10.7295,
        longitude: 106.7217,
      ),
      SessionModel(
        id: '2',
        title: 'Chill Sunday Morning',
        startTime: now.add(const Duration(days: 2, hours: 7)),
        endTime: now.add(const Duration(days: 2, hours: 9)),
        courtName: 'Lam Son Court',
        maxPlayers: 6,
        bookedPlayers: 6,
        price: 45000,
        requiredSkill: 'ALL',
        courtId: 'c2',
        district: 'Quận 1',
        latitude: 10.7769,
        longitude: 106.7009,
      ),
      SessionModel(
        id: '3',
        title: 'Pro Night Rally',
        startTime: now.add(const Duration(days: 1, hours: 19)),
        endTime: now.add(const Duration(days: 1, hours: 21)),
        courtName: 'Thu Duc Sports Center',
        maxPlayers: 10,
        bookedPlayers: 3,
        price: 80000,
        requiredSkill: 'ADVANCED',
        courtId: 'c3',
        district: 'Thành phố Thủ Đức',
        latitude: 10.8510,
        longitude: 106.7719,
      ),
      SessionModel(
        id: '4',
        title: 'Beginner Friendly Morning',
        startTime: now.add(const Duration(days: 3, hours: 8)),
        endTime: now.add(const Duration(days: 3, hours: 10)),
        courtName: 'Binh Thanh Club',
        maxPlayers: 8,
        bookedPlayers: 2,
        price: 35000,
        requiredSkill: 'BEGINNER',
        courtId: 'c4',
        district: 'Quận Bình Thạnh',
        latitude: 10.8010,
        longitude: 106.7113,
      ),
      SessionModel(
        id: '5',
        title: 'Competitive Doubles',
        startTime: now.add(const Duration(days: 1, hours: 17)),
        endTime: now.add(const Duration(days: 1, hours: 19)),
        courtName: 'Tan Binh Arena',
        maxPlayers: 4,
        bookedPlayers: 2,
        price: 100000,
        requiredSkill: 'PRO',
        courtId: 'c5',
        district: 'Quận Tân Bình',
        latitude: 10.8016,
        longitude: 106.6525,
      ),
      SessionModel(
        id: '6',
        title: 'Evening Mixed Doubles',
        startTime: now.add(const Duration(days: 2, hours: 18)),
        endTime: now.add(const Duration(days: 2, hours: 20)),
        courtName: 'Go Vap Sports Hall',
        maxPlayers: 8,
        bookedPlayers: 4,
        price: 55000,
        requiredSkill: 'INTERMEDIATE',
        courtId: 'c6',
        district: 'Quận Gò Vấp',
        latitude: 10.8386,
        longitude: 106.6652,
      ),
    ];

    return _applyClientFilter(sessions, filter);
  }

  /// Client-side filtering (used for mock data fallback).
  List<SessionModel> _applyClientFilter(
    List<SessionModel> sessions,
    SessionFilter? filter,
  ) {
    if (filter == null || !filter.hasActiveFilters) return sessions;

    return sessions.where((s) {
      if (filter.query.isNotEmpty) {
        final q = filter.query.toLowerCase();
        final matchTitle = s.title.toLowerCase().contains(q);
        final matchCourt = s.courtName.toLowerCase().contains(q);
        if (!matchTitle && !matchCourt) return false;
      }
      if (filter.district.isNotEmpty && s.district != filter.district) {
        return false;
      }
      if (filter.skill.isNotEmpty &&
          s.requiredSkill != filter.skill &&
          s.requiredSkill != 'ALL') {
        return false;
      }
      if (filter.minPrice != null && s.price < filter.minPrice!) return false;
      if (filter.maxPrice != null && s.price > filter.maxPrice!) return false;
      if (filter.dateFrom != null && s.startTime.isBefore(filter.dateFrom!)) {
        return false;
      }
      if (filter.dateTo != null && s.startTime.isAfter(filter.dateTo!)) {
        return false;
      }
      if (filter.nearLat != null &&
          filter.nearLng != null &&
          s.latitude != null &&
          s.longitude != null) {
        final dist = _haversineKm(
          filter.nearLat!,
          filter.nearLng!,
          s.latitude!,
          s.longitude!,
        );
        if (dist > filter.radiusKm) return false;
      }
      return true;
    }).toList();
  }

  /// Haversine distance in km between two coordinates.
  double _haversineKm(
    double lat1, double lon1, double lat2, double lon2,
  ) {
    const r = 6371.0; // Earth radius km
    final dLat = _toRad(lat2 - lat1);
    final dLon = _toRad(lon2 - lon1);
    final a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRad(lat1)) * cos(_toRad(lat2)) *
        sin(dLon / 2) * sin(dLon / 2);
    return r * 2 * atan2(sqrt(a), sqrt(1 - a));
  }

  double _toRad(double deg) => deg * pi / 180;
}
