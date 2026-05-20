import 'package:freezed_annotation/freezed_annotation.dart';
import '../../data/models/session_model.dart';
import '../../data/models/session_filter.dart';

part 'session_state.freezed.dart';

/// User GPS location (optional).
class UserLocation {
  final double latitude;
  final double longitude;

  const UserLocation({required this.latitude, required this.longitude});
}

@freezed
sealed class SessionState with _$SessionState {
  const factory SessionState.initial() = _Initial;
  const factory SessionState.loading({
    SessionFilter? filter,
  }) = _Loading;
  const factory SessionState.loaded({
    required List<SessionModel> sessions,
    @Default(SessionFilter()) SessionFilter filter,
    UserLocation? userLocation,
  }) = _Loaded;
  const factory SessionState.error({
    required String message,
    SessionFilter? filter,
  }) = _Error;
}
