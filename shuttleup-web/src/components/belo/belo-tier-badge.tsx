"use client";

import React from "react";
import { Award, Shield, Sparkles, Zap, Flame, Crown } from "lucide-react";

export interface BeloTierProps {
  elo: number;
  showRange?: boolean;
  size?: "sm" | "md" | "lg";
}

export function getTierData(elo: number) {
  if (elo >= 2100) {
    return {
      tier: "Master",
      label: "Huyền Thoại",
      color: "from-rose-500 via-red-600 to-amber-500",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/40",
      bgGlow: "shadow-rose-500/20",
      range: "2100+",
      icon: Crown,
    };
  }
  if (elo >= 1800) {
    return {
      tier: "Diamond",
      label: "Kim Cương",
      color: "from-cyan-400 via-sky-500 to-blue-600",
      textColor: "text-cyan-300",
      borderColor: "border-cyan-400/40",
      bgGlow: "shadow-cyan-500/20",
      range: "1800 - 2099",
      icon: Sparkles,
    };
  }
  if (elo >= 1500) {
    return {
      tier: "Gold",
      label: "Vàng Pro",
      color: "from-amber-300 via-amber-400 to-orange-500",
      textColor: "text-amber-300",
      borderColor: "border-amber-400/50",
      bgGlow: "shadow-amber-500/25",
      range: "1500 - 1799",
      icon: Award,
    };
  }
  if (elo >= 1200) {
    return {
      tier: "Silver",
      label: "Bạc Nâng Cao",
      color: "from-slate-200 via-slate-300 to-slate-400",
      textColor: "text-slate-200",
      borderColor: "border-slate-300/40",
      bgGlow: "shadow-slate-400/15",
      range: "1200 - 1499",
      icon: Shield,
    };
  }
  if (elo >= 900) {
    return {
      tier: "Bronze",
      label: "Đồng Tiềm Năng",
      color: "from-amber-700 via-orange-700 to-amber-800",
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-700/40",
      bgGlow: "shadow-amber-800/15",
      range: "900 - 1199",
      icon: Flame,
    };
  }
  return {
    tier: "Rookie",
    label: "Tân Binh",
    color: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgGlow: "shadow-emerald-500/15",
    range: "< 900",
    icon: Zap,
  };
}

export function BeloTierBadge({ elo, showRange = false, size = "md" }: BeloTierProps) {
  const data = getTierData(elo);
  const Icon = data.icon;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1",
    md: "px-3.5 py-1 text-xs sm:text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2 font-bold",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border ${data.borderColor} bg-gradient-to-r ${data.color} bg-clip-border shadow-md ${data.bgGlow} ${sizeClasses[size]} backdrop-blur-md bg-opacity-10 dark:bg-opacity-20`}
    >
      <Icon className={`${iconSizes[size]} ${data.textColor}`} />
      <span className={`font-display font-extrabold tracking-wide uppercase ${data.textColor}`}>
        {data.label}
      </span>
      {showRange && (
        <span className="text-[11px] text-muted-foreground font-mono ml-1">({data.range})</span>
      )}
    </div>
  );
}
