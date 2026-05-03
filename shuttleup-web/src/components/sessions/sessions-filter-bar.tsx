"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { SessionSearchFilters } from "@/lib/hooks/use-session-search";

/** HCMC districts extracted from our 375 courts data */
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

interface SessionsFilterBarProps {
  filters: SessionSearchFilters;
  onFiltersChange: (filters: SessionSearchFilters) => void;
  totalResults?: number;
}

export function SessionsFilterBar({ filters, onFiltersChange, totalResults }: SessionsFilterBarProps) {
  const t = useTranslations("SessionsPage");
  const [searchInput, setSearchInput] = useState(filters.title ?? "");
  const [nearMe, setNearMe] = useState(false);
  const [locating, setLocating] = useState(false);

  // Debounce title search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.title ?? "")) {
        onFiltersChange({ ...filters, title: searchInput || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDistrictChange = useCallback((value: string | null) => {
    onFiltersChange({
      ...filters,
      district: (!value || value === "all") ? undefined : value,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  const handleSkillChange = useCallback((value: string | null) => {
    onFiltersChange({
      ...filters,
      skillRequired: (!value || value === "all") ? undefined : value,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  const handleNearMe = useCallback(() => {
    if (nearMe) {
      // Turn off
      setNearMe(false);
      onFiltersChange({ ...filters, lat: undefined, lng: undefined, page: 1 });
      return;
    }

    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNearMe(true);
        setLocating(false);
        onFiltersChange({
          ...filters,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          radiusMm: 10000, // 10km radius
          page: 1,
        });
      },
      () => {
        setLocating(false);
      },
      { timeout: 5000 },
    );
  }, [nearMe, filters, onFiltersChange]);

  const handleClear = useCallback(() => {
    setSearchInput("");
    setNearMe(false);
    onFiltersChange({ page: 1, limit: filters.limit });
  }, [filters.limit, onFiltersChange]);

  const hasActiveFilters = !!(filters.title || filters.district || filters.skillRequired || filters.lat);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-10 h-10"
          />
        </div>

        {/* District select */}
        <Select value={filters.district ?? "all"} onValueChange={handleDistrictChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder={t("allDistricts")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allDistricts")}</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Skill select */}
        <Select value={filters.skillRequired ?? "all"} onValueChange={handleSkillChange}>
          <SelectTrigger className="w-full sm:w-[160px] h-10">
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

        {/* Near me button */}
        <Button
          variant={nearMe ? "default" : "outline"}
          size="default"
          className={cn("gap-1.5 h-10 shrink-0", nearMe && "bg-primary text-primary-foreground")}
          onClick={handleNearMe}
          disabled={locating}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {locating ? t("filter.locating") : t("filter.nearMe")}
        </Button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={handleClear}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("filter.clear")}</span>
          </Button>
        )}
      </div>

      {/* Result count */}
      {totalResults != null && (
        <p className="text-xs text-muted-foreground">
          {t("filter.results", { count: totalResults })}
        </p>
      )}
    </div>
  );
}
