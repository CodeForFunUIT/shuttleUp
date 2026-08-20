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

## Critical Gotchas & Safety Rules

### Freezed v3 requires `sealed class`

```dart
// ✅ CORRECT — Freezed v3 mixin pattern
@freezed
sealed class SessionModel with _$SessionModel { ... }

// ❌ WRONG — will cause "Missing concrete implementations" error
@freezed
class SessionModel with _$SessionModel { ... }
```

### Async `BuildContext` Safety (MANDATORY)

Never use `BuildContext` across async gaps without checking `mounted`:

```dart
// ✅ CORRECT — check mounted after await
final result = await getIt<AuthRepository>().login(credentials);
if (!context.mounted) return;
context.go('/dashboard');

// ❌ WRONG — unsafe BuildContext usage after async operation
final result = await getIt<AuthRepository>().login(credentials);
Navigator.of(context).pushNamed('/dashboard');
```

### File Size & Modularization

- **Strict Limit**: Keep every Dart file under 200 lines.
- **Widgets**: Extract sub-components into `features/<feature>/presentation/widgets/`.
- **Composition**: Prefer composing small StatelessWidgets with `const` constructors over deep single widget trees.

### Performance & Clean Code Checklist

- Use `const` constructors everywhere applicable (`prefer_const_constructors`).
- Use `const SizedBox(height: 16)` instead of `Container(height: 16)`.
- Never put API calls or repository calls inside widget `build()` methods.
- Free up resources in `close()` (BLoCs) or `dispose()` (Controllers/Subscriptions).

### After editing any `@freezed` or `@injectable` class

Always regenerate: `dart run build_runner build --delete-conflicting-outputs`

### API Base URL

- Android Emulator: `http://10.0.2.2:3000/api`
- iOS Simulator: `http://127.0.0.1:3000/api`
- Configured in `lib/core/di/core_module.dart`

## Forbidden Patterns

- ❌ `setState()` for business/app state — use BLoC
- ❌ Raw `http` package — use Dio via `ApiClient`
- ❌ Manual DI registration — use `@injectable` / `@singleton` annotations
- ❌ `class` (non-sealed) with Freezed v3 `@freezed` annotation
- ❌ Hardcoded strings for routes — define in `app/routes.dart`
- ❌ **Direct instantiation** of services, BLoCs, or repositories — ALWAYS inject via constructor
- ❌ Using `BuildContext` after `await` without `if (!context.mounted) return;`
- ❌ Files exceeding 200 lines of code — split into focused sub-widgets/helpers

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

