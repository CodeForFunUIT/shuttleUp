import 'package:freezed_annotation/freezed_annotation.dart';
import '../../data/models/session_model.dart';

part 'session_state.freezed.dart';

@freezed
class SessionState with _$SessionState {
  const factory SessionState.initial() = _Initial;
  const factory SessionState.loading() = _Loading;
  const factory SessionState.loaded(List<SessionModel> sessions) = _Loaded;
  const factory SessionState.error(String message) = _Error;
}
