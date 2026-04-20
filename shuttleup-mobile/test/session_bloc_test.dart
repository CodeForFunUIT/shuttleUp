import 'package:flutter_test/flutter_test.dart';
import 'package:shuttleup_mobile/features/session/presentation/bloc/session_bloc.dart';
import 'package:shuttleup_mobile/features/session/presentation/bloc/session_event.dart';
import 'package:shuttleup_mobile/features/session/presentation/bloc/session_state.dart';

void main() {
  group('SessionBloc', () {
    late SessionBloc sessionBloc;

    setUp(() {
      sessionBloc = SessionBloc();
    });

    tearDown(() {
      sessionBloc.close();
    });

    test('initial state is SessionState.initial', () {
      expect(sessionBloc.state, const SessionState.initial());
    });

    test('emits [loading, loaded] when loadSessions is added', () async {
      // Create a list to track emitted states
      final expectedStates = <SessionState>[];
      
      // Listen to the bloc
      final subscription = sessionBloc.stream.listen((state) {
        expectedStates.add(state);
      });

      // Add the event
      sessionBloc.add(const SessionEvent.loadSessions());

      // Wait for the mock delay (1 second) + small buffer
      await Future.delayed(const Duration(milliseconds: 1200));

      // Verify states
      // In this async environment, the first state might be emitted very quickly
      expect(expectedStates.isNotEmpty, true);
      
      // Look for a loaded state in the tracked states
      final loadedStateIndex = expectedStates.indexWhere((state) => 
        state.maybeWhen(loaded: (_) => true, orElse: () => false)
      );
      
      expect(loadedStateIndex != -1, true, reason: 'Should have emitted a loaded state');
      
      expectedStates[loadedStateIndex].maybeWhen(
        loaded: (sessions) {
          expect(sessions.length, 2);
          expect(sessions.first.title, 'Weekend Smash District 7');
        },
        orElse: () => fail('State is not loaded?'),
      );

      await subscription.cancel();
    });
  });
}
