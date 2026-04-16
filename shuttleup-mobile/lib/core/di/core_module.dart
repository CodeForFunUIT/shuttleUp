import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';

@module
abstract class CoreModule {
  @preResolve
  Future<SharedPreferences> get prefs => SharedPreferences.getInstance();

  @lazySingleton
  Logger get logger => Logger(
        printer: PrettyPrinter(
          methodCount: 0,
          errorMethodCount: 5,
          lineLength: 80,
          colors: true,
          printEmojis: true,
          printTime: false,
        ),
      );

  @lazySingleton
  Dio get dioClient {
    final dio = Dio(
      BaseOptions(
        // Replace with production URL when ready
        baseUrl: 'http://10.0.2.2:3000/api', 
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        responseType: ResponseType.json,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Better auth standard cookie passing
          // For mobile we might manually extract and attach better-auth.session_token
          // or rely on a standard Bearer intercept if web API exposes it.
          final prefs = await SharedPreferences.getInstance();
          final token = prefs.getString('auth_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) {
          // You can handle unified response tracking here
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          // Handle global errors, e.g. 401 Unauthorized globally
          return handler.next(e);
        },
      ),
    );

    // Logging interceptor (dev only usually)
    dio.interceptors.add(LogInterceptor(
      request: true,
      requestHeader: true,
      requestBody: true,
      responseHeader: false,
      responseBody: true,
      error: true,
    ));

    return dio;
  }
}
