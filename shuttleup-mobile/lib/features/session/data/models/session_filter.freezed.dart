// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'session_filter.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$SessionFilter {

 String get query; String get district; String get skill; double? get minPrice; double? get maxPrice; DateTime? get dateFrom; DateTime? get dateTo; double? get nearLat; double? get nearLng; double get radiusKm;
/// Create a copy of SessionFilter
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SessionFilterCopyWith<SessionFilter> get copyWith => _$SessionFilterCopyWithImpl<SessionFilter>(this as SessionFilter, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionFilter&&(identical(other.query, query) || other.query == query)&&(identical(other.district, district) || other.district == district)&&(identical(other.skill, skill) || other.skill == skill)&&(identical(other.minPrice, minPrice) || other.minPrice == minPrice)&&(identical(other.maxPrice, maxPrice) || other.maxPrice == maxPrice)&&(identical(other.dateFrom, dateFrom) || other.dateFrom == dateFrom)&&(identical(other.dateTo, dateTo) || other.dateTo == dateTo)&&(identical(other.nearLat, nearLat) || other.nearLat == nearLat)&&(identical(other.nearLng, nearLng) || other.nearLng == nearLng)&&(identical(other.radiusKm, radiusKm) || other.radiusKm == radiusKm));
}


@override
int get hashCode => Object.hash(runtimeType,query,district,skill,minPrice,maxPrice,dateFrom,dateTo,nearLat,nearLng,radiusKm);

@override
String toString() {
  return 'SessionFilter(query: $query, district: $district, skill: $skill, minPrice: $minPrice, maxPrice: $maxPrice, dateFrom: $dateFrom, dateTo: $dateTo, nearLat: $nearLat, nearLng: $nearLng, radiusKm: $radiusKm)';
}


}

/// @nodoc
abstract mixin class $SessionFilterCopyWith<$Res>  {
  factory $SessionFilterCopyWith(SessionFilter value, $Res Function(SessionFilter) _then) = _$SessionFilterCopyWithImpl;
@useResult
$Res call({
 String query, String district, String skill, double? minPrice, double? maxPrice, DateTime? dateFrom, DateTime? dateTo, double? nearLat, double? nearLng, double radiusKm
});




}
/// @nodoc
class _$SessionFilterCopyWithImpl<$Res>
    implements $SessionFilterCopyWith<$Res> {
  _$SessionFilterCopyWithImpl(this._self, this._then);

  final SessionFilter _self;
  final $Res Function(SessionFilter) _then;

/// Create a copy of SessionFilter
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? query = null,Object? district = null,Object? skill = null,Object? minPrice = freezed,Object? maxPrice = freezed,Object? dateFrom = freezed,Object? dateTo = freezed,Object? nearLat = freezed,Object? nearLng = freezed,Object? radiusKm = null,}) {
  return _then(_self.copyWith(
query: null == query ? _self.query : query // ignore: cast_nullable_to_non_nullable
as String,district: null == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String,skill: null == skill ? _self.skill : skill // ignore: cast_nullable_to_non_nullable
as String,minPrice: freezed == minPrice ? _self.minPrice : minPrice // ignore: cast_nullable_to_non_nullable
as double?,maxPrice: freezed == maxPrice ? _self.maxPrice : maxPrice // ignore: cast_nullable_to_non_nullable
as double?,dateFrom: freezed == dateFrom ? _self.dateFrom : dateFrom // ignore: cast_nullable_to_non_nullable
as DateTime?,dateTo: freezed == dateTo ? _self.dateTo : dateTo // ignore: cast_nullable_to_non_nullable
as DateTime?,nearLat: freezed == nearLat ? _self.nearLat : nearLat // ignore: cast_nullable_to_non_nullable
as double?,nearLng: freezed == nearLng ? _self.nearLng : nearLng // ignore: cast_nullable_to_non_nullable
as double?,radiusKm: null == radiusKm ? _self.radiusKm : radiusKm // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

}


/// Adds pattern-matching-related methods to [SessionFilter].
extension SessionFilterPatterns on SessionFilter {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SessionFilter value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SessionFilter() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SessionFilter value)  $default,){
final _that = this;
switch (_that) {
case _SessionFilter():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SessionFilter value)?  $default,){
final _that = this;
switch (_that) {
case _SessionFilter() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String query,  String district,  String skill,  double? minPrice,  double? maxPrice,  DateTime? dateFrom,  DateTime? dateTo,  double? nearLat,  double? nearLng,  double radiusKm)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SessionFilter() when $default != null:
return $default(_that.query,_that.district,_that.skill,_that.minPrice,_that.maxPrice,_that.dateFrom,_that.dateTo,_that.nearLat,_that.nearLng,_that.radiusKm);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String query,  String district,  String skill,  double? minPrice,  double? maxPrice,  DateTime? dateFrom,  DateTime? dateTo,  double? nearLat,  double? nearLng,  double radiusKm)  $default,) {final _that = this;
switch (_that) {
case _SessionFilter():
return $default(_that.query,_that.district,_that.skill,_that.minPrice,_that.maxPrice,_that.dateFrom,_that.dateTo,_that.nearLat,_that.nearLng,_that.radiusKm);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String query,  String district,  String skill,  double? minPrice,  double? maxPrice,  DateTime? dateFrom,  DateTime? dateTo,  double? nearLat,  double? nearLng,  double radiusKm)?  $default,) {final _that = this;
switch (_that) {
case _SessionFilter() when $default != null:
return $default(_that.query,_that.district,_that.skill,_that.minPrice,_that.maxPrice,_that.dateFrom,_that.dateTo,_that.nearLat,_that.nearLng,_that.radiusKm);case _:
  return null;

}
}

}

