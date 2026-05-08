# ShuttleUp Mobile — Architecture

## Layer Diagram

```
┌─────────────────────────────────────────┐
│            Presentation Layer            │
│  Pages → Widgets → BLoC (Event/State)   │
└──────────────────┬──────────────────────┘
                   │ emits states
┌──────────────────▼──────────────────────┐
│             Domain Layer                 │
│      Repositories (abstractions)         │
└──────────────────┬──────────────────────┘
                   │ calls
┌──────────────────▼──────────────────────┐
│              Data Layer                  │
│  DataSources → ApiClient (Dio) → API    │
│  Models (Freezed) → JSON serialization  │
└─────────────────────────────────────────┘
```

## BLoC Pattern

Each feature's BLoC follows this flow:

```
UI dispatches Event → BLoC processes → emits State → UI rebuilds
```

### Event (Freezed sealed class)
```dart
@freezed
sealed class SessionEvent with _$SessionEvent {
  const factory SessionEvent.loadSessions({String? query}) = _LoadSessions;
  const factory SessionEvent.refresh() = _Refresh;
}
```

### State (Freezed sealed class)
```dart
@freezed
sealed class SessionState with _$SessionState {
  const factory SessionState.initial() = _Initial;
  const factory SessionState.loading() = _Loading;
  const factory SessionState.loaded(List<SessionModel> sessions) = _Loaded;
  const factory SessionState.error(String message) = _Error;
}
```

### BLoC (Injectable)
```dart
@injectable
class SessionBloc extends Bloc<SessionEvent, SessionState> {
  final SessionRepository _repository;
  SessionBloc(this._repository) : super(const SessionState.initial()) {
    on<SessionEvent>((event, emit) async {
      await event.map(
        loadSessions: (e) async { /* handle */ },
      );
    });
  }
}
```

## Dependency Injection

Uses **GetIt + Injectable** for compile-time safe DI.

| Annotation | Scope | Use Case |
|-----------|-------|----------|
| `@injectable` | New instance per request | BLoCs, ViewModels |
| `@singleton` | Single instance forever | ApiClient, repositories |
| `@lazySingleton` | Singleton, created on first use | Logger, Dio |
| `@module` | Abstract class providing 3rd-party deps | CoreModule (Dio, SharedPrefs) |

Registration: `lib/app/di/injection.dart` → `configureDependencies()` called in `main()`.

## Navigation (GoRouter)

Defined in `lib/app/routes.dart`. Patterns:

```dart
// Simple route
GoRoute(path: '/login', builder: (_, __) => const AuthPage())

// Route with data via extra
GoRoute(
  path: '/sessions/:id',
  builder: (_, state) {
    final session = state.extra as SessionModel;
    return SessionDetailPage(session: session);
  },
)
```

Navigate: `context.push('/sessions/$id', extra: session)`

## Theme

Material 3 with Emerald palette (synced with web):
- Primary: `#059669` (Emerald 600)
- Secondary: `#10B981` (Emerald 500)
- Surface: White
- Defined in `lib/core/theme/app_theme.dart`
