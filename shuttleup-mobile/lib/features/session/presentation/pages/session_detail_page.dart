import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shuttleup_mobile/app/routes.dart';
import 'package:shuttleup_mobile/features/session/data/models/session_model.dart';

class SessionDetailPage extends StatelessWidget {
  final SessionModel session;

  const SessionDetailPage({super.key, required this.session});

  @override
  Widget build(BuildContext context) {
    final bool isFull = session.bookedPlayers >= session.maxPlayers;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Session Details'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              session.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Card(
              elevation: 0,
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildInfoRow(
                      Icons.access_time, 
                      'Time', 
                      '${DateFormat('E, MMM d').format(session.startTime)} • ${DateFormat('HH:mm').format(session.startTime)} - ${DateFormat('HH:mm').format(session.endTime)}'
                    ),
                    const Divider(height: 24),
                    _buildInfoRow(
                      Icons.location_on_outlined, 
                      'Court', 
                      session.courtName
                    ),
                    const Divider(height: 24),
                    _buildInfoRow(
                      Icons.attach_money, 
                      'Price', 
                      '${NumberFormat.currency(locale: 'vi_VN', symbol: '₫').format(session.price)} / slot'
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Requirements',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildBadge('Skill: ${session.requiredSkill}', Colors.blue.shade700),
                const SizedBox(width: 8),
                _buildBadge('${session.bookedPlayers}/${session.maxPlayers} Players', isFull ? Colors.red : Colors.green),
              ],
            ),
            const SizedBox(height: 32),
            const Text(
              'About Host',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: Color(0xFFD1FAE5),
                foregroundColor: Color(0xFF047857),
                child: Text('MT'),
              ),
              title: Text('Minh Tran', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('ELO: 1450 • Advanced'),
            )
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: isFull ? null : () {
              GuestBookingRoute(id: session.id, $extra: session).push<void>(context);
            },
            child: Text(isFull ? 'Session Full' : 'Book a Slot'),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Colors.grey, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 15)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBadge(String text, [Color color = Colors.grey]) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.5)),
      ),
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
    );
  }
}
