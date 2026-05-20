import 'package:freezed_annotation/freezed_annotation.dart';
import '../../data/models/session_filter.dart';

part 'session_event.freezed.dart';

@freezed
sealed class SessionEvent with _$SessionEvent {
  const factory SessionEvent.loadSessions({SessionFilter? filter}) =
      _LoadSessions;
  const factory SessionEvent.updateFilter(SessionFilter filter) =
      _UpdateFilter;
  const factory SessionEvent.locateUser() = _LocateUser;
}
