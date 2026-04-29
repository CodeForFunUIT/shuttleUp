"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

interface AnimatedSectionProps {
  children: ReactNode;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Direction the element slides in from */
  direction?: Direction;
  /** Custom className */
  className?: string;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
};

/**
 * Scroll-triggered reveal wrapper using Framer Motion.
 * Animates children with fade + slide when entering viewport.
 * Respects prefers-reduced-motion automatically.
 */
export function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
  className,
}: AnimatedSectionProps) {
  const offset = directionMap[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const, delay },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
