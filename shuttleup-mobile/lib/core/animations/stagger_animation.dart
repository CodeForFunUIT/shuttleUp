import 'package:flutter/material.dart';

/// Stagger animation utility for lists and grids.
///
/// Wraps each child with a delayed fade + slide-up animation.
/// Use in a Column or Wrap for staggered reveal effects.
class StaggerAnimation extends StatefulWidget {
  final int index;
  final Widget child;
  final Duration itemDelay;
  final Duration duration;
  final Offset beginOffset;

  const StaggerAnimation({
    super.key,
    required this.index,
    required this.child,
    this.itemDelay = const Duration(milliseconds: 80),
    this.duration = const Duration(milliseconds: 400),
    this.beginOffset = const Offset(0, 0.08),
  });

  @override
  State<StaggerAnimation> createState() => _StaggerAnimationState();
}

class _StaggerAnimationState extends State<StaggerAnimation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _opacity;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(
      begin: widget.beginOffset,
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    Future.delayed(widget.itemDelay * widget.index, () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slide,
      child: FadeTransition(
        opacity: _opacity,
        child: widget.child,
      ),
    );
  }
}
