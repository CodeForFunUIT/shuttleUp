"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

interface StaggerContainerProps {
  children: ReactNode;
  /** Delay between each child animation in seconds */
  staggerDelay?: number;
  /** Initial delay before first child animates */
  initialDelay?: number;
  /** Additional className */
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { staggerDelay: number; initialDelay: number }) => ({
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.initialDelay,
    },
  }),
};

/**
 * Container that staggers child animations.
 * Wrap direct children with <StaggerItem> for the effect.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={{ staggerDelay, initialDelay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Item ─────────────────────────────────────────────────────────

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/** Individual item inside a StaggerContainer */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
