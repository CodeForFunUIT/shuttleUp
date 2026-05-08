# 🏸 ShuttleUp Mobile

Flutter mobile app for the ShuttleUp badminton session booking platform.

## Prerequisites

- **Flutter SDK** 3.38+ (Dart 3.10+)
- **Android Studio** or **Xcode** for emulators
- **ShuttleUp API** running locally (`shuttleup-api` on port 3000)
- **Docker** for PostgreSQL + Redis (see `../docker-compose.yml`)

## Getting Started

```bash
# 1. Start backend services
cd ..
docker compose up -d
cd shuttleup-api && npm run start:dev

# 2. Install dependencies
cd ../shuttleup-mobile
flutter pub get

# 3. Generate code (Freezed + Injectable)
dart run build_runner build --delete-conflicting-outputs

# 4. Run app
flutter run
```

## Available Commands

| Command | Purpose |
|---------|---------|
| `flutter pub get` | Install dependencies |
| `flutter run` | Run on connected device/emulator |
| `flutter analyze` | Static analysis (lint) |
| `flutter test` | Run unit & widget tests |
| `dart run build_runner build --delete-conflicting-outputs` | Regenerate Freezed/Injectable code |

## Project Structure

```
lib/
├── main.dart           # Entry point
├── app/                # App config (router, DI, MaterialApp)
├── core/               # Shared: API client, theme, services
└── features/           # Feature modules (auth, session, booking, etc.)
    └── <feature>/
        ├── data/       # Models, datasources, repositories
        └── presentation/
            ├── bloc/   # State management
            ├── pages/  # Full-screen widgets
            └── widgets/# Reusable components
```

## Tech Stack

- **State:** flutter_bloc (BLoC pattern)
- **DI:** GetIt + Injectable
- **HTTP:** Dio with auth interceptors
- **Navigation:** GoRouter
- **Models:** Freezed + json_serializable
- **Theme:** Material 3 — Emerald palette (#059669)

## Documentation

- [Architecture](docs/architecture.md) — Layers, BLoC, DI, navigation
- [Code Standards](docs/code-standards.md) — Naming, patterns, rules
- [Codebase Summary](docs/codebase-summary.md) — File tree, feature status
- [Monorepo Docs](../docs/) — Shared code standards, system architecture

## Environment

| Platform | API Base URL |
|----------|-------------|
| Android Emulator | `http://10.0.2.2:3000/api` |
| iOS Simulator | `http://127.0.0.1:3000/api` |
| Physical device | `http://<your-local-ip>:3000/api` |

Configured in `lib/core/di/core_module.dart`.
