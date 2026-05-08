import 'package:freezed_annotation/freezed_annotation.dart';

part 'session_event.freezed.dart';

@freezed
sealed class SessionEvent with _$SessionEvent {
  const factory SessionEvent.loadSessions({String? query}) = _LoadSessions;
}