/// @nodoc


class _SessionFilter extends SessionFilter {
  const _SessionFilter({this.query = '', this.district = '', this.skill = '', this.minPrice, this.maxPrice, this.dateFrom, this.dateTo, this.nearLat, this.nearLng, this.radiusKm = 5.0}): super._();
  

@override@JsonKey() final  String query;
@override@JsonKey() final  String district;
@override@JsonKey() final  String skill;
@override final  double? minPrice;
@override final  double? maxPrice;
@override final  DateTime? dateFrom;
@override final  DateTime? dateTo;
@override final  double? nearLat;
@override final  double? nearLng;
@override@JsonKey() final  double radiusKm;

/// Create a copy of SessionFilter
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SessionFilterCopyWith<_SessionFilter> get copyWith => __$SessionFilterCopyWithImpl<_SessionFilter>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SessionFilter&&(identical(other.query, query) || other.query == query)&&(identical(other.district, district) || other.district == district)&&(identical(other.skill, skill) || other.skill == skill)&&(identical(other.minPrice, minPrice) || other.minPrice == minPrice)&&(identical(other.maxPrice, maxPrice) || other.maxPrice == maxPrice)&&(identical(other.dateFrom, dateFrom) || other.dateFrom == dateFrom)&&(identical(other.dateTo, dateTo) || other.dateTo == dateTo)&&(identical(other.nearLat, nearLat) || other.nearLat == nearLat)&&(identical(other.nearLng, nearLng) || other.nearLng == nearLng)&&(identical(other.radiusKm, radiusKm) || other.radiusKm == radiusKm));
}


@override
int get hashCode => Object.hash(runtimeType,query,district,skill,minPrice,maxPrice,dateFrom,dateTo,nearLat,nearLng,radiusKm);

@override
String toString() {
  return 'SessionFilter(query: $query, district: $district, skill: $skill, minPrice: $minPrice, maxPrice: $maxPrice, dateFrom: $dateFrom, dateTo: $dateTo, nearLat: $nearLat, nearLng: $nearLng, radiusKm: $radiusKm)';
}


}

/// @nodoc
abstract mixin class _$SessionFilterCopyWith<$Res> implements $SessionFilterCopyWith<$Res> {
  factory _$SessionFilterCopyWith(_SessionFilter value, $Res Function(_SessionFilter) _then) = __$SessionFilterCopyWithImpl;
@override @useResult
$Res call({
 String query, String district, String skill, double? minPrice, double? maxPrice, DateTime? dateFrom, DateTime? dateTo, double? nearLat, double? nearLng, double radiusKm
});




}
/// @nodoc
class __$SessionFilterCopyWithImpl<$Res>
    implements _$SessionFilterCopyWith<$Res> {
  __$SessionFilterCopyWithImpl(this._self, this._then);

  final _SessionFilter _self;
  final $Res Function(_SessionFilter) _then;

/// Create a copy of SessionFilter
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? query = null,Object? district = null,Object? skill = null,Object? minPrice = freezed,Object? maxPrice = freezed,Object? dateFrom = freezed,Object? dateTo = freezed,Object? nearLat = freezed,Object? nearLng = freezed,Object? radiusKm = null,}) {
  return _then(_SessionFilter(
query: null == query ? _self.query : query // ignore: cast_nullable_to_non_nullable
as String,district: null == district ? _self.district : district // ignore: cast_nullable_to_non_nullable
as String,skill: null == skill ? _self.skill : skill // ignore: cast_nullable_to_non_nullable
as String,minPrice: freezed == minPrice ? _self.minPrice : minPrice // ignore: cast_nullable_to_non_nullable
as double?,maxPrice: freezed == maxPrice ? _self.maxPrice : maxPrice // ignore: cast_nullable_to_non_nullable
as double?,dateFrom: freezed == dateFrom ? _self.dateFrom : dateFrom // ignore: cast_nullable_to_non_nullable
as DateTime?,dateTo: freezed == dateTo ? _self.dateTo : dateTo // ignore: cast_nullable_to_non_nullable
as DateTime?,nearLat: freezed == nearLat ? _self.nearLat : nearLat // ignore: cast_nullable_to_non_nullable
as double?,nearLng: freezed == nearLng ? _self.nearLng : nearLng // ignore: cast_nullable_to_non_nullable
as double?,radiusKm: null == radiusKm ? _self.radiusKm : radiusKm // ignore: cast_nullable_to_non_nullable
as double,
  ));
}


}

// dart format on
