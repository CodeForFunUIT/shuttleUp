// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'session_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SessionModel {

 String get id; String get title; DateTime get startTime; DateTime get endTime; String get courtName; int get maxPlayers; int get bookedPlayers; double get price; String get requiredSkill;// ── Geo / court fields (from backend CourtSession) ──
 String? get courtId; String? get district; double? get latitude; double? get longitude; String? get description; String? get hostName;
/// Create a copy of SessionModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SessionModelCopyWith<SessionModel> get copyWith => _$SessionModelCopyWithImpl<SessionModel>(this as SessionModel, _$identity);

  /// Serializes this SessionModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionModel&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.courtName, courtName) || other.courtName == courtName)&&(identical(other.maxPlayers, maxPlayers) || other.maxPlayers == maxPlayers)&&(identical(other.bookedPlayers, bookedPlayers) || other.bookedPlayers == bookedPlayers)&&(identical(other.price, price) || other.price == price)&&(identical(other.requiredSkill, requiredSkill) || other.requiredSkill == requiredSkill)&&(identical(other.courtId, courtId) || other.courtId == courtId)&&(identical(other.district, district) || other.district == district)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.description, description) || other.description == description)&&(identical(other.hostName, hostName) || other.hostName == hostName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,title,startTime,endTime,courtName,maxPlayers,bookedPlayers,price,requiredSkill,courtId,district,latitude,longitude,description,hostName);

@override
String toString() {
  return 'SessionModel(id: $id, title: $title, startTime: $startTime, endTime: $endTime, courtName: $courtName, maxPlayers: $maxPlayers, bookedPlayers: $bookedPlayers, price: $price, requiredSkill: $requiredSkill, courtId: $courtId, district: $district, latitude: $latitude, longitude: $longitude, description: $description, hostName: $hostName)';
}


}

