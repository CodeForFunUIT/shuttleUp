# ShuttleUp Mobile — Agent Instructions

## Context

Flutter mobile app for ShuttleUp — a badminton session booking platform.
Part of a monorepo: `shuttleup-api` (NestJS) + `shuttleup-web` (Next.js) + `shuttleup-mobile` (Flutter).

**Shared docs:** `../docs/` — code standards, system architecture, design guidelines.

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Flutter 3.38.5 (Dart 3.10.4) |
| State Management | flutter_bloc 9.1 (BLoC pattern) |
| DI | GetIt 9.2 + Injectable 2.7 |
| HTTP | Dio 5.9 with interceptors |
| Navigation | GoRouter 17.2 |
| Models | Freezed 3.2 + json_serializable |
| Maps | google_maps_flutter 2.17 |
| Notifications | Firebase Messaging 16.2 |

## Commands

```bash
C:\flutter\bin\flutter.bat analyze          # Static analysis (lint)
C:\flutter\bin\flutter.bat test             # Unit tests
C:\flutter\bin\flutter.bat run              # Run on device/emulator
dart run build_runner build --delete-conflicting-outputs  # Regenerate Freezed/Injectable
```

> ⚠️ `flutter` is NOT in PATH. Always use full path: `C:\flutter\bin\flutter.bat`

## Architecture Pattern

Feature-first + BLoC. Each feature follows:

```
features/<feature>/
├── data/
│   ├── models/        # Freezed data classes
│   ├── datasources/   # Remote/local data sources
│   └── repositories/  # Repository implementations
├── presentation/
│   ├── bloc/          # BLoC (event, state, bloc)
│   ├── pages/         # Full-screen widgets
│   └── widgets/       # Reusable UI components
```

## Critical Gotchas

### Freezed v3 requires `sealed class`

```dart
// ✅ CORRECT — Freezed v3 mixin pattern
@freezed
sealed class SessionModel with _$SessionModel { ... }

// ❌ WRONG — will cause "Missing concrete implementations" error
@freezed
class SessionModel with _$SessionModel { ... }
```

### After editing any `@freezed` or `@injectable` class

Always regenerate: `dart run build_runner build --delete-conflicting-outputs`

### API Base URL

- Android Emulator: `http://10.0.2.2:3000/api`
- iOS Simulator: `http://127.0.0.1:3000/api`
- Configured in `lib/core/di/core_module.dart`

## Forbidden Patterns

- ❌ `setState()` for state management — use BLoC
- ❌ Raw `http` package — use Dio via `ApiClient`
- ❌ Manual DI registration — use `@injectable` / `@singleton` annotations
- ❌ `class` (non-sealed) with Freezed v3 `@freezed` annotation
- ❌ Hardcoded strings for routes — define in `app/routes.dart`
- ❌ **Direct instantiation** of services, BLoCs, or repositories — ALWAYS inject via constructor

## Dependency Injection Rules (MANDATORY)

**ALWAYS** use GetIt + Injectable for dependency management. Never create instances manually.

```dart
// ✅ CORRECT — inject via constructor, GetIt resolves automatically
@injectable
class SessionBloc extends Bloc<SessionEvent, SessionState> {
  final SessionRepository _repository;
  SessionBloc(this._repository) : super(const SessionState.initial());
}

// ✅ CORRECT — retrieve from GetIt in UI
BlocProvider(create: (_) => getIt<SessionBloc>())

// ❌ WRONG — manual instantiation bypasses DI
BlocProvider(create: (_) => SessionBloc(SessionRepository(ApiClient())))

// ❌ WRONG — creating service inline
final api = ApiClient();  // Should be: getIt<ApiClient>()
```

### Annotation Cheat Sheet

| Annotation | When to Use |
|-----------|-------------|
| `@injectable` | BLoCs, ViewModels — new instance per request |
| `@singleton` | ApiClient, repositories — one instance forever |
| `@lazySingleton` | Heavy services — created on first use |
| `@module` | 3rd-party deps (Dio, SharedPrefs, Logger) |

### DI Entry Point

- File: `lib/app/di/injection.dart`
- Called in `main()`: `configureDependencies()`
- After adding new `@injectable`/`@singleton`: run `dart run build_runner build --delete-conflicting-outputs`

## Git Convention

```
<type>(mobile): <description>
Types: feat, fix, docs, refactor, test, chore
```
