import 'package:flutter/foundation.dart';

/// Notification Service Mock
/// In a real app this would use firebase_core, firebase_messaging, 
/// and flutter_local_notifications.
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();

  factory NotificationService() {
    return _instance;
  }

  NotificationService._internal();

  Future<void> initialize() async {
    debugPrint('Mock FCM: Initializing Firebase Messaging...');
    // Simulate Requesting permissions
    debugPrint('Mock FCM: Requesting notification permission (granted)');
    
    // Get token
    final token = await getDeviceToken();
    debugPrint('Mock FCM: Device Token = $token');
    
    // Simulate listening to foreground messages
    debugPrint('Mock FCM: Listening to foreground messages');
  }

  Future<String> getDeviceToken() async {
    // Return a fake FCM token
    await Future<void>.delayed(const Duration(milliseconds: 500));
    return 'mock-fcm-device-token-12345';
  }

  void showLocalNotification({required String title, required String body}) {
    debugPrint('🔔 ---------- NOTIFICATION ---------- 🔔');
    debugPrint('Title: $title');
    debugPrint('Body: $body');
    debugPrint('---------------------------------------');
    // For a real app, use flutter_local_notifications plugin
  }
}
