import 'package:flutter/material.dart';

/// BELo Design System — Color Tokens
///
/// Synced with web's globals.css BELo palette.
/// Gold → Orange → Red brand gradient for sports energy.
class AppColors {
  AppColors._();

  // ── Brand Colors ───────────────────────────────────────
  static const Color shuttleGold = Color(0xFFF5C842);
  static const Color energyOrange = Color(0xFFFF6B35);
  static const Color rallyRed = Color(0xFFE8385A);

  // ── Semantic Colors ────────────────────────────────────
  static const Color netGreen = Color(0xFF4ADE80);
  static const Color courtBlue = Color(0xFF378ADD);
  static const Color warning = Color(0xFFF5C842);
  static const Color danger = Color(0xFFE8385A);
  static const Color info = Color(0xFF378ADD);
  static const Color success = Color(0xFF4ADE80);

  // ── Brand Gradient ─────────────────────────────────────
  static const LinearGradient brandGradient = LinearGradient(
    colors: [shuttleGold, energyOrange, rallyRed],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  static const LinearGradient brandGradientVertical = LinearGradient(
    colors: [shuttleGold, energyOrange, rallyRed],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ── Skill Tier Badge Colors ────────────────────────────
  static const Color skillBeginnerBg = Color(0xFFDCFCE7);
  static const Color skillBeginnerFg = Color(0xFF166534);
  static const Color skillIntermediateBg = Color(0xFFDBEAFE);
  static const Color skillIntermediateFg = Color(0xFF1E40AF);
  static const Color skillAdvancedBg = Color(0xFFFFF7ED);
  static const Color skillAdvancedFg = Color(0xFF9A3412);
  static const Color skillProBg = Color(0xFFFEE2E2);
  static const Color skillProFg = Color(0xFF991B1B);

  // ── Light Mode ─────────────────────────────────────────
  static const ColorScheme lightScheme = ColorScheme(
    brightness: Brightness.light,
    primary: shuttleGold,
    onPrimary: Color(0xFF0D0F12),
    secondary: energyOrange,
    onSecondary: Color(0xFFFFFFFF),
    error: rallyRed,
    onError: Color(0xFFFFFFFF),
    surface: Color(0xFFFFFFFF),
    onSurface: Color(0xFF0D0F12),
    surfaceContainerHighest: Color(0xFFF5F6F8),
    onSurfaceVariant: Color(0xFF4B5563),
    outline: Color(0x1F000000), // rgba(0,0,0,0.12)
    outlineVariant: Color(0xFFEAECF0),
  );

  // ── Dark Mode ──────────────────────────────────────────
  static const ColorScheme darkScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: shuttleGold,
    onPrimary: Color(0xFF0D0F12),
    secondary: energyOrange,
    onSecondary: Color(0xFF0D0F12),
    error: rallyRed,
    onError: Color(0xFF0D0F12),
    surface: Color(0xFF161A20),
    onSurface: Color(0xFFF0F2F5),
    surfaceContainerHighest: Color(0xFF1C2128),
    onSurfaceVariant: Color(0xFF6B7280),
    outline: Color(0x1FFFFFFF), // rgba(255,255,255,0.12)
    outlineVariant: Color(0xFF1C2128),
  );

  // ── Misc ───────────────────────────────────────────────
  static const Color lightBackground = Color(0xFFF5F6F8);
  static const Color darkBackground = Color(0xFF0D0F12);
  static const Color darkSurface = Color(0xFF161A20);
  static const Color darkMuted = Color(0xFF1C2128);
}
