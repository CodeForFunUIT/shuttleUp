# Phase 5 — Mobile App (Flutter)

## Priority: 🟢 Medium (parallel with Phase 4)

## Overview

Flutter app using Bloc + GetIt (DI), mirroring all web flows. FCM push notifications.

## Architecture

```
lib/
├── main.dart
├── app/
│   ├── app.dart                    ← MaterialApp + routing
│   └── di/
│       └── injection_container.dart ← GetIt registration
├── core/
│   ├── api/                        ← Dio client + interceptors
│   ├── theme/                      ← Colors, typography, spacings
│   ├── constants/
│   └── utils/
├── features/
│   ├── session/
│   │   ├── data/                   ← Repository, models, DTOs
│   │   ├── domain/                 ← Entities, use cases
│   │   └── presentation/
│   │       ├── bloc/               ← SessionBloc, events, states
│   │       ├── pages/              ← SessionListPage, SessionDetailPage
│   │       └── widgets/            ← SessionCard, FilterSheet
│   ├── booking/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── profile/
│   └── notification/
└── shared/
    └── widgets/                    ← Common widgets
```

## Implementation Steps

1. Project setup + GetIt DI container
2. Dio API client with auth interceptor
3. Core theme matching web design system
4. Session list + search/filter
5. Session detail + booking flow (guest)
6. Auth flow (host login/register)
7. Host dashboard
8. Profile + ELO display
9. FCM push notification setup
10. Local notifications

## Todo

- [ ] Project structure + DI setup
- [ ] API client (Dio + interceptors)
- [ ] Theme + design system
- [ ] Session list + search
- [ ] Session detail + booking
- [ ] Guest booking form
- [ ] Auth flow (Better Auth)
- [ ] Host dashboard
- [ ] Profile page
- [ ] FCM setup
- [ ] Local notifications

## Success Criteria

- Full flow works: search → detail → book (guest)
- Host can create + manage sessions
- Push notifications received on device
- UI matches web design system
- Smooth 60fps scrolling
