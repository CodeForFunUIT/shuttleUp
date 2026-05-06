"use client";

import { useEffect, useRef, useState } from "react";
import { getTierInfo } from "@/components/belo/belo-calc-engine";

function useAnimatedCounter(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const startRef = useRef(target);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;

    startRef.current = start;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startRef.current + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return display;
}

interface EloPreviewCounterProps {
  elo: number;
}

export function EloPreviewCounter({ elo }: EloPreviewCounterProps) {
  const displayElo = useAnimatedCounter(elo);
  const tier = getTierInfo(displayElo);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none sm:bottom-8 sm:right-8">
      <div className="rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-md px-5 py-3 shadow-lg shadow-primary/5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
          Your BELo
        </p>
        <p className="font-barlow-condensed text-4xl font-bold text-foreground tabular-nums leading-none">
          {displayElo}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-sm">{tier.emoji}</span>
          <span className={`text-xs font-semibold ${tier.color} px-1.5 py-0.5 rounded-md`}>
            {tier.name}
          </span>
        </div>
      </div>
    </div>
  );
}
