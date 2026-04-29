"use client";

import { Badge } from "@/components/ui/badge";
import { getTierInfo } from "./belo-calc-engine";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

// ─── PlayerResultCard ─────────────────────────────────────────────────────

interface PlayerResultProps {
  label: string;
  eloBefore: number;
  eloAfter: number;
  delta: number;
  expected: number;
  isWinner: boolean;
  colorScheme: "blue" | "rose" | "emerald" | "violet";
  /** Optional carry weight % for doubles */
  carryWeight?: number;
}

export function PlayerResultCard({
  label, eloBefore, eloAfter, delta, expected, isWinner, colorScheme, carryWeight,
}: PlayerResultProps) {
  const tierBefore = getTierInfo(eloBefore);
  const tierAfter = getTierInfo(eloAfter);
  const tierChanged = tierBefore.name !== tierAfter.name;

  const bgMap = {
    blue: "bg-blue-50/60 border-blue-100",
    rose: "bg-rose-50/60 border-rose-100",
    emerald: "bg-emerald-50/60 border-emerald-100",
    violet: "bg-violet-50/60 border-violet-100",
  };

  const DeltaIcon = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus;
  const deltaColor = delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-500" : "text-slate-400";

  return (
    <div className={`p-4 rounded-lg border ${bgMap[colorScheme]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          {carryWeight !== undefined && (
            <span className="text-[10px] text-muted-foreground font-mono">
              CW: {(carryWeight * 100).toFixed(0)}%
            </span>
          )}
          <Badge className={isWinner ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-600"}>
            {isWinner ? "Thắng" : "Thua"}
          </Badge>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Trước</p>
          <p className="text-lg font-bold text-slate-600">{eloBefore}</p>
        </div>
        <div className="flex items-center gap-1 pb-1">
          <span className="text-slate-300">→</span>
          <span className={`flex items-center gap-0.5 text-sm font-bold ${deltaColor}`}>
            <DeltaIcon className="h-3.5 w-3.5" />
            {delta > 0 ? `+${delta}` : delta}
          </span>
          <span className="text-slate-300">→</span>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Sau</p>
          <p className="text-lg font-extrabold">{eloAfter}</p>
        </div>
        <div className="ml-auto text-right">
          <Badge className={tierAfter.color}>
            {tierAfter.emoji} {tierAfter.name}
          </Badge>
          {tierChanged && (
            <p className="text-[10px] text-emerald-600 font-medium mt-1">Thay đổi tier!</p>
          )}
        </div>
      </div>

      {/* Win probability bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Xác suất thắng kỳ vọng</span>
          <span className="font-medium">{(expected * 100).toFixed(1)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${expected * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── DetailRow ────────────────────────────────────────────────────────────

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-medium text-slate-700">{value}</span>
    </div>
  );
}

// ─── VS Divider ───────────────────────────────────────────────────────────

export function VsDivider() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-muted-foreground font-medium">VS</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}
