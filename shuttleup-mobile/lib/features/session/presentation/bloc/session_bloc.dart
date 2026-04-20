import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'session_event.dart';
import 'session_state.dart';
import '../../data/models/session_model.dart';

@injectable
class SessionBloc extends Bloc<SessionEvent, SessionState> {
  SessionBloc() : super(const SessionState.initial()) {
    on<SessionEvent>((event, emit) async {
      await event.map(
        loadSessions: (e) async {
          emit(const SessionState.loading());
          try {
            // Mock API delay
            await Future.delayed(const Duration(seconds: 1));
            
            // Mock data
            final mockSessions = [
              SessionModel(
                id: '1',
                title: 'Weekend Smash District 7',
                startTime: DateTime.now().add(const Duration(days: 1)),
                endTime: DateTime.now().add(const Duration(days: 1, hours: 2)),
                courtName: 'City Hall Courts',
                maxPlayers: 8,
                bookedPlayers: 2,
                price: 50000,
                requiredSkill: 'INTERMEDIATE',
              ),
              SessionModel(
                id: '2',
                title: 'Chill Sunday Morning',
                startTime: DateTime.now().add(const Duration(days: 2)),
                endTime: DateTime.now().add(const Duration(days: 2, hours: 2)),
                courtName: 'Lam Son Court',
                maxPlayers: 6,
                bookedPlayers: 6,
                price: 45000,
                requiredSkill: 'ALL',
              ),
            ];
            
            emit(SessionState.loaded(mockSessions));
          } catch (error) {
            emit(SessionState.error(error.toString()));
          }
        },
      );
    });
  }
}
