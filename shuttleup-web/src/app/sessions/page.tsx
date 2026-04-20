"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Loader2, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { useSessions } from "@/lib/hooks/use-sessions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/** Map raw skill enum → readable label */
const SKILL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  PRO: "Pro",
  ALL: "All Levels",
};

/** Map skill → badge CSS utility */
const SKILL_CLASS: Record<string, string> = {
  BEGINNER: "skill-beginner",
  INTERMEDIATE: "skill-intermediate",
  ADVANCED: "skill-advanced",
  PRO: "skill-pro",
  ALL: "skill-all",
};

/** Avatar with initials */
function HostAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function SessionsPage() {
  const { data: sessions, isLoading, error } = useSessions();

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Find Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Join upcoming games matched to your skill level
          </p>
        </div>
        <Link href="/dashboard/sessions/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Host a Session
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="ml-3 text-muted-foreground">Loading sessions…</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Failed to Load Sessions</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Could not connect to the API. Make sure the backend is running at{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">localhost:3000</code>.
          </p>
        </div>
      )}

      {/* Empty state */}
      {sessions && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">No Sessions Yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Be the first to host a badminton session in your area!
          </p>
          <Link href="/dashboard/sessions/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Host a Session
            </Button>
          </Link>
        </div>
      )}

      {/* Sessions Grid */}
      {sessions && sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const isFull = session.availableSlots <= 0;
            const skillClass = SKILL_CLASS[session.skillRequired] ?? "skill-all";
            const skillLabel = SKILL_LABELS[session.skillRequired] ?? session.skillRequired;
            const price = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(session.pricePerSlot);

            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
              >
                <article className="h-full flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300">

                  {/* Colored top bar based on skill */}
                  <div
                    className={cn(
                      "h-1.5 w-full",
                      session.skillRequired === "BEGINNER" && "bg-green-500",
                      session.skillRequired === "INTERMEDIATE" && "bg-blue-500",
                      session.skillRequired === "ADVANCED" && "bg-orange-500",
                      session.skillRequired === "PRO" && "bg-red-500",
                      !["BEGINNER", "INTERMEDIATE", "ADVANCED", "PRO"].includes(session.skillRequired) && "bg-primary",
                    )}
                    aria-hidden="true"
                  />

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5 gap-4">

                    {/* Title + slot badge */}
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {session.title}
                      </h2>
                      <Badge
                        variant={isFull ? "destructive" : "secondary"}
                        className={cn(
                          "shrink-0 text-xs font-semibold",
                          !isFull && "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {isFull ? "Full" : `${session.availableSlots} left`}
                      </Badge>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span className="truncate">{session.court?.name ?? "Unknown Court"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>{format(new Date(session.startTime), "EEE, dd MMM yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                        <span>
                          {format(new Date(session.startTime), "HH:mm")} –{" "}
                          {format(new Date(session.endTime), "HH:mm")}
                        </span>
                      </div>
                    </div>

                    {/* Skill badge */}
                    <div>
                      <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", skillClass)}>
                        {skillLabel}
                      </span>
                    </div>

                    {/* Host info */}
                    {session.host && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <HostAvatar name={session.host.name ?? "Host"} />
                        <div className="min-w-0">
                          <span className="text-xs text-muted-foreground">Hosted by </span>
                          <span className="text-xs font-medium truncate">{session.host.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/30">
                    <span className="font-display font-bold text-primary tabular-nums">
                      {price}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      View details
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>

                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
