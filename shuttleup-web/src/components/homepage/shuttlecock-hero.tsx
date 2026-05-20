"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { ShuttlecockFallback } from "./shuttlecock-fallback";

/**
 * Dynamic loader for the 3D shuttlecock scene.
 *
 * - SSR disabled (Three.js requires browser APIs)
 * - Shows CSS fallback until the WebGL canvas hydrates
 * - Falls back permanently if WebGL is not available or
 *   user prefers reduced motion
 */
const ShuttlecockScene3D = dynamic(
  () =>
    import("./shuttlecock-scene").then((mod) => mod.ShuttlecockScene),
  {
    ssr: false,
    loading: () => <ShuttlecockFallback />,
  }
);

function useSupportsWebGL() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setSupported(!!gl && !prefersReducedMotion);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

export function ShuttlecockHero() {
  const supportsWebGL = useSupportsWebGL();

  // Still checking — show fallback
  if (supportsWebGL === null) {
    return <ShuttlecockFallback />;
  }

  // No WebGL or reduced motion — permanent fallback
  if (!supportsWebGL) {
    return <ShuttlecockFallback />;
  }

  // Full 3D scene
  return (
    <Suspense fallback={<ShuttlecockFallback />}>
      <ShuttlecockScene3D />
    </Suspense>
  );
}
