# ShuttleUp Mobile — Code Standards

> Extends `../docs/code-standards.md` (Flutter section). This file covers mobile-specific rules.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | snake_case | `session_detail_page.dart` |
| Classes | PascalCase | `SessionDetailPage` |
| Variables/Functions | camelCase | `loadSessions()` |
| Constants | lowerCamelCase | `defaultTimeout` |
| BLoC Events | factory constructors | `SessionEvent.loadSessions()` |
| BLoC States | factory constructors | `SessionState.loaded(data)` |

## File Organization

### Feature Module Template

```
features/<name>/
├── data/
│   ├── models/<name>_model.dart         # @freezed sealed class
│   ├── datasources/<name>_remote.dart   # API calls via Dio
│   └── repositories/<name>_repo.dart    # Repository implementation
├── presentation/
│   ├── bloc/<name>_bloc.dart            # @injectable BLoC
│   ├── bloc/<name>_event.dart           # @freezed sealed class
│   ├── bloc/<name>_state.dart           # @freezed sealed class
│   ├── pages/<name>_page.dart           # Full screen widget
│   └── widgets/<name>_card.dart         # Reusable sub-widgets
```

### File Size

- Target: **≤200 lines** per file
- Extract sub-widgets when page exceeds limit
- Separate BLoC event/state/bloc into 3 files (never combine)

## Freezed Models

Always use `sealed class` (Freezed v3 requirement):

```dart
@freezed
sealed class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String name,
    required String email,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
```

After any model change: `dart run build_runner build --delete-conflicting-outputs`

## Widget Guidelines

- **Prefer composition** over inheritance — build complex UIs from small widgets
- **Use `const` constructors** wherever possible for performance
- **Avoid deeply nested widgets** — extract into named methods or sub-widgets
- **No business logic in widgets** — delegate to BLoC

```dart
// ✅ CORRECT — stateless with const
class SessionCard extends StatelessWidget {
  final SessionModel session;
  const SessionCard({super.key, required this.session});
  // ...
}

// ❌ WRONG — StatefulWidget for simple display
class SessionCard extends StatefulWidget { ... }
```

## Dependency Injection (MANDATORY)

**ALWAYS** use GetIt + Injectable. Never instantiate services/BLoCs/repos manually.

```dart
// ✅ CORRECT — annotate + inject via constructor
@injectable
class SessionBloc extends Bloc<SessionEvent, SessionState> {
  final SessionRepository _repository;
  SessionBloc(this._repository) : super(const SessionState.initial());
}

@singleton
class SessionRepository {
  final ApiClient _api;
  SessionRepository(this._api);
}

// ✅ CORRECT — resolve from GetIt in widget tree
BlocProvider(create: (_) => getIt<SessionBloc>())

// ❌ WRONG — manual instantiation
final bloc = SessionBloc(SessionRepository(ApiClient()));
```

**After adding any `@injectable` / `@singleton`:**
```bash
dart run build_runner build --delete-conflicting-outputs
```

## Import Ordering

1. Dart SDK (`dart:`)
2. Flutter SDK (`package:flutter/`)
3. Third-party packages (`package:dio/`, `package:flutter_bloc/`, `package:intl/`, …)
4. Internal app imports — **MUST use absolute `package:shuttleup_mobile/` style** (never relative `../`)

### Feature Barrel Files

Each feature exposes a barrel file (`{feature}.dart`) at its root as its **public API**.  
Use the barrel when importing cross-feature. Use direct paths only for intra-feature imports.

```
features/
├── auth/auth.dart           ← exports: AuthPage
├── booking/booking.dart     ← exports: GuestBookingPage
├── dashboard/dashboard.dart ← exports: DashboardPage
├── profile/profile.dart     ← exports: ProfilePage
└── session/session.dart     ← exports: SessionModel, SessionListPage, SessionDetailPage
```

```dart
// ✅ CORRECT — cross-feature: use barrel
import 'package:shuttleup_mobile/features/session/session.dart';
import 'package:shuttleup_mobile/features/auth/auth.dart';

// ✅ CORRECT — intra-feature: direct path ok
import 'package:shuttleup_mobile/features/session/data/models/session_model.dart';

// ❌ WRONG — cross-feature with deep path
import 'package:shuttleup_mobile/features/session/presentation/pages/session_list_page.dart';

// ❌ WRONG — relative path
import '../../../../app/routes.dart';
```

**Rule:** When adding a new public file to a feature, add it to that feature's barrel file.

## Error Handling

```dart
// In BLoC — catch and emit error state
try {
  final data = await repository.fetchSessions();
  emit(SessionState.loaded(data));
} catch (error) {
  emit(SessionState.error(error.toString()));
}

// In DataSource — let DioException propagate or wrap
Future<List<SessionModel>> fetchSessions() async {
  final response = await _dio.get('/sessions');
  return (response.data as List)
      .map((json) => SessionModel.fromJson(json))
      .toList();
}
```

## Testing

- Test files: `test/` directory, mirroring `lib/` structure
- Unit test BLoCs with `bloc_test` package
- Widget tests for critical UI components
- Run: `flutter test`

## Routing

Use `go_router_builder` generated route classes — **never** string-based navigation.

```dart
// ✅ CORRECT — type-safe, compile-time checked
SessionDetailRoute(id: session.id, $extra: session).push(context);
const DashboardRoute().go(context);
const SessionListRoute().go(context);

// ❌ WRONG — runtime crash risk, no IDE support
context.push('/sessions/${session.id}', extra: session);
context.go('/dashboard');
```

**Rules:**
- All route classes live in `lib/app/routes.dart` with `@TypedGoRoute` annotations
- Each class uses `with $ClassName` mixin (generated by build_runner)
- The `$extra` field name is special — go_router_builder maps it to `GoRouterState.extra`
- Path params (`:id`) must match the constructor field name exactly
- `routes.g.dart` is auto-generated — **do NOT edit manually**

**After adding or changing routes:**
```bash
dart run build_runner build --delete-conflicting-outputs
```

