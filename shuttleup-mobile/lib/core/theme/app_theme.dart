import 'package:flutter/material.dart';

class AppTheme {
  static const primaryGold = Color(0xFFF5C842);
  static const darkGold = Color(0xFFD9A300);
  static const energyOrange = Color(0xFFFF6B35);
  static const courtBlack = Color(0xFF0B0E14);
  static const midnightPlate = Color(0xFF131822);
  static const slateSurface = Color(0xFFF4F6F9);

  static ThemeData get lightTheme {
    return ThemeData(
      colorScheme: const ColorScheme.light(
        primary: darkGold,
        onPrimary: courtBlack,
        secondary: energyOrange,
        onSecondary: Colors.white,
        surface: slateSurface,
        onSurface: courtBlack,
      ),
      scaffoldBackgroundColor: slateSurface,
      useMaterial3: true,
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: courtBlack,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: Color(0x140B0E14)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: darkGold,
          foregroundColor: courtBlack,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      colorScheme: const ColorScheme.dark(
        primary: primaryGold,
        onPrimary: courtBlack,
        secondary: energyOrange,
        onSecondary: courtBlack,
        surface: midnightPlate,
        onSurface: Color(0xFFF0F4F8),
      ),
      scaffoldBackgroundColor: courtBlack,
      useMaterial3: true,
      appBarTheme: const AppBarTheme(
        backgroundColor: courtBlack,
        foregroundColor: Color(0xFFF0F4F8),
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: midnightPlate,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: Color(0x14FFFFFF)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGold,
          foregroundColor: courtBlack,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }
}
