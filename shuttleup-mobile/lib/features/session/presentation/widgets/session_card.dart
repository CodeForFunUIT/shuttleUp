import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shuttleup_mobile/app/routes.dart';
import 'package:shuttleup_mobile/features/session/data/models/session_model.dart';

class SessionCard extends StatelessWidget {
  final SessionModel session;

  const SessionCard({super.key, required this.session});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final bool isFull = session.bookedPlayers >= session.maxPlayers;
    final bool isUrgent = !isFull && (session.maxPlayers - session.bookedPlayers <= 2);
    final double progress = session.maxPlayers > 0
        ? (session.bookedPlayers / session.maxPlayers).clamp(0.0, 1.0)
        : 0.0;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: isDark ? 0 : 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isDark ? const Color(0x1FFFFFFF) : const Color(0x140B0E14),
        ),
      ),
      child: InkWell(
        onTap: () {
          SessionDetailRoute(id: session.id, $extra: session).push<void>(context);
        },
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title & Status Chip
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      session.title,
                      style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isFull
                          ? const Color(0x28EF4444)
                          : isUrgent
                              ? const Color(0x28FF6B35)
                              : const Color(0x28F5C842),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isFull
                            ? const Color(0x4DEF4444)
                            : isUrgent
                                ? const Color(0x4DFF6B35)
                                : const Color(0x4DF5C842),
                      ),
                    ),
                    child: Text(
                      isFull ? 'FULL' : '${session.bookedPlayers}/${session.maxPlayers} SLOTS',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: isFull
                            ? const Color(0xFFEF4444)
                            : isUrgent
                                ? const Color(0xFFFF6B35)
                                : isDark
                                    ? const Color(0xFFF5C842)
                                    : const Color(0xFFB48200),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Slot Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: progress,
                  minHeight: 4,
                  backgroundColor: isDark ? const Color(0x1FFFFFFF) : const Color(0x14000000),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    isFull
                        ? const Color(0xFFEF4444)
                        : isUrgent
                            ? const Color(0xFFFF6B35)
                            : const Color(0xFFF5C842),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Date & Time
              Row(
                children: [
                  const Icon(Icons.access_time_rounded, size: 15, color: Colors.grey),
                  const SizedBox(width: 6),
                  Text(
                    '${DateFormat('E, d MMM').format(session.startTime)} • ${DateFormat('HH:mm').format(session.startTime)}',
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? const Color(0xFF8B9BB4) : const Color(0xFF5A6A80),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),

              // Court Location
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 15, color: Colors.grey),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      session.courtName,
                      style: TextStyle(
                        fontSize: 13,
                        color: isDark ? const Color(0xFF8B9BB4) : const Color(0xFF5A6A80),
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Divider(height: 1, thickness: 0.6),
              const SizedBox(height: 12),

              // Footer: Skill & Price
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0x14FFFFFF) : const Color(0x0A000000),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isDark ? const Color(0x1FFFFFFF) : const Color(0x14000000),
                      ),
                    ),
                    child: Text(
                      session.requiredSkill,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isDark ? const Color(0xFFF0F4F8) : const Color(0xFF0B0E14),
                      ),
                    ),
                  ),
                  Text(
                    '${NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(session.price)}/slot',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 15,
                      color: isDark ? const Color(0xFFF5C842) : const Color(0xFFB48200),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

