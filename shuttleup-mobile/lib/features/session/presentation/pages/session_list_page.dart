import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../app/di/injection.dart';
import '../bloc/session_bloc.dart';
import '../bloc/session_event.dart';
import '../bloc/session_state.dart';
import '../widgets/session_card.dart';
import 'package:go_router/go_router.dart';

class SessionListPage extends StatelessWidget {
  const SessionListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<SessionBloc>()..add(const SessionEvent.loadSessions()),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Find a Session'),
          actions: [
            IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
            Builder(
              builder: (ctx) => IconButton(
                icon: const Icon(Icons.person), 
                onPressed: () => ctx.push('/login'),
              ),
            ),
          ]
        ),
        body: BlocBuilder<SessionBloc, SessionState>(
          builder: (context, state) {
            return state.when(
              initial: () => const Center(child: CircularProgressIndicator()),
              loading: () => const Center(child: CircularProgressIndicator()),
              loaded: (sessions) {
                return RefreshIndicator(
                  onRefresh: () async {
                    context.read<SessionBloc>().add(const SessionEvent.loadSessions());
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: sessions.length,
                    itemBuilder: (context, index) {
                      return SessionCard(session: sessions[index]);
                    },
                  ),
                );
              },
              error: (message) => Center(child: Text('Error: $message')),
            );
          },
        ),
      ),
    );
  }
}
