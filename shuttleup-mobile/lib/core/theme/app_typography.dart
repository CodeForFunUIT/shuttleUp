import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// BELo Design System — Typography
///
/// Heading: Barlow Condensed (500-700) — athletic, condensed impact
/// Body: Barlow (300-600) — clean, readable
/// Mono: JetBrains Mono — stats, ELO scores, prices
class AppTypography {
  AppTypography._();

  /// Complete Material 3 TextTheme using Barlow Condensed + Barlow
  static TextTheme textTheme(Brightness brightness) {
    final Color onSurface = brightness == Brightness.light
        ? const Color(0xFF0D0F12)
        : const Color(0xFFF0F2F5);

    return TextTheme(
      // ── Display ── Barlow Condensed for hero headlines
      displayLarge: GoogleFonts.barlowCondensed(
        fontSize: 36,
        fontWeight: FontWeight.w700,
        height: 1.1,
        letterSpacing: -0.5,
        color: onSurface,
      ),
      displayMedium: GoogleFonts.barlowCondensed(
        fontSize: 28,
        fontWeight: FontWeight.w600,
        height: 1.2,
        letterSpacing: -0.25,
        color: onSurface,
      ),
      displaySmall: GoogleFonts.barlowCondensed(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        height: 1.2,
        color: onSurface,
      ),

      // ── Headline ── Barlow Condensed for section titles
      headlineLarge: GoogleFonts.barlowCondensed(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        height: 1.3,
        color: onSurface,
      ),
      headlineMedium: GoogleFonts.barlowCondensed(
        fontSize: 20,
        fontWeight: FontWeight.w500,
        height: 1.3,
        color: onSurface,
      ),
      headlineSmall: GoogleFonts.barlowCondensed(
        fontSize: 18,
        fontWeight: FontWeight.w500,
        height: 1.3,
        color: onSurface,
      ),

      // ── Title ── Barlow for widget titles
      titleLarge: GoogleFonts.barlow(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: onSurface,
      ),
      titleMedium: GoogleFonts.barlow(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        height: 1.4,
        letterSpacing: 0.1,
        color: onSurface,
      ),
      titleSmall: GoogleFonts.barlow(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 1.4,
        letterSpacing: 0.1,
        color: onSurface,
      ),

      // ── Body ── Barlow for readable content
      bodyLarge: GoogleFonts.barlow(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.6,
        color: onSurface,
      ),
      bodyMedium: GoogleFonts.barlow(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.5,
        color: onSurface,
      ),
      bodySmall: GoogleFonts.barlow(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: onSurface,
      ),

      // ── Label ── Barlow for buttons, badges, tags
      labelLarge: GoogleFonts.barlow(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 1.2,
        letterSpacing: 0.1,
        color: onSurface,
      ),
      labelMedium: GoogleFonts.barlow(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        height: 1.2,
        letterSpacing: 0.5,
        color: onSurface,
      ),
      labelSmall: GoogleFonts.barlow(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        height: 1.2,
        letterSpacing: 0.5,
        color: onSurface,
      ),
    );
  }

  /// Mono style for stats, ELO scores, prices
  static TextStyle monoStyle({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.w400,
    Color? color,
  }) {
    return GoogleFonts.jetBrainsMono(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }
}
