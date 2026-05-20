import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Animated circular ELO gauge with BELo brand gradient arc.
///
/// Shows a circular arc from Gold → Red based on ELO percentage.
/// Animates on first render (0 → target) with easeOutCubic curve.
class EloGauge extends StatefulWidget {
  final int elo;
  final int maxElo;
  final double size;

  const EloGauge({
    super.key,
    required this.elo,
    this.maxElo = 2500,
    this.size = 120,
  });

  @override
  State<EloGauge> createState() => _EloGaugeState();
}

class _EloGaugeState extends State<EloGauge>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _progress;

  @override
  void initState() {
    super.initState();
    final target = (widget.elo / widget.maxElo).clamp(0.0, 1.0);

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _progress = Tween<double>(begin: 0, end: target).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _progress,
      builder: (context, child) {
        return SizedBox(
          width: widget.size,
          height: widget.size,
          child: CustomPaint(
            painter: _EloGaugePainter(
              progress: _progress.value,
              brightness: Theme.of(context).brightness,
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${(widget.elo * _progress.value / (widget.elo / widget.maxElo).clamp(0.01, 1.0)).round()}',
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.shuttleGold,
                        ),
                  ),
                  Text(
                    'ELO',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Theme.of(context)
                              .colorScheme
                              .onSurfaceVariant,
                          letterSpacing: 2,
                        ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _EloGaugePainter extends CustomPainter {
  final double progress;
  final Brightness brightness;

  _EloGaugePainter({required this.progress, required this.brightness});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 8;
    const startAngle = 2.3; // ~132 degrees
    const sweepTotal = 2 * pi - 1.0; // ~300 degrees arc

    // ── Background track ──
    final trackPaint = Paint()
      ..color = brightness == Brightness.dark
          ? AppColors.darkMuted
          : const Color(0xFFEAECF0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepTotal,
      false,
      trackPaint,
    );

    // ── Gradient arc ──
    if (progress > 0) {
      final gradientPaint = Paint()
        ..shader = SweepGradient(
          startAngle: startAngle,
          endAngle: startAngle + sweepTotal * progress,
          colors: const [
            AppColors.shuttleGold,
            AppColors.energyOrange,
            AppColors.rallyRed,
          ],
          stops: const [0.0, 0.5, 1.0],
        ).createShader(
          Rect.fromCircle(center: center, radius: radius),
        )
        ..style = PaintingStyle.stroke
        ..strokeWidth = 8
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepTotal * progress,
        false,
        gradientPaint,
      );

      // ── Glow dot at the end ──
      final endAngle = startAngle + sweepTotal * progress;
      final dotCenter = Offset(
        center.dx + radius * cos(endAngle),
        center.dy + radius * sin(endAngle),
      );

      canvas.drawCircle(
        dotCenter,
        6,
        Paint()
          ..color = AppColors.shuttleGold.withValues(alpha: 0.3)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4),
      );
      canvas.drawCircle(
        dotCenter,
        4,
        Paint()..color = AppColors.shuttleGold,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _EloGaugePainter oldDelegate) =>
      progress != oldDelegate.progress;
}
