/// BELo Design System — Spacing Tokens
///
/// 4px base grid (consistent with Tailwind defaults on web).
class AppSpacing {
  AppSpacing._();

  /// 4px — Icon padding, tight internal spacing
  static const double xs = 4;

  /// 8px — Tight spacing between related elements
  static const double sm = 8;

  /// 12px — Compact padding
  static const double md12 = 12;

  /// 16px — Standard spacing (default padding, gap)
  static const double md = 16;

  /// 20px — Medium-large gap
  static const double lg20 = 20;

  /// 24px — Section spacing
  static const double lg = 24;

  /// 32px — Large gaps between major sections
  static const double xl = 32;

  /// 48px — Page margins, hero padding
  static const double xxl = 48;

  /// 64px — Extra large spacing
  static const double xxxl = 64;

  // ── Border Radius ─────────────────────────────────────
  /// 6px — Small radius for badges, chips
  static const double radiusSm = 6;

  /// 10px — Default radius for inputs, buttons
  static const double radiusMd = 10;

  /// 14px — Cards, containers
  static const double radiusLg = 14;

  /// 20px — Large cards, modals
  static const double radiusXl = 20;

  /// 24px — Extra large containers
  static const double radius2xl = 24;

  /// 9999px — Pill shapes, circles
  static const double radiusFull = 9999;

  // ── Motion Durations ──────────────────────────────────
  /// 100ms — Micro feedback (button press)
  static const Duration durationMicro = Duration(milliseconds: 100);

  /// 150ms — Fast transitions (hover, tap feedback)
  static const Duration durationFast = Duration(milliseconds: 150);

  /// 200ms — Normal transitions (tab switch, fade)
  static const Duration durationNormal = Duration(milliseconds: 200);

  /// 300ms — Slow transitions (page push, expansion)
  static const Duration durationSlow = Duration(milliseconds: 300);

  /// 600ms — Emphasis animations (counter, gauge fill)
  static const Duration durationEmphasis = Duration(milliseconds: 600);
}
