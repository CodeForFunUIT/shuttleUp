"use client";

import { useState, useCallback, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Search, MapPin, ChevronLeft, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/** HCMC districts */
const DISTRICTS = [
  "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
  "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
  "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh",
  "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình",
  "Quận Tân Phú", "Quận Thủ Đức", "Huyện Bình Chánh",
  "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn",
  "Huyện Nhà Bè", "Thành phố Thủ Đức",
];

const SKILL_OPTIONS = [
  { value: "ALL", label: "allLevels" },
  { value: "BEGINNER", label: "beginner" },
  { value: "INTERMEDIATE", label: "intermediate" },
  { value: "ADVANCED", label: "advanced" },
  { value: "PRO", label: "pro" },
];

export interface MapFilters {
  title: string;
  district: string;
  skill: string;
}

interface MapFilterSidebarProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  courtCount: number;
  sessionCount: number;
}

export function MapFilterSidebar({
  filters,
  onFiltersChange,
  courtCount,
  sessionCount,
}: MapFilterSidebarProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("SessionsPage") as any;
  const map = useMap();
  const [collapsed, setCollapsed] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.title);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.title) {
        onFiltersChange({ ...filters, title: searchValue });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDistrictChange = useCallback(
    (value: string | null) => {
      onFiltersChange({ ...filters, district: (!value || value === "all") ? "" : value });
    },
    [filters, onFiltersChange],
  );

  const handleSkillChange = useCallback(
    (value: string | null) => {
      onFiltersChange({ ...filters, skill: (!value || value === "all") ? "" : value });
    },
    [filters, onFiltersChange],
  );

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1.5 });
      },
      () => setLocating(false),
      { timeout: 5000 },
    );
  }, [map]);

  const handleClear = useCallback(() => {
    setSearchValue("");
    onFiltersChange({ title: "", district: "", skill: "" });
  }, [onFiltersChange]);

  const hasActiveFilters = !!(filters.title || filters.district || filters.skill);

  // Collapsed state — just show a toggle button
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-md border shadow-lg text-sm font-medium hover:bg-background/90 transition-all"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <ChevronRight className="h-3 w-3" />
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="absolute top-3 left-3 z-[1000] w-64 rounded-2xl bg-background/85 backdrop-blur-xl border shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t("mapFilter.title")}</span>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label={t("filter.clear")}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label="Collapse filters"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-8 h-8 text-xs bg-background/60"
          />
        </div>

        {/* District */}
        <Select value={filters.district || "all"} onValueChange={handleDistrictChange}>
          <SelectTrigger className="h-8 text-xs bg-background/60">
            <SelectValue placeholder={t("allDistricts")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDistricts")}</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Skill */}
        <Select value={filters.skill || "all"} onValueChange={handleSkillChange}>
          <SelectTrigger className="h-8 text-xs bg-background/60">
            <SelectValue placeholder={t("allSkills")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allSkills")}</SelectItem>
            {SKILL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(`filter.${opt.label}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Near me */}
        <button
          onClick={handleNearMe}
          disabled={locating}
          className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          <MapPin className="h-3.5 w-3.5" />
          {locating ? t("filter.locating") : t("filter.nearMe")}
        </button>
      </div>

      {/* Stats footer */}
      <div className="px-4 py-2.5 border-t bg-muted/30 text-[11px] text-muted-foreground flex items-center gap-2">
        <span className="font-semibold text-foreground tabular-nums">{courtCount}</span> {t("mapFilter.courts")}
        <span className="text-muted-foreground">·</span>
        <span className="font-semibold text-foreground tabular-nums">{sessionCount}</span> {t("mapFilter.sessions")}
      </div>
    </div>
  );
}
