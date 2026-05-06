# Phase 1: Install & Setup Leaflet

## Overview
Install Leaflet ecosystem packages and configure CSS imports for Next.js.

## Implementation Steps

- [ ] Install dependencies:
  ```bash
  npm i leaflet react-leaflet react-leaflet-cluster
  npm i -D @types/leaflet
  ```
- [ ] Import Leaflet CSS in the root layout or `globals.css`:
  ```css
  @import 'leaflet/dist/leaflet.css';
  ```
- [ ] Fix Leaflet's default marker icon path issue in Next.js (webpack breaks the icon URLs). Create a small utility `fix-leaflet-icons.ts` that manually sets `L.Icon.Default` options to point to the CDN or local copies of `marker-icon.png`, `marker-shadow.png`.

## Related Files
- `shuttleup-web/package.json`
- `shuttleup-web/src/app/globals.css`
- `shuttleup-web/src/lib/fix-leaflet-icons.ts` (new)

## Success Criteria
- All packages install without peer dependency conflicts
- Leaflet CSS loads without breaking existing styles
- A minimal `<MapContainer>` renders (even if empty) in a test page
