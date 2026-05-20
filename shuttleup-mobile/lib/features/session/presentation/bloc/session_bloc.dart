import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:geolocator/geolocator.dart';
import 'session_event.dart';
import 'session_state.dart';
import '../../data/models/session_filter.dart';
import '../../data/repositories/session_repository.dart';

@injectable
class SessionBloc extends Bloc<SessionEvent, SessionState> {
  final SessionRepository _repository;

  SessionBloc(this._repository) : super(const SessionState.initial()) {
    on<SessionEvent>((event, emit) async {
      await event.map(
        loadSessions: (e) => _onLoadSessions(e.filter, emit),
        updateFilter: (e) => _onUpdateFilter(e.filter, emit),
        locateUser: (_) => _onLocateUser(emit),
      );
    });
  }

  Future<void> _onLoadSessions(
    SessionFilter? filter,
    Emitter<SessionState> emit,
  ) async {
    final currentFilter = filter ?? _currentFilter;
    emit(SessionState.loading(filter: currentFilter));
    try {
      final sessions = await _repository.fetchSessions(
        filter: currentFilter,
      );
      emit(SessionState.loaded(
        sessions: sessions,
        filter: currentFilter,
        userLocation: _currentUserLocation,
      ));
    } catch (error) {
      emit(SessionState.error(
        message: error.toString(),
        filter: currentFilter,
      ));
    }
  }

  Future<void> _onUpdateFilter(
    SessionFilter filter,
    Emitter<SessionState> emit,
  ) async {
    add(SessionEvent.loadSessions(filter: filter));
  }

  Future<void> _onLocateUser(
    Emitter<SessionState> emit,
  ) async {
    try {
      // Check location permission
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }
      if (permission == LocationPermission.deniedForever) return;

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.medium,
          timeLimit: Duration(seconds: 10),
        ),
      );

      final currentFilter = _currentFilter.copyWith(
        nearLat: position.latitude,
        nearLng: position.longitude,
      );

      add(SessionEvent.loadSessions(filter: currentFilter));
    } catch (_) {
      // GPS failed silently — don't break the flow
    }
  }

  /// Extract current filter from state.
  SessionFilter get _currentFilter {
    return state.maybeMap(
      loaded: (s) => s.filter,
      loading: (s) => s.filter ?? const SessionFilter(),
      error: (s) => s.filter ?? const SessionFilter(),
      orElse: () => const SessionFilter(),
    );
  }

  /// Extract current user location from state.
  UserLocation? get _currentUserLocation {
    return state.maybeMap(
      loaded: (s) => s.userLocation,
      orElse: () => null,
    );
  }
}
