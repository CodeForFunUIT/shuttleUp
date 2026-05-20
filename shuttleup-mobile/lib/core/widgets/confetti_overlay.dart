import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Confetti burst overlay for booking success celebrations.
///
/// Shows gold/orange particles bursting from center + a checkmark.
/// Duration: 1.5s total. Auto-disposes after animation completes.
class ConfettiOverlay extends StatefulWidget {
  final VoidCallback? onComplete;

  const ConfettiOverlay({super.key, this.onComplete});

  @override
  State<ConfettiOverlay> createState() => _ConfettiOverlayState();
}

class _ConfettiOverlayState extends State<ConfettiOverlay>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final List<_Particle> _particles;
  final _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    // Generate particles with random properties
    _particles = List.generate(30, (_) => _Particle(
      angle: _random.nextDouble() * 2 * pi,
      speed: 100 + _random.nextDouble() * 200,
      color: [
        AppColors.shuttleGold,
        AppColors.energyOrange,
        AppColors.rallyRed,
        AppColors.netGreen,
      ][_random.nextInt(4)],
      size: 4 + _random.nextDouble() * 6,
    ));

    _controller.forward().then((_) {
      widget.onComplete?.call();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: MediaQuery.of(context).size,
          painter: _ConfettiPainter(
            particles: _particles,
            progress: _controller.value,
          ),
        );
      },
    );
  }
}

class _Particle {
  final double angle;
  final double speed;
  final Color color;
  final double size;

  _Particle({
    required this.angle,
    required this.speed,
    required this.color,
    required this.size,
  });
}

class _ConfettiPainter extends CustomPainter {
  final List<_Particle> particles;
  final double progress;

  _ConfettiPainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    // ── Checkmark (appears at 30%) ──
    if (progress > 0.3) {
      final checkProgress = ((progress - 0.3) / 0.3).clamp(0.0, 1.0);
      final checkPaint = Paint()
        ..color = AppColors.netGreen.withValues(alpha: checkProgress)
        ..style = PaintingStyle.fill;

      // Circle background
      canvas.drawCircle(center, 32 * checkProgress, checkPaint);

      // Checkmark path
      if (checkProgress > 0.5) {
        final strokePaint = Paint()
          ..color = Colors.white
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3
          ..strokeCap = StrokeCap.round;

        final path = Path();
        final lineProgress = ((checkProgress - 0.5) / 0.5).clamp(0.0, 1.0);

        path.moveTo(center.dx - 12, center.dy);
        if (lineProgress < 0.5) {
          final p = lineProgress * 2;
          path.lineTo(
            center.dx - 12 + 8 * p,
            center.dy + 8 * p,
          );
        } else {
          path.lineTo(center.dx - 4, center.dy + 8);
          final p = (lineProgress - 0.5) * 2;
          path.lineTo(
            center.dx - 4 + 18 * p,
            center.dy + 8 - 20 * p,
          );
        }
        canvas.drawPath(path, strokePaint);
      }
    }

    // ── Confetti particles ──
    for (final particle in particles) {
      final easedProgress = Curves.easeOut.transform(progress);
      final dx = cos(particle.angle) * particle.speed * easedProgress;
      final dy = sin(particle.angle) * particle.speed * easedProgress -
          50 * easedProgress; // slight upward bias
      final opacity = (1 - progress).clamp(0.0, 1.0);

      final paint = Paint()
        ..color = particle.color.withValues(alpha: opacity)
        ..style = PaintingStyle.fill;

      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromCenter(
            center: center + Offset(dx, dy),
            width: particle.size,
            height: particle.size * 1.5,
          ),
          Radius.circular(particle.size * 0.3),
        ),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) =>
      progress != oldDelegate.progress;
}
