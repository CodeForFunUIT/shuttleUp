// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:dio/dio.dart' as _i361;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:logger/logger.dart' as _i974;
import 'package:shared_preferences/shared_preferences.dart' as _i460;

import '../../core/api/api_client.dart' as _i430;
import '../../core/di/core_module.dart' as _i233;
import '../../features/session/data/repositories/session_repository.dart'
    as _i1041;
import '../../features/session/presentation/bloc/session_bloc.dart' as _i844;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  Future<_i174.GetIt> init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) async {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final coreModule = _$CoreModule();
    await gh.factoryAsync<_i460.SharedPreferences>(
      () => coreModule.prefs,
      preResolve: true,
    );
    gh.singleton<_i430.ApiClient>(() => _i430.ApiClient());
    gh.lazySingleton<_i974.Logger>(() => coreModule.logger);
    gh.lazySingleton<_i361.Dio>(() => coreModule.dioClient);
    gh.factory<_i1041.SessionRepository>(
      () => _i1041.SessionRepository(gh<_i430.ApiClient>()),
    );
    gh.factory<_i844.SessionBloc>(
      () => _i844.SessionBloc(gh<_i1041.SessionRepository>()),
    );
    return this;
  }
}

class _$CoreModule extends _i233.CoreModule {}
