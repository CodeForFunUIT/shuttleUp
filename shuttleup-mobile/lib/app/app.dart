import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';
import 'routes.dart';

class ShuttleUpApp extends StatelessWidget {
  const ShuttleUpApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ShuttleUp Mobile',
      theme: AppTheme.lightTheme,
      routerConfig: appRouter,
    );
  }
}
