"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fixLeafletIcons } from "@/lib/fix-leaflet-icons";
import { CourtPopup } from "./court-popup";
import { CourtSessionsSheet } from "./court-sessions-sheet";
import { MapFilterSidebar, type MapFilters } from "./map-filter-sidebar";
import type { CourtGroup } from "./court-sessions-sheet";
import type { CourtSession } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Fix icons once on module load
fixLeafletIcons();

/** HCMC center coordinates */
const HCMC_CENTER: [number, number] = [10.762622, 106.660172];
const DEFAULT_ZOOM = 13;

/** Tile URLs */
const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

/** Custom cluster icon */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
  let size = "small";
  if (count >= 50) size = "large";
  else if (count >= 10) size = "medium";

  const sizeMap = { small: 36, medium: 44, large: 52 };
  const px = sizeMap[size as keyof typeof sizeMap];

  return L.divIcon({
    html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
    className: "",
    iconSize: L.point(px, px),
  });
}

/** Group sessions by court → one marker per court */
function groupSessionsByCourt(sessions: CourtSession[]): CourtGroup[] {
  const map = new Map<string, CourtGroup>();

  for (const s of sessions) {
    if (!s.court?.lat || !s.court?.lng) continue;

    const existing = map.get(s.courtId);
    if (existing) {
      existing.sessions.push(s);
      existing.sessionCount++;
      existing.minPrice = Math.min(existing.minPrice, s.pricePerSlot);
      existing.maxPrice = Math.max(existing.maxPrice, s.pricePerSlot);
      existing.totalAvailable += s.availableSlots;
    } else {
      map.set(s.courtId, {
        courtId: s.courtId,
        courtName: s.court.name,
        address: s.court.address,
        district: s.court.district,
        lat: s.court.lat,
        lng: s.court.lng,
        sessions: [s],
        sessionCount: 1,
        minPrice: s.pricePerSlot,
        maxPrice: s.pricePerSlot,
        totalAvailable: s.availableSlots,
        startTime: s.startTime,
      });
    }
  }

  return Array.from(map.values());
}

/** Apply client-side filters to court groups */
function filterCourtGroups(groups: CourtGroup[], filters: MapFilters): CourtGroup[] {
  return groups.filter((group) => {
    // District filter
    if (filters.district && group.district !== filters.district) return false;

    // Skill filter — at least one session must match
    if (filters.skill) {
      const hasMatch = group.sessions.some((s) => s.skillRequired === filters.skill);
      if (!hasMatch) return false;
    }

    // Title filter — at least one session title matches (case-insensitive)
    if (filters.title) {
      const query = filters.title.toLowerCase();
      const titleMatch = group.sessions.some((s) =>
        s.title.toLowerCase().includes(query),
      );
      const courtMatch = group.courtName.toLowerCase().includes(query);
      if (!titleMatch && !courtMatch) return false;
    }

    return true;
  });
}

/** Sub-component that swaps the tile layer when theme changes */
function ThemeAwareTiles() {
  const { resolvedTheme } = useTheme();
  const map = useMap();
  const tileUrl = resolvedTheme === "dark" ? TILE_DARK : TILE_LIGHT;

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);

  return <TileLayer attribution={TILE_ATTRIBUTION} url={tileUrl} />;
}

interface SessionsMapProps {
  sessions: CourtSession[];
}

export default function SessionsMap({ sessions }: SessionsMapProps) {
  const allCourtGroups = useMemo(() => groupSessionsByCourt(sessions), [sessions]);

  const [mapFilters, setMapFilters] = useState<MapFilters>({
    title: "",
    district: "",
    skill: "",
  });

  const filteredGroups = useMemo(
    () => filterCourtGroups(allCourtGroups, mapFilters),
    [allCourtGroups, mapFilters],
  );

  const totalSessions = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.sessionCount, 0),
    [filteredGroups],
  );

  const [selectedCourt, setSelectedCourt] = useState<CourtGroup | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewSessions = useCallback((group: CourtGroup) => {
    setSelectedCourt(group);
    setSheetOpen(true);
  }, []);

  const handleFiltersChange = useCallback((newFilters: MapFilters) => {
    setMapFilters(newFilters);
  }, []);

  return (
    <>
      <MapContainer
        center={HCMC_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full rounded-2xl z-0"
        style={{ minHeight: "500px" }}
      >
        <ThemeAwareTiles />

        {/* Filter sidebar — overlaid on map */}
        <MapFilterSidebar
          filters={mapFilters}
          onFiltersChange={handleFiltersChange}
          courtCount={filteredGroups.length}
          sessionCount={totalSessions}
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {filteredGroups.map((group) => (
            <Marker key={group.courtId} position={[group.lat, group.lng]}>
              <Popup minWidth={240} maxWidth={320}>
                <CourtPopup
                  group={group}
                  onViewSessions={() => handleViewSessions(group)}
                />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <CourtSessionsSheet
        court={selectedCourt}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}