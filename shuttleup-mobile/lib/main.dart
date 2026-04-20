import 'package:flutter/material.dart';
import 'app/app.dart';
import 'app/di/injection.dart';
import 'core/services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  configureDependencies();
  
  // Initialize Mock Notifications
  await NotificationService().initialize();
  
  runApp(const ShuttleUpApp());
}
