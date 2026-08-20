"use client";

import { Badge } from "@/components/ui/badge";
import { getTierInfo } from "./belo-calc-engine";
import { BeloTierBadge } from "./belo-tier-badge";
import { ArrowUp, ArrowDown, Minus, Zap } from "lucide-react";

// ─── PlayerResultCard ─────────────────────────────────────────────────────

interface PlayerResultProps {
  label: string;
  eloBefore: number;
  eloAfter: number;
  delta: number;
  expected: number;
  isWinner: boolean;
  colorScheme: "blue" | "rose" | "emerald" | "violet";
  carryWeight?: number;
}

export function PlayerResultCard({
  label,
  eloBefore,
  eloAfter,
  delta,
  expected,
  isWinner,
  colorScheme,
  carryWeight,
}: PlayerResultProps) {
  const tierBefore = getTierInfo(eloBefore);
  const tierAfter = getTierInfo(eloAfter);
  const tierChanged = tierBefore.name !== tierAfter.name;

  const bgMap = {
    blue: "bg-sky-500/5 border-sky-500/20",
    rose: "bg-rose-500/5 border-rose-500/20",
    emerald: "bg-emerald-500/5 border-emerald-500/20",
    violet: "bg-violet-500/5 border-violet-500/20",
  };

  const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
  const deltaColor =
    delta > 0
      ? "text-emerald-400 bg-emerald-950/50 border-emerald-800/40"
      : delta < 0
      ? "text-rose-400 bg-rose-950/50 border-rose-800/40"
      : "text-muted-foreground bg-secondary/50 border-border";

  return (
    <div className={`p-5 rounded-2xl border ${bgMap[colorScheme]} backdrop-blur-md transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">{label}</span>
          {carryWeight !== undefined && (
            <span className="text-[11px] text-muted-foreground font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
              Gánh: {(carryWeight * 100).toFixed(0)}%
            </span>
          )}
        </div>
        <Badge
          className={
            isWinner
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-bold text-xs"
              : "bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 font-bold text-xs"
          }
        >
          {isWinner ? "🏆 THẮNG" : "THUA"}
        </Badge>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="text-center">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Trước Trận</p>
          <p className="text-xl font-bold font-mono text-muted-foreground">{eloBefore}</p>
        </div>

        <div className="flex items-center gap-1.5 pb-1">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-sm font-black font-mono ${deltaColor}`}>
            <DeltaIcon className="h-4 w-4" />
            {delta > 0 ? `+${delta}` : delta}
          </span>
        </div>

        <div className="text-center">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-0.5">Sau Trận</p>
          <p className="text-2xl font-black font-mono text-foreground">{eloAfter}</p>
        </div>

        <div className="ml-auto text-right flex flex-col items-end">
          <BeloTierBadge elo={eloAfter} size="sm" />
          {tierChanged && (
            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-bold mt-1.5 animate-pulse">
              <Zap className="h-3 w-3 fill-primary" /> THĂNG HẠNG!
            </span>
          )}
        </div>
      </div>

      {/* Win probability gauge */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Xác suất thắng kỳ vọng thuật toán</span>
          <span className="font-mono font-bold text-foreground">{(expected * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-primary transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, expected * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── DetailRow ────────────────────────────────────────────────────────────

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-bold text-foreground">{value}</span>
    </div>
  );
}

// ─── VS Divider ───────────────────────────────────────────────────────────

export function VsDivider() {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-display font-black text-xs text-primary glow-gold-subtle">
        VS
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

