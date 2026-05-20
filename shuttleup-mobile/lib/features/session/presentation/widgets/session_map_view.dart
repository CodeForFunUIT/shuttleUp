import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../data/models/session_model.dart';
import 'session_marker.dart';

/// HCMC center coordinates.
const _hcmcCenter = LatLng(10.762622, 106.660172);

/// CartoDB tile URLs (matches web's Leaflet stack).
const _tileLightUrl =
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const _tileDarkUrl =
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

/// Map widget showing session locations with BELo-styled markers.
///
/// Features:
/// - CartoDB light/dark tile swap
/// - Custom gold markers with session count
/// - "Near me" FAB overlay
/// - Marker tap callback
class SessionMapView extends StatefulWidget {
  final List<SessionModel> sessions;
  final LatLng? userLocation;
  final ValueChanged<SessionModel>? onMarkerTap;
  final VoidCallback? onNearMeTap;

  const SessionMapView({
    super.key,
    required this.sessions,
    this.userLocation,
    this.onMarkerTap,
    this.onNearMeTap,
  });

  @override
  State<SessionMapView> createState() => _SessionMapViewState();
}

class _SessionMapViewState extends State<SessionMapView> {
  late final MapController _mapController;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant SessionMapView oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Fly to user location when it becomes available
    if (widget.userLocation != null && oldWidget.userLocation == null) {
      _mapController.move(widget.userLocation!, 14);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Stack(
      children: [
        FlutterMap(
          mapController: _mapController,
          options: MapOptions(
            initialCenter: widget.userLocation ?? _hcmcCenter,
            initialZoom: 13,
            minZoom: 10,
            maxZoom: 18,
            interactionOptions: const InteractionOptions(
              flags: InteractiveFlag.all,
            ),
          ),
          children: [
            // ── Tile layer (light/dark) ──
            TileLayer(
              urlTemplate: isDark ? _tileDarkUrl : _tileLightUrl,
              subdomains: const ['a', 'b', 'c', 'd'],
              userAgentPackageName: 'com.shuttleup.shuttleup_mobile',
              retinaMode: true,
            ),

            // ── Session markers ──
            MarkerLayer(
              markers: _buildMarkers(),
            ),

            // ── User location marker ──
            if (widget.userLocation != null)
              MarkerLayer(
                markers: [
                  Marker(
                    point: widget.userLocation!,
                    width: 24,
                    height: 24,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.blue.withValues(alpha: 0.3),
                            blurRadius: 8,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),

        // ── "Near me" FAB ──
        Positioned(
          right: AppSpacing.md,
          bottom: AppSpacing.md,
          child: FloatingActionButton.small(
            heroTag: 'near_me_fab',
            onPressed: widget.onNearMeTap,
            backgroundColor: Theme.of(context).colorScheme.surface,
            child: Icon(
              Icons.my_location_rounded,
              color: AppColors.shuttleGold,
              size: 20,
            ),
          ),
        ),
      ],
    );
  }

  List<Marker> _buildMarkers() {
    // Group sessions by court
    final courtGroups = <String, List<SessionModel>>{};
    for (final session in widget.sessions) {
      if (session.latitude == null || session.longitude == null) continue;
      final key = session.courtId ?? '${session.latitude}_${session.longitude}';
      courtGroups.putIfAbsent(key, () => []).add(session);
    }

    return courtGroups.entries.map((entry) {
      final sessions = entry.value;
      final first = sessions.first;

      return Marker(
        point: LatLng(first.latitude!, first.longitude!),
        width: 44,
        height: 52,
        child: SessionMarker(
          courtName: first.courtName,
          sessionCount: sessions.length,
          onTap: () => widget.onMarkerTap?.call(first),
        ),
      );
    }).toList();
  }
}
