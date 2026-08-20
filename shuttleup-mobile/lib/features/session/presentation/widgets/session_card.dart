import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shuttleup_mobile/app/routes.dart';
import 'package:shuttleup_mobile/features/session/data/models/session_model.dart';

class SessionCard extends StatelessWidget {
  final SessionModel session;

  const SessionCard({super.key, required this.session});

  @override
  Widget build(BuildContext context) {
    final bool isFull = session.bookedPlayers >= session.maxPlayers;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () {
          SessionDetailRoute(id: session.id, $extra: session).push<void>(context);
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      session.title,
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isFull ? Colors.red.shade100 : Colors.green.shade100,
                      borderRadius: BorderRadius.circular(16)
                    ),
                    child: Text(
                      isFull ? 'FULL' : '${session.bookedPlayers}/${session.maxPlayers}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isFull ? Colors.red.shade800 : Colors.green.shade800,
                      )
                    )
                  )
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.access_time, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    '${DateFormat('E, MMM d').format(session.startTime)} • ${DateFormat('HH:mm').format(session.startTime)}',
                    style: const TextStyle(color: Colors.grey),
                  )
                ]
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    session.courtName,
                    style: const TextStyle(color: Colors.grey),
                  )
                ]
              ),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(4)
                    ),
                    child: Text(
                      session.requiredSkill,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)
                    )
                  ),
                  Text(
                    '${NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(session.price)}/slot',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
