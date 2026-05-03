"use client";

import { MapPin, Users, Banknote, ArrowRight } from "lucide-react";
import type { CourtGroup } from "./court-sessions-sheet";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

interface CourtPopupProps {
  group: CourtGroup;
  onViewSessions: () => void;
}

export function CourtPopup({ group, onViewSessions }: CourtPopupProps) {
  const priceRange =
    group.minPrice === group.maxPrice
      ? formatVND(group.minPrice)
      : `${formatVND(group.minPrice)} – ${formatVND(group.maxPrice)}`;

  return (
    <div className="font-sans text-sm space-y-2.5 min-w-[220px]">
      {/* Court name */}
      <h3 className="font-bold text-base leading-tight text-foreground">
        {group.courtName}
      </h3>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span className="text-xs leading-tight">{group.address}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1 text-xs">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{group.sessionCount}</span>
          <span className="text-muted-foreground">
            {group.sessionCount === 1 ? "session" : "sessions"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Banknote className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{priceRange}</span>
        </div>
      </div>

      {/* Available slots */}
      {group.totalAvailable > 0 && (
        <div className="text-xs text-primary font-medium">
          🏸 {group.totalAvailable} slot{group.totalAvailable !== 1 ? "s" : ""} available
        </div>
      )}

      {/* View Sessions CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewSessions();
        }}
        className="w-full flex items-center justify-center gap-1.5 mt-1 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
      >
        View {group.sessionCount} {group.sessionCount === 1 ? "Session" : "Sessions"}
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}
