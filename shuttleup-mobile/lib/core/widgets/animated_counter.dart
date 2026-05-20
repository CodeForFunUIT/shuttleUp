import 'package:flutter/material.dart';
import '../theme/app_spacing.dart';

/// Animated counter that counts up from 0 to `value`.
///
/// Uses implicit animation with `IntTween` for smooth number roll.
/// Great for stats like "12 sessions near you", ELO scores, revenue.
class AnimatedCounter extends StatefulWidget {
  final int value;
  final String? suffix;
  final String? prefix;
  final TextStyle? style;
  final Duration duration;

  const AnimatedCounter({
    super.key,
    required this.value,
    this.suffix,
    this.prefix,
    this.style,
    this.duration = AppSpacing.durationEmphasis,
  });

  @override
  State<AnimatedCounter> createState() => _AnimatedCounterState();
}

class _AnimatedCounterState extends State<AnimatedCounter>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<int> _animation;
  int _previousValue = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = IntTween(begin: 0, end: widget.value).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant AnimatedCounter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _previousValue = oldWidget.value;
      _animation = IntTween(
        begin: _previousValue,
        end: widget.value,
      ).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
      );
      _controller
        ..reset()
        ..forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final text = '${widget.prefix ?? ''}${_animation.value}${widget.suffix ?? ''}';
        return Text(
          text,
          style: widget.style ?? Theme.of(context).textTheme.headlineLarge,
        );
      },
    );
  }
}
