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





@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SessionEvent);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'SessionEvent()';
}


}

/// @nodoc
class $SessionEventCopyWith<$Res>  {
$SessionEventCopyWith(SessionEvent _, $Res Function(SessionEvent) __);
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>({TResult Function( _LoadSessions value)?  loadSessions,TResult Function( _UpdateFilter value)?  updateFilter,TResult Function( _LocateUser value)?  locateUser,required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that);case _UpdateFilter() when updateFilter != null:
return updateFilter(_that);case _LocateUser() when locateUser != null:
return locateUser(_that);case _:
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

@optionalTypeArgs TResult map<TResult extends Object?>({required TResult Function( _LoadSessions value)  loadSessions,required TResult Function( _UpdateFilter value)  updateFilter,required TResult Function( _LocateUser value)  locateUser,}){
final _that = this;
switch (_that) {
case _LoadSessions():
return loadSessions(_that);case _UpdateFilter():
return updateFilter(_that);case _LocateUser():
return locateUser(_that);}
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>({TResult? Function( _LoadSessions value)?  loadSessions,TResult? Function( _UpdateFilter value)?  updateFilter,TResult? Function( _LocateUser value)?  locateUser,}){
final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that);case _UpdateFilter() when updateFilter != null:
return updateFilter(_that);case _LocateUser() when locateUser != null:
return locateUser(_that);case _:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>({TResult Function( SessionFilter? filter)?  loadSessions,TResult Function( SessionFilter filter)?  updateFilter,TResult Function()?  locateUser,required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that.filter);case _UpdateFilter() when updateFilter != null:
return updateFilter(_that.filter);case _LocateUser() when locateUser != null:
return locateUser();case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>({required TResult Function( SessionFilter? filter)  loadSessions,required TResult Function( SessionFilter filter)  updateFilter,required TResult Function()  locateUser,}) {final _that = this;
switch (_that) {
case _LoadSessions():
return loadSessions(_that.filter);case _UpdateFilter():
return updateFilter(_that.filter);case _LocateUser():
return locateUser();}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>({TResult? Function( SessionFilter? filter)?  loadSessions,TResult? Function( SessionFilter filter)?  updateFilter,TResult? Function()?  locateUser,}) {final _that = this;
switch (_that) {
case _LoadSessions() when loadSessions != null:
return loadSessions(_that.filter);case _UpdateFilter() when updateFilter != null:
return updateFilter(_that.filter);case _LocateUser() when locateUser != null:
return locateUser();case _:
  return null;

}
}

}

/// @nodoc


class _LoadSessions implements SessionEvent {
  const _LoadSessions({this.filter});
  

 final  SessionFilter? filter;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoadSessionsCopyWith<_LoadSessions> get copyWith => __$LoadSessionsCopyWithImpl<_LoadSessions>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoadSessions&&(identical(other.filter, filter) || other.filter == filter));
}


@override
int get hashCode => Object.hash(runtimeType,filter);

@override
String toString() {
  return 'SessionEvent.loadSessions(filter: $filter)';
}


}

/// @nodoc
abstract mixin class _$LoadSessionsCopyWith<$Res> implements $SessionEventCopyWith<$Res> {
  factory _$LoadSessionsCopyWith(_LoadSessions value, $Res Function(_LoadSessions) _then) = __$LoadSessionsCopyWithImpl;
@useResult
$Res call({
 SessionFilter? filter
});


$SessionFilterCopyWith<$Res>? get filter;

}
/// @nodoc
class __$LoadSessionsCopyWithImpl<$Res>
    implements _$LoadSessionsCopyWith<$Res> {
  __$LoadSessionsCopyWithImpl(this._self, this._then);

  final _LoadSessions _self;
  final $Res Function(_LoadSessions) _then;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? filter = freezed,}) {
  return _then(_LoadSessions(
filter: freezed == filter ? _self.filter : filter // ignore: cast_nullable_to_non_nullable
as SessionFilter?,
  ));
}

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SessionFilterCopyWith<$Res>? get filter {
    if (_self.filter == null) {
    return null;
  }

  return $SessionFilterCopyWith<$Res>(_self.filter!, (value) {
    return _then(_self.copyWith(filter: value));
  });
}
}

/// @nodoc


class _UpdateFilter implements SessionEvent {
  const _UpdateFilter(this.filter);
  

 final  SessionFilter filter;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UpdateFilterCopyWith<_UpdateFilter> get copyWith => __$UpdateFilterCopyWithImpl<_UpdateFilter>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UpdateFilter&&(identical(other.filter, filter) || other.filter == filter));
}


@override
int get hashCode => Object.hash(runtimeType,filter);

@override
String toString() {
  return 'SessionEvent.updateFilter(filter: $filter)';
}


}

/// @nodoc
abstract mixin class _$UpdateFilterCopyWith<$Res> implements $SessionEventCopyWith<$Res> {
  factory _$UpdateFilterCopyWith(_UpdateFilter value, $Res Function(_UpdateFilter) _then) = __$UpdateFilterCopyWithImpl;
@useResult
$Res call({
 SessionFilter filter
});


$SessionFilterCopyWith<$Res> get filter;

}
/// @nodoc
class __$UpdateFilterCopyWithImpl<$Res>
    implements _$UpdateFilterCopyWith<$Res> {
  __$UpdateFilterCopyWithImpl(this._self, this._then);

  final _UpdateFilter _self;
  final $Res Function(_UpdateFilter) _then;

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') $Res call({Object? filter = null,}) {
  return _then(_UpdateFilter(
null == filter ? _self.filter : filter // ignore: cast_nullable_to_non_nullable
as SessionFilter,
  ));
}

/// Create a copy of SessionEvent
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SessionFilterCopyWith<$Res> get filter {
  
  return $SessionFilterCopyWith<$Res>(_self.filter, (value) {
    return _then(_self.copyWith(filter: value));
  });
}
}

/// @nodoc


class _LocateUser implements SessionEvent {
  const _LocateUser();
  






@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LocateUser);
}


@override
int get hashCode => runtimeType.hashCode;

@override
String toString() {
  return 'SessionEvent.locateUser()';
}


}




// dart format on
