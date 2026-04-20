// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'session_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$SessionEvent {

 String? get query;
/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SessionEventCopyWith<SessionEvent> get copyWith => _$SessionEventCopyWithImpl<SessionEvent>(this as SessionEvent, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionEvent&&(identical(other.query, query) || other.query == query));
}


@override
int get hashCode => Object.hash(runtimeType,query);

@override
String toString() {
  return 'SessionEvent(query: $query)';
}


}

/// @nodoc
abstract mixin class $SessionEventCopyWith<$Res>  {
  factory $SessionEventCopyWith(SessionEvent value, $Res Function(SessionEvent) _then) = _$SessionEventCopyWithImpl;
@useResult
$Res call({
 String? query
});




}
/// @nodoc
class _$SessionEventCopyWithImpl<$Res>
    implements $SessionEventCopyWith<$Res> {
  _$SessionEventCopyWithImpl(this._self, this._then);

  final SessionEvent _self;
  final $Res Function(SessionEvent) _then;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? query = freezed,}) {
  return _then(_self.copyWith(
query: freezed == query ? _self.query : query // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [SessionEvent].
extension SessionEventPatterns on SessionEvent {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _LoadSessions value)?  loadSessions,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _LoadSessions value)  loadSessions,}){
final _that = this;
switch (_that) {
case _LoadSessions():
return loadSessions(_that);case _:
  throw StateError('Unexpected subclass');

}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _LoadSessions value)?  loadSessions,}){
final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( String? query)?  loadSessions,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that.query);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( String? query)  loadSessions,}) {final _that = this;
switch (_that) {
case _LoadSessions():
return loadSessions(_that.query);case _:
  throw StateError('Unexpected subclass');

}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( String? query)?  loadSessions,}) {final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that.query);case _:
  return null;

}
}

}

/// @nodoc


class _LoadSessions implements SessionEvent {
  const _LoadSessions({this.query});
  

@override final  String? query;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoadSessionsCopyWith<_LoadSessions> get copyWith => __$LoadSessionsCopyWithImpl<_LoadSessions>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoadSessions&&(identical(other.query, query) || other.query == query));
}


@override
int get hashCode => Object.hash(runtimeType,query);

@override
String toString() {
  return 'SessionEvent.loadSessions(query: $query)';
}


}

/// @nodoc
abstract mixin class _$LoadSessionsCopyWith<$Res> implements $SessionEventCopyWith<$Res> {
  factory _$LoadSessionsCopyWith(_LoadSessions value, $Res Function(_LoadSessions) _then) = __$LoadSessionsCopyWithImpl;
@override @useResult
$Res call({
 String? query
});




}
/// @nodoc
class __$LoadSessionsCopyWithImpl<$Res>
    implements _$LoadSessionsCopyWith<$Res> {
  __$LoadSessionsCopyWithImpl(this._self, this._then);

  final _LoadSessions _self;
  final $Res Function(_LoadSessions) _then;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? query = freezed,}) {
  return _then(_LoadSessions(
query: freezed == query ? _self.query : query // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