/// @nodoc
abstract mixin class $SessionModelCopyWith<$Res>  {
  factory $SessionModelCopyWith(SessionModel value, $Res Function(SessionModel) _then) = _$SessionModelCopyWithImpl;
@useResult
$Res call({
 String id, String title, DateTime startTime, DateTime endTime, String courtName, int maxPlayers, int bookedPlayers, double price, String requiredSkill, String? courtId, String? district, double? latitude, double? longitude, String? description, String? hostName
});




}
/// @nodoc
class _$SessionModelCopyWithImpl<$Res>
    implements $SessionModelCopyWith<$Res> {
  _$SessionModelCopyWithImpl(this._self, this._then);

  final SessionModel _self;
  final $Res Function(SessionModel) _then;

/// Create a copy of SessionModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? title = null,Object? startTime = null,Object? endTime = null,Object? courtName = null,Object? maxPlayers = null,Object? bookedPlayers = null,Object? price = null,Object? requiredSkill = null,Object? courtId = freezed,Object? district = freezed,Object? latitude = freezed,Object? longitude = freezed,Object? description = freezed,Object? hostName = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as DateTime,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as DateTime,courtName: null == courtName ? _self.courtName : courtName // ignore: cast_nullable_to_non_nullable
as String,maxPlayers: null == maxPlayers ? _self.maxPlayers : maxPlayers // ignore: cast_nullable_to_non_nullable
as int,bookedPlayers: null == bookedPlayers ? _self.bookedPlayers : bookedPlayers // ignore: cast_nullable_to_non_nullable
as int,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,requiredSkill: null == requiredSkill ? _self.requiredSkill : requiredSkill // ignore: cast_nullable_to_non_nullable
as String,courtId: freezed == courtId ? _self.courtId : courtId // ignore: cast_nullable_to_non_nullable
as String?,district: freezed == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String?,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hostName: freezed == hostName ? _self.hostName : hostName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [SessionModel].
extension SessionModelPatterns on SessionModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SessionModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SessionModel() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SessionModel value)  $default,){
final _that = this;
switch (_that) {
case _SessionModel():
return $default(_that);}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SessionModel value)?  $default,){
final _that = this;
switch (_that) {
case _SessionModel() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String title,  DateTime startTime,  DateTime endTime,  String courtName,  int maxPlayers,  int bookedPlayers,  double price,  String requiredSkill,  String? courtId,  String? district,  double? latitude,  double? longitude,  String? description,  String? hostName)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SessionModel() when $default != null:
return $default(_that.id,_that.title,_that.startTime,_that.endTime,_that.courtName,_that.maxPlayers,_that.bookedPlayers,_that.price,_that.requiredSkill,_that.courtId,_that.district,_that.latitude,_that.longitude,_that.description,_that.hostName);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String title,  DateTime startTime,  DateTime endTime,  String courtName,  int maxPlayers,  int bookedPlayers,  double price,  String requiredSkill,  String? courtId,  String? district,  double? latitude,  double? longitude,  String? description,  String? hostName)  $default,) {final _that = this;
switch (_that) {
case _SessionModel():
return $default(_that.id,_that.title,_that.startTime,_that.endTime,_that.courtName,_that.maxPlayers,_that.bookedPlayers,_that.price,_that.requiredSkill,_that.courtId,_that.district,_that.latitude,_that.longitude,_that.description,_that.hostName);}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String title,  DateTime startTime,  DateTime endTime,  String courtName,  int maxPlayers,  int bookedPlayers,  double price,  String requiredSkill,  String? courtId,  String? district,  double? latitude,  double? longitude,  String? description,  String? hostName)?  $default,) {final _that = this;
switch (_that) {
case _SessionModel() when $default != null:
return $default(_that.id,_that.title,_that.startTime,_that.endTime,_that.courtName,_that.maxPlayers,_that.bookedPlayers,_that.price,_that.requiredSkill,_that.courtId,_that.district,_that.latitude,_that.longitude,_that.description,_that.hostName);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SessionModel implements SessionModel {
  const _SessionModel({required this.id, required this.title, required this.startTime, required this.endTime, required this.courtName, required this.maxPlayers, required this.bookedPlayers, required this.price, required this.requiredSkill, this.courtId, this.district, this.latitude, this.longitude, this.description, this.hostName});
  factory _SessionModel.fromJson(Map<String, dynamic> json) => _$SessionModelFromJson(json);

@override final  String id;
@override final  String title;
@override final  DateTime startTime;
@override final  DateTime endTime;
@override final  String courtName;
@override final  int maxPlayers;
@override final  int bookedPlayers;
@override final  double price;
@override final  String requiredSkill;
// ── Geo / court fields (from backend CourtSession) ──
@override final  String? courtId;
@override final  String? district;
@override final  double? latitude;
@override final  double? longitude;
@override final  String? description;
@override final  String? hostName;

/// Create a copy of SessionModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SessionModelCopyWith<_SessionModel> get copyWith => __$SessionModelCopyWithImpl<_SessionModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SessionModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SessionModel&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.startTime, startTime) || other.startTime == startTime)&&(identical(other.endTime, endTime) || other.endTime == endTime)&&(identical(other.courtName, courtName) || other.courtName == courtName)&&(identical(other.maxPlayers, maxPlayers) || other.maxPlayers == maxPlayers)&&(identical(other.bookedPlayers, bookedPlayers) || other.bookedPlayers == bookedPlayers)&&(identical(other.price, price) || other.price == price)&&(identical(other.requiredSkill, requiredSkill) || other.requiredSkill == requiredSkill)&&(identical(other.courtId, courtId) || other.courtId == courtId)&&(identical(other.district, district) || other.district == district)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.description, description) || other.description == description)&&(identical(other.hostName, hostName) || other.hostName == hostName));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,title,startTime,endTime,courtName,maxPlayers,bookedPlayers,price,requiredSkill,courtId,district,latitude,longitude,description,hostName);

@override
String toString() {
  return 'SessionModel(id: $id, title: $title, startTime: $startTime, endTime: $endTime, courtName: $courtName, maxPlayers: $maxPlayers, bookedPlayers: $bookedPlayers, price: $price, requiredSkill: $requiredSkill, courtId: $courtId, district: $district, latitude: $latitude, longitude: $longitude, description: $description, hostName: $hostName)';
}


}

/// @nodoc
abstract mixin class _$SessionModelCopyWith<$Res> implements $SessionModelCopyWith<$Res> {
  factory _$SessionModelCopyWith(_SessionModel value, $Res Function(_SessionModel) _then) = __$SessionModelCopyWithImpl;
@override @useResult
$Res call({
 String id, String title, DateTime startTime, DateTime endTime, String courtName, int maxPlayers, int bookedPlayers, double price, String requiredSkill, String? courtId, String? district, double? latitude, double? longitude, String? description, String? hostName
});




}
/// @nodoc
class __$SessionModelCopyWithImpl<$Res>
    implements _$SessionModelCopyWith<$Res> {
  __$SessionModelCopyWithImpl(this._self, this._then);

  final _SessionModel _self;
  final $Res Function(_SessionModel) _then;

/// Create a copy of SessionModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? title = null,Object? startTime = null,Object? endTime = null,Object? courtName = null,Object? maxPlayers = null,Object? bookedPlayers = null,Object? price = null,Object? requiredSkill = null,Object? courtId = freezed,Object? district = freezed,Object? latitude = freezed,Object? longitude = freezed,Object? description = freezed,Object? hostName = freezed,}) {
  return _then(_SessionModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,startTime: null == startTime ? _self.startTime : startTime // ignore: cast_nullable_to_non_nullable
as DateTime,endTime: null == endTime ? _self.endTime : endTime // ignore: cast_nullable_to_non_nullable
as DateTime,courtName: null == courtName ? _self.courtName : courtName // ignore: cast_nullable_to_non_nullable
as String,maxPlayers: null == maxPlayers ? _self.maxPlayers : maxPlayers // ignore: cast_nullable_to_non_nullable
as int,bookedPlayers: null == bookedPlayers ? _self.bookedPlayers : bookedPlayers // ignore: cast_nullable_to_non_nullable
as int,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as double,requiredSkill: null == requiredSkill ? _self.requiredSkill : requiredSkill // ignore: cast_nullable_to_non_nullable
as String,courtId: freezed == courtId ? _self.courtId : courtId // ignore: cast_nullable_to_non_nullable
as String?,district: freezed == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String?,latitude: freezed == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double?,longitude: freezed == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double?,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,hostName: freezed == hostName ? _self.hostName : hostName // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
