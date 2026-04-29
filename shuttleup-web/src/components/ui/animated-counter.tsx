"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  /** Target value to count up to */
  value: number;
  /** Text to append after the number (e.g. "+", " ★") */
  suffix?: string;
  /** Text to prepend before the number */
  prefix?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Additional className */
  className?: string;
}

/** Format large numbers with commas: 1000 → "1,000" */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Animated counter that counts up from 0 when entering viewport.
 * Uses spring physics for natural deceleration.
 * Falls back to instant display if reduced-motion is preferred.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 30,
    duration: duration * 1000,
  });

  // For reduced motion, show the final value immediately
  const initialDisplay = useMemo(() => (prefersReducedMotion ? formatNumber(value) : "0"), [prefersReducedMotion, value]);
  const [display, setDisplay] = useState(initialDisplay);

  // Trigger the spring animation when in view
  useEffect(() => {
    if (isInView && !hasAnimated.current && !prefersReducedMotion) {
      hasAnimated.current = true;
      motionValue.set(value);
    }
  }, [isInView, value, motionValue, prefersReducedMotion]);

  // Subscribe to spring value changes to update display
  useEffect(() => {
    if (prefersReducedMotion) return;
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(formatNumber(Math.round(latest)));
    });
    return unsubscribe;
  }, [springValue, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
