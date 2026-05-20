"use client";

import { motion } from "framer-motion";

/**
 * CSS-only fallback for the 3D shuttlecock scene.
 *
 * Shown when:
 * - WebGL is not supported
 * - Three.js bundle hasn't loaded yet (SSR hydration)
 * - Reduced motion preference is enabled
 *
 * Renders a glowing gold orb with a floating pulse animation.
 */
export function ShuttlecockFallback() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 flex items-center justify-end"
      aria-hidden="true"
    >
      <div className="relative mr-[10%]">
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,200,66,0.3) 0%, transparent 70%)",
            width: 200,
            height: 200,
            margin: "auto",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Shuttlecock icon (SVG) */}
        <motion.svg
          width="120"
          height="160"
          viewBox="0 0 120 160"
          className="relative z-10 drop-shadow-[0_0_30px_rgba(245,200,66,0.4)]"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Feather skirt */}
          <ellipse cx="60" cy="50" rx="45" ry="50" fill="#FFFDF5" opacity="0.9" />
          <ellipse cx="60" cy="50" rx="35" ry="40" fill="white" opacity="0.3" />

          {/* Feather lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI;
            const x1 = 60 + Math.cos(angle) * 10;
            const y1 = 70;
            const x2 = 60 + Math.cos(angle) * 40;
            const y2 = 20;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#E8E0D0"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Cork base */}
          <ellipse cx="60" cy="95" rx="20" ry="8" fill="#D4A843" />
          <rect x="40" y="88" width="40" height="14" rx="4" fill="#F5C842" />
          <ellipse cx="60" cy="88" rx="20" ry="8" fill="#F5C842" />

          {/* Highlight on cork */}
          <ellipse cx="55" cy="90" rx="8" ry="3" fill="white" opacity="0.25" />
        </motion.svg>
      </div>
    </div>
  );
}
