import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';

/// Branded splash screen with BELo animations.
///
/// Sequence: dark bg → shuttlecock icon floats up → text slides in
/// → brand gradient line sweeps → fade to home.
/// Total duration: ~2s. Respects reduced motion.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late final AnimationController _iconController;
  late final AnimationController _textController;
  late final AnimationController _lineController;
  late final AnimationController _fadeController;

  late final Animation<double> _iconOpacity;
  late final Animation<Offset> _iconSlide;
  late final Animation<double> _textOpacity;
  late final Animation<Offset> _textSlide;
  late final Animation<double> _lineWidth;
  late final Animation<double> _fadeOpacity;

  @override
  void initState() {
    super.initState();

    // ── Icon: fade in + float up (0-600ms) ──
    _iconController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _iconOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _iconController, curve: Curves.easeOut),
    );
    _iconSlide = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _iconController, curve: Curves.easeOutCubic),
    );

    // ── Text: slide in from bottom (300-900ms) ──
    _textController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _textOpacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeOut),
    );
    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _textController, curve: Curves.easeOutCubic),
    );

    // ── Brand gradient line sweep (600-1200ms) ──
    _lineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _lineWidth = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _lineController, curve: Curves.easeOutCubic),
    );

    // ── Fade out (1500-2000ms) ──
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fadeOpacity = Tween<double>(begin: 1, end: 0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );

    _startSequence();
  }

  Future<void> _startSequence() async {
    // Check if user prefers reduced motion
    final reducedMotion =
        MediaQueryData.fromView(
          WidgetsBinding.instance.platformDispatcher.views.first,
        ).disableAnimations;

    if (reducedMotion) {
      // Skip to home immediately
      await Future.delayed(const Duration(milliseconds: 300));
      if (mounted) context.go('/home');
      return;
    }

    // Stagger the animation chain
    await Future.delayed(const Duration(milliseconds: 200));
    _iconController.forward();

    await Future.delayed(const Duration(milliseconds: 300));
    _textController.forward();

    await Future.delayed(const Duration(milliseconds: 300));
    _lineController.forward();

    await Future.delayed(const Duration(milliseconds: 800));
    _fadeController.forward();

    await Future.delayed(const Duration(milliseconds: 400));
    if (mounted) context.go('/home');
  }

  @override
  void dispose() {
    _iconController.dispose();
    _textController.dispose();
    _lineController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _fadeController,
      builder: (context, child) => Opacity(
        opacity: _fadeOpacity.value,
        child: child,
      ),
      child: Scaffold(
        backgroundColor: AppColors.darkBackground,
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Shuttlecock icon ──
              SlideTransition(
                position: _iconSlide,
                child: FadeTransition(
                  opacity: _iconOpacity,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: AppColors.brandGradient,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.sports_tennis,
                      size: 44,
                      color: Color(0xFF0D0F12),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // ── App name ──
              SlideTransition(
                position: _textSlide,
                child: FadeTransition(
                  opacity: _textOpacity,
                  child: const Text(
                    'SHUTTLEUP',
                    style: TextStyle(
                      fontFamily: 'BarlowCondensed',
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 4,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // ── Tagline ──
              FadeTransition(
                opacity: _textOpacity,
                child: Text(
                  'More smashes, less searching',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.white.withValues(alpha: 0.6),
                    letterSpacing: 1,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // ── Brand gradient line ──
              AnimatedBuilder(
                animation: _lineController,
                builder: (context, _) {
                  return Container(
                    height: 3,
                    width: 120 * _lineWidth.value,
                    decoration: BoxDecoration(
                      gradient: AppColors.brandGradient,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
