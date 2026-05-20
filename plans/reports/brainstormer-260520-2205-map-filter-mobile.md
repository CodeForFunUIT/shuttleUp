# Brainstormer: Map Feature + Session Filters (Mobile)

**Date:** 2026-05-20  
**Scope:** `shuttleup-mobile` — Google Maps split-view + advanced filter system

---

## Problem Statement

Mobile app needs a map view showing court locations with session markers, plus rich filtering (skill, district, price, time, GPS "near me"). Users want to **discover sessions visually** on a map and **refine by multiple criteria** simultaneously.

## Current State

| Aspect | Status |
|--------|--------|
| `SessionModel` | Missing `lat`, `lng`, `district`, `court` data |
| `SessionBloc` | Uses hardcoded mock data, no filter support |
| `google_maps_flutter` | In pubspec but **never used** |
| API client | Dio-based `ApiClient` singleton exists, points to `http://10.0.2.2:3000/api` |
| Web reference | Full Leaflet map with cluster markers, filter sidebar (search/district/skill) |
| Backend types | `CourtSession` has `court.lat`, `court.lng`, `court.district`, `skillRequired`, `pricePerSlot`, `startTime` |

---

## Approach Evaluation

### Option A: Google Maps Flutter (already in pubspec)

| Pro | Con |
|-----|-----|
| Native rendering, best performance | Requires API key + billing account |
| Smooth zoom/pan/gestures | iOS Swift Package Manager warning already showing |
| Rich marker customization | Not consistent with web (Leaflet) |

### Option B: Flutter Map + OpenStreetMap ✅ **RECOMMENDED**

| Pro | Con |
|-----|-----|
| Free, no API key needed | Slightly less smooth than native Google Maps |
| Matches web's Leaflet/CartoDB stack | Tile caching needs manual config |
| `flutter_map` + `flutter_map_marker_cluster` | Extra dependency |
| Dark mode tiles via CartoDB URL swap | — |
| Easy migration from Leaflet conventions | — |

### Option C: Mapbox GL Flutter

| Pro | Con |
|-----|-----|
| Beautiful vector tiles | Requires Mapbox token (paid at scale) |
| Best visual quality | Heavier SDK, longer cold start |
| 3D terrain support | Overkill for court markers |

**Decision:** **Option B** — `flutter_map` with OpenStreetMap. Matches web stack, free, no API key friction, dark mode tile swap pattern already proven in web code.

---

## Architecture Design

### Data Model Changes

```dart
// Extended SessionModel — add court + geo data to match backend
@freezed
class SessionModel {
  const factory SessionModel({
    required String id,
    required String title,
    required DateTime startTime,
    required DateTime endTime,
    required String courtName,
    required int maxPlayers,
    required int bookedPlayers,
    required double price,
    required String requiredSkill,
    // NEW fields ↓
    String? courtId,
    String? district,
    double? latitude,
    double? longitude,
    String? description,
    String? hostName,
  }) = _SessionModel;
}
```

### Filter Model

```dart
@freezed
class SessionFilter {
  const factory SessionFilter({
    @Default('') String query,           // text search
    @Default('') String district,        // district dropdown
    @Default('') String skill,           // skill level
    @Default(null) double? minPrice,     // price range min
    @Default(null) double? maxPrice,     // price range max
    @Default(null) DateTime? dateFrom,   // time window
    @Default(null) DateTime? dateTo,
    @Default(null) double? nearLat,      // GPS "near me"
    @Default(null) double? nearLng,
    @Default(null) double? radiusKm,     // search radius
  }) = _SessionFilter;
}
```

### Bloc Architecture

```
SessionBloc (enhanced)
├── LoadSessions(filter: SessionFilter)   → fetch from API with query params
├── UpdateFilter(SessionFilter)           → re-fetch or client-side filter
├── LocateUser()                          → get GPS, update filter.nearLat/Lng
│
├── State: SessionState
│   ├── initial
│   ├── loading
│   ├── loaded(sessions, filter, userLocation?)
│   └── error
```

### UI Architecture (Split View — Google Maps style)

```
SessionMapPage (new)
├── SliverAppBar + filter chips row (scrollable horizontal)
├── Map area (40% height, flutter_map with markers)
│   ├── Markers with BELo gold/orange custom icons
│   ├── Marker clusters (flutter_map_marker_cluster)
│   └── "Near me" button overlay
├── DraggableScrollableSheet (bottom 60%)
│   ├── Drag handle
│   ├── Session cards (existing SessionCard widget)
│   └── Pull-to-refresh
├── Filter bottom sheet (full filter form)
│   ├── Search text field
│   ├── District dropdown (HCMC districts)
│   ├── Skill level chips
│   ├── Price range slider
│   ├── Date/time picker
│   ├── "Near me" toggle + radius slider
│   └── Apply / Clear buttons
```

### File Plan

```
lib/features/session/
├── data/
│   ├── models/
│   │   ├── session_model.dart          [MODIFY] — add geo fields
│   │   └── session_filter.dart         [NEW] — filter model
│   └── repositories/
│       └── session_repository.dart     [NEW] — API integration
├── presentation/
│   ├── bloc/
│   │   ├── session_bloc.dart           [MODIFY] — add filter events
│   │   ├── session_event.dart          [MODIFY] — add filter events
│   │   └── session_state.dart          [MODIFY] — add filter + location
│   ├── pages/
│   │   └── session_map_page.dart       [NEW] — split map view
│   └── widgets/
│       ├── session_map_view.dart       [NEW] — flutter_map widget
│       ├── session_filter_sheet.dart   [NEW] — bottom sheet filter form
│       ├── session_filter_chips.dart   [NEW] — horizontal chip row
│       └── session_marker.dart         [NEW] — custom BELo map marker
```

### Dependencies

| Package | Purpose |
|---------|---------|
| `flutter_map` | OSM map widget |
| `flutter_map_marker_cluster` | Marker clustering |
| `latlong2` | Coordinate calculations |
| `geolocator` | GPS location |
| `permission_handler` | Location permission |

---

## Implementation Risks

| Risk | Mitigation |
|------|-----------|
| Backend API not running | Keep mock data fallback in bloc |
| GPS permission denied | Graceful degradation, hide "near me" |
| Too many markers (100+) | Marker clustering + viewport-based loading |
| `SessionModel.freezed.dart` regeneration | Run `build_runner` after model changes |
| `google_maps_flutter` conflict | Remove from pubspec (unused, causing iOS warnings) |

## Success Criteria

1. Map shows court markers with session count badges
2. Filters reduce both map markers AND card list simultaneously
3. Tapping marker scrolls to corresponding card
4. "Near me" centers map + sorts cards by distance
5. Filter state persists across list↔map navigation
6. Dark mode tiles match web's CartoDB dark theme
7. < 200 lines per file (modular)

---

## Next Steps

→ Create detailed implementation plan with phases + task checklist?
