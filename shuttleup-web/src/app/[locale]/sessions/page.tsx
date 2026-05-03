"use client";

import { useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Loader2, AlertCircle, Plus, ArrowRight, LayoutGrid, Map as MapIcon, Search } from "lucide-react";
import { useSessions } from "@/lib/hooks/use-sessions";
import { useSessionSearch, type SessionSearchFilters } from "@/lib/hooks/use-session-search";
import { SessionsFilterBar } from "@/components/sessions/sessions-filter-bar";
import { SessionsPagination } from "@/components/sessions/sessions-pagination";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { DynamicMap } from "@/components/map/dynamic-map";

const ITEMS_PER_PAGE = 12;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("SessionsPage") as any;
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [filters, setFilters] = useState<SessionSearchFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  // Grid uses paginated search API
  const { data: searchResult, isLoading: searchLoading, error: searchError } = useSessionSearch(filters);

  // Map still uses all sessions (needs all markers for clustering)
  const { data: allSessions, isLoading: mapLoading } = useSessions();

  const isLoading = viewMode === "grid" ? searchLoading : mapLoading;
  const sessions = searchResult?.data ?? [];
  const totalResults = searchResult?.total ?? 0;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  /** Locale-aware date formatter */
  const dateFmt = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  /** Locale-aware time formatter */
  const timeFmt = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const getSkillLabel = (skill: string) => {
    const map: Record<string, string> = {
      BEGINNER: t("skills.BEGINNER"),
      INTERMEDIATE: t("skills.INTERMEDIATE"),
      ADVANCED: t("skills.ADVANCED"),
      PRO: t("skills.PRO"),
      ALL: t("skills.ALL"),
    };
    return map[skill] ?? skill;
  };

  const handleFiltersChange = useCallback((newFilters: SessionSearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight" style={{ textWrap: "balance" }}>
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              {t("gridView")}
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "map"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={viewMode === "map"}
            >
              <MapIcon className="h-4 w-4" aria-hidden="true" />
              {t("mapView")}
            </button>
          </div>
          <Link href="/dashboard/sessions/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("hostSession")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter bar — only shown in grid view */}
      {viewMode === "grid" && (
        <div className="mb-8">
          <SessionsFilterBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalResults={totalResults}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-32" role="status" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="ml-3 text-muted-foreground">{t("loading")}</span>
        </div>
      )}

      {/* Error */}
      {searchError && viewMode === "grid" && (
        <div className="flex flex-col items-center justify-center py-32 text-center" role="alert" aria-live="polite">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">{t("errorTitle")}</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {t.rich("errorDesc", {
              primary: (chunks: React.ReactNode) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{chunks}</code>,
            })}
          </p>
        </div>
      )}

      {/* Grid View — filtered & paginated */}
      {!isLoading && !searchError && viewMode === "grid" && (
        <>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{t("noResults")}</h3>
              <p className="text-muted-foreground text-sm">{t("noResultsHint")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const isFull = session.availableSlots <= 0;
                const skillClass = SKILL_CLASS[session.skillRequired] ?? "skill-all";
                const skillLabel = getSkillLabel(session.skillRequired);
                const price = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
                  style: "currency",
                  currency: locale === "vi" ? "VND" : "USD",
                }).format(session.pricePerSlot);

                return (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                  >
                    <article className="h-full flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-[shadow,border-color] duration-300">
                      {/* Colored top bar based on skill */}
                      <div
                        className={cn(
                          "h-1.5 w-full",
                          session.skillRequired === "BEGINNER" && "bg-green-500",
                          session.skillRequired === "INTERMEDIATE" && "bg-blue-500",
                          session.skillRequired === "ADVANCED" && "bg-orange-500",
                          session.skillRequired === "PRO" && "bg-red-500",
                          !["BEGINNER", "INTERMEDIATE", "ADVANCED", "PRO"].includes(session.skillRequired) && "bg-primary"
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
                            {isFull ? t("full") : t("left", { count: session.availableSlots })}
                          </Badge>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                            <span className="truncate">{session.court?.name ?? t("unknownCourt")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                            <span>{dateFmt.format(new Date(session.startTime))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                            <span>
                              {timeFmt.format(new Date(session.startTime))} –{" "}
                              {timeFmt.format(new Date(session.endTime))}
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
                              <span className="text-xs text-muted-foreground">{t("hostedBy")}</span>
                              <span className="text-xs font-medium truncate">{session.host.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/30">
                        <span className="font-display font-bold text-primary tabular-nums">{price}</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          {t("viewDetails")}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <SessionsPagination
            page={filters.page ?? 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Map View — uses all sessions for full clustering */}
      {!mapLoading && allSessions && allSessions.length > 0 && viewMode === "map" && (
        <div className="h-[70vh] rounded-2xl overflow-hidden border">
          <DynamicMap sessions={allSessions} />
        </div>
      )}
    </div>
  );
}
