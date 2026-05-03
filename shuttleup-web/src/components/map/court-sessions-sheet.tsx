"use client";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourtSession } from "@/lib/types";

/** Grouped court data passed from the map */
export interface CourtGroup {
  courtId: string;
  courtName: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  sessions: CourtSession[];
  sessionCount: number;
  minPrice: number;
  maxPrice: number;
  totalAvailable: number;
  startTime: string;
}

const SKILL_CLASS: Record<string, string> = {
  BEGINNER: "skill-beginner",
  INTERMEDIATE: "skill-intermediate",
  ADVANCED: "skill-advanced",
  PRO: "skill-pro",
  ALL: "skill-all",
};

const SKILL_LABEL: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  PRO: "Pro",
  ALL: "All Levels",
};

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

interface CourtSessionsSheetProps {
  court: CourtGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourtSessionsSheet({ court, open, onOpenChange }: CourtSessionsSheetProps) {
  if (!court) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="font-display text-lg font-bold">
            {court.courtName}
          </SheetTitle>
          <SheetDescription className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span className="text-xs">{court.address}</span>
          </SheetDescription>
          <div className="flex gap-3 pt-1 text-xs text-muted-foreground">
            <span className="font-medium text-primary">
              {court.sessionCount} {court.sessionCount === 1 ? "session" : "sessions"}
            </span>
            <span>•</span>
            <span>
              {court.totalAvailable} slot{court.totalAvailable !== 1 ? "s" : ""} available
            </span>
          </div>
        </SheetHeader>

        {/* Session cards list */}
        <div className="flex flex-col gap-3 p-4">
          {court.sessions.map((session) => {
            const isFull = session.availableSlots <= 0;
            const skillClass = SKILL_CLASS[session.skillRequired] ?? "skill-all";
            const skillLabel = SKILL_LABEL[session.skillRequired] ?? session.skillRequired;

            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
              >
                <article className="rounded-xl border bg-card p-4 space-y-3 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                  {/* Title + availability */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {session.title}
                    </h3>
                    <Badge
                      variant={isFull ? "destructive" : "secondary"}
                      className={cn(
                        "shrink-0 text-[10px] font-semibold",
                        !isFull && "bg-primary/10 text-primary border-primary/20"
                      )}
                    >
                      {isFull ? "Full" : `${session.availableSlots} left`}
                    </Badge>
                  </div>

                  {/* Date & time */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" aria-hidden="true" />
                      <span>{dateFmt.format(new Date(session.startTime))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-primary" aria-hidden="true" />
                      <span>
                        {timeFmt.format(new Date(session.startTime))} – {timeFmt.format(new Date(session.endTime))}
                      </span>
                    </div>
                  </div>

                  {/* Skill + price */}
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", skillClass)}>
                      {skillLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-sm font-bold text-primary tabular-nums">
                        {formatVND(session.pricePerSlot)}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
