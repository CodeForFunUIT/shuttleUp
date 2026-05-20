import 'package:freezed_annotation/freezed_annotation.dart';

part 'session_model.freezed.dart';
part 'session_model.g.dart';

@freezed
sealed class SessionModel with _$SessionModel {
  const factory SessionModel({
    required String id,
    required String title,
    required DateTime startTime,
    required DateTime endTime,
    required String courtName,
    required int maxPlayers,
    required int bookedPlayers,
    required double price,
    required String requiredSkill,
    // ── Geo / court fields (from backend CourtSession) ──
    String? courtId,
    String? district,
    double? latitude,
    double? longitude,
    String? description,
    String? hostName,
  }) = _SessionModel;

  factory SessionModel.fromJson(Map<String, dynamic> json) =>
      _$SessionModelFromJson(json);
}
