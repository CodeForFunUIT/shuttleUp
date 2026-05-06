# Brainstorm: Map Library for Displaying Sessions on Court Locations

## Problem Statement & Requirements
Display 375 courts (with 1000+ sessions) on an interactive map in `shuttleup-web` (Next.js 16 + React 19). Users should be able to see court locations across HCMC, click markers to see active sessions, and potentially filter by district/skill/time.

**Data shape:** Courts have `lat`, `lng` (all in HCMC area, ~10.7°N 106.6°E). Sessions are linked to courts. Need marker clustering at low zoom levels.

**Constraints:**
- Portfolio project → ongoing API costs are undesirable
- Next.js 16 + React 19 compatibility required
- All courts in Vietnam (HCMC) → need good VN map data coverage
- ~375 markers → moderate load, no extreme optimization needed

## Evaluated Approaches

### Option A: Google Maps (@vis.gl/react-google-maps)
Google's official React wrapper for Maps JavaScript API.

*   **Pros:**
    *   Best map data quality in Vietnam (street names, POIs, satellite imagery)
    *   You already have a `GOOGLE_MAPS_API_KEY` in `.env`
    *   Official React 19 support via `@vis.gl/react-google-maps`
    *   Familiar UX — everyone knows Google Maps
    *   Built-in marker clustering, Street View, directions
*   **Cons:**
    *   **Cost:** $200/month free credit covers ~28,000 map loads. After that, $7/1000 loads. For a portfolio project with low traffic this is fine, but if it goes viral or you demo it a lot, you could get billed.
    *   API key must be restricted properly (HTTP referrer restrictions) or anyone can steal it
    *   Bundle size is larger (loads Google's JS SDK externally)
    *   Slightly heavier DX — need to manage API key loading, script injection

### Option B: Leaflet (react-leaflet)
The most popular open-source map library. Uses OpenStreetMap tiles by default.

*   **Pros:**
    *   **100% free, forever** — no API key needed for basic OSM tiles
    *   Extremely mature ecosystem (plugins for clustering, heatmaps, routing)
    *   Lightweight bundle (~40KB gzipped)
    *   Huge community, tons of tutorials
    *   Vietnam/HCMC coverage on OpenStreetMap is quite good
*   **Cons:**
    *   Default OSM tiles look dated/plain compared to Google Maps
    *   Need to use custom tile providers (CartoDB, Stadia, Mapbox) for better aesthetics
    *   `react-leaflet` v5 has React 19 compatibility (verify latest)
    *   Canvas rendering only (no WebGL) — less smooth at high zoom transitions
    *   Marker clustering requires a separate plugin (`react-leaflet-markercluster`)

### Option C: MapLibre GL JS (react-map-gl + maplibre-gl)
Open-source fork of Mapbox GL JS. WebGL-powered, vector tiles, smooth 3D.

*   **Pros:**
    *   **Free and open-source** — no API key required if you use free tile providers (MapTiler free tier, Protomaps, OpenFreeMap)
    *   WebGL rendering → buttery smooth zoom/pan/tilt, 3D building extrusions
    *   `react-map-gl` works seamlessly with both Mapbox and MapLibre
    *   Modern vector tiles look much better than Leaflet's raster tiles
    *   Built-in clustering via GeoJSON source
    *   Great performance even with 10,000+ markers
*   **Cons:**
    *   Slightly steeper learning curve than Leaflet
    *   Need to pick a free tile provider and host/configure the style JSON
    *   Smaller community than Leaflet (but growing fast)

### Option D: Mapbox GL JS (react-map-gl + mapbox-gl)
The premium WebGL map library. Beautiful by default.

*   **Pros:**
    *   Gorgeous default styles (satellite, dark, light, streets, outdoors)
    *   Excellent DX, best-in-class documentation
    *   50,000 free map loads/month — very generous for portfolio
    *   `react-map-gl` by Uber/Vis.gl is battle-tested
*   **Cons:**
    *   Requires API key and account signup
    *   Proprietary license since v2.0 — cannot self-host or fork
    *   If free tier exceeded, billing kicks in

## Final Recommended Solution

**Recommendation: Option B (Leaflet with react-leaflet) + CartoDB dark tiles**

*Rationale:*
1. **Zero cost, zero risk** — no API key, no billing surprises, ever. Perfect for a portfolio project.
2. **375 markers is trivially handled** by Leaflet, no WebGL needed.
3. With **CartoDB dark basemap tiles** (free, no key), the map will look sleek and modern — matching your dark-themed UI.
4. `react-leaflet` is the simplest to integrate — you can have markers on screen in under 30 minutes.
5. Marker clustering plugin handles the density when zoomed out on all of HCMC.
6. You already have all the lat/lng data in your courts table — just fetch and render.

**Why not Google Maps?** You have the API key, but for a portfolio project the risk of unexpected charges + the need to manage key restrictions adds unnecessary complexity. Leaflet gives you 95% of the UX with 0% of the cost.

**Why not MapLibre?** It's technically superior (WebGL, vector tiles), but for 375 markers it's overkill. Leaflet is simpler and faster to implement. If you later need 3D buildings or 10K+ markers, you can migrate to MapLibre — the component API is similar.

## Implementation Considerations
- Use `react-leaflet` v5+ for React 19 compat
- Use `react-leaflet-cluster` for marker clustering
- Tile URL: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png` (free, no key)
- Custom marker icons with session count badges
- Popup on click showing court name, active sessions, price range
- Center map on HCMC: `[10.78, 106.66]`, zoom 12

## Success Metrics
- Map renders in < 2 seconds with all 375 markers
- Markers cluster at zoom ≤ 12, expand at higher zoom
- Click a marker → see court info + session list
- Zero API costs

## Next Steps
Create a `/plan` to implement the map component with Leaflet, integrate it into the Sessions page or a dedicated `/map` route, and wire it to the `GET /api/courts` endpoint with session counts.
