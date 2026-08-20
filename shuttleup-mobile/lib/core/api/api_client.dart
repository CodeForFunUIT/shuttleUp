import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:logger/logger.dart';

@singleton
class ApiClient {
  final Dio dio;
  final Logger logger;

  ApiClient() 
    : dio = Dio(),
      logger = Logger() {
    // Default base URL for Android Emulator. Use 127.0.0.1 for iOS Simulator.
    // Replace with your local IP or production URL eventually.
    dio.options.baseUrl = 'http://10.0.2.2:3000/api'; 
    dio.options.connectTimeout = const Duration(seconds: 15);
    dio.options.receiveTimeout = const Duration(seconds: 15);
    
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          logger.d('REQUEST[${options.method}] => PATH: ${options.path}');
          return handler.next(options); // continue
        },
        onResponse: (response, handler) {
          logger.d('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
          return handler.next(response); // continue
        },
        onError: (DioException e, handler) {
          logger.e('ERROR[${e.response?.statusCode}] => PATH: ${e.requestOptions.path}');
          return handler.next(e); // continue
        },
      )
    );
  }

  Future<Response<dynamic>> get(String path, {Map<String, dynamic>? queryParameters}) async {
    return dio.get<dynamic>(path, queryParameters: queryParameters);
  }

  Future<Response<dynamic>> post(String path, {dynamic data}) async {
    return dio.post<dynamic>(path, data: data);
  }
}
