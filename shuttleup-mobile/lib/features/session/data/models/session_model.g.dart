// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'session_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SessionModel _$SessionModelFromJson(Map<String, dynamic> json) =>
    _SessionModel(
      id: json['id'] as String,
      title: json['title'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: DateTime.parse(json['endTime'] as String),
      courtName: json['courtName'] as String,
      maxPlayers: (json['maxPlayers'] as num).toInt(),
      bookedPlayers: (json['bookedPlayers'] as num).toInt(),
      price: (json['price'] as num).toDouble(),
      requiredSkill: json['requiredSkill'] as String,
    );

Map<String, dynamic> _$SessionModelToJson(_SessionModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'startTime': instance.startTime.toIso8601String(),
      'endTime': instance.endTime.toIso8601String(),
      'courtName': instance.courtName,
      'maxPlayers': instance.maxPlayers,
      'bookedPlayers': instance.bookedPlayers,
      'price': instance.price,
      'requiredSkill': instance.requiredSkill,
    };
