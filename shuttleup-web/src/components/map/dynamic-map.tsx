"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { CourtSession } from "@/lib/types";

/**
 * Dynamic import wrapper for SessionsMap.
 * Leaflet requires `window` — SSR must be disabled.
 */
const SessionsMap = dynamic(() => import("./sessions-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[500px] rounded-2xl bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground text-sm">Loading map…</span>
    </div>
  ),
});

interface DynamicMapProps {
  sessions: CourtSession[];
}

export function DynamicMap({ sessions }: DynamicMapProps) {
  return <SessionsMap sessions={sessions} />;
}
