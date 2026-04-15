# Phase 1 — Backend Core Modules

## Priority: 🔴 Critical

## Overview

Build all core NestJS modules: Auth, Users, Courts, Sessions (single + recurring), and core business logic.

## Key Insights

- Better Auth handles auth, we wrap it in a NestJS guard
- Guest users (vãng lai) don't have accounts — stored as `guest_bookings` with name + phone
- Host users need email registration for session management
- ELO scoring starts simple: manual input, host confirmation after sessions
- Courts are host-created, no central database

## Prisma Schema (Key Models)

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String
  avatarUrl     String?
  eloScore      Int      @default(1000)
  isHost        Boolean  @default(false)
  createdAt     DateTime @default(now())
  // relations
  sessions      Session[]
  bookings      Booking[]
  ratings       Rating[]
}

model Court {
  id        String   @id @default(uuid())
  name      String
  address   String
  lat       Float
  lng       Float
  district  String?
  city      String   @default("TP.HCM")
  createdBy String   // host user id
  createdAt DateTime @default(now())
  // relations
  sessions  Session[]
}

model Session {
  id            String   @id @default(uuid())
  hostId        String
  courtId       String
  startTime     DateTime
  endTime       DateTime
  totalSlots    Int
  bookedSlots   Int      @default(0)
  pricePerPerson Int
  skillRequired  String?  // ELO range or label
  shuttleType   String?  // plastic / feather
  playType      String?  // singles / doubles / mixed
  status        String   @default("open") // open, full, cancelled, completed
  isRecurring   Boolean  @default(false)
  recurrenceRule String? // RRULE string
  approvalMode  String   @default("auto") // auto / manual
  createdAt     DateTime @default(now())
  // relations
  host     User      @relation(fields: [hostId], references: [id])
  court    Court     @relation(fields: [courtId], references: [id])
  bookings Booking[]
}

model Booking {
  id           String   @id @default(uuid())
  sessionId    String
  userId       String?  // null for guest bookings
  guestName    String?  // for guest bookings
  guestPhone   String?  // for guest bookings
  status       String   @default("pending") // pending, confirmed, cancelled, attended
  bookedAt     DateTime @default(now())
  cancelledAt  DateTime?
  cancelReason String?
  // relations
  session Session @relation(fields: [sessionId], references: [id])
  user    User?   @relation(fields: [userId], references: [id])
}
```

## NestJS Modules

| Module | Responsibility |
|--------|----------------|
| `AuthModule` | Better Auth wrapper, guards, session management |
| `UserModule` | Profile CRUD, ELO calculation |
| `CourtModule` | Court CRUD (host-only) |
| `SessionModule` | Session CRUD, RRULE expansion, slot management |
| `BookingModule` | Booking flow, guest booking, state machine |

## Implementation Steps

1. Setup Prisma + connect to Supabase PostgreSQL
2. Create + run migrations
3. Implement AuthModule with Better Auth
4. Implement UserModule (CRUD + ELO)
5. Implement CourtModule (CRUD, host-only guard)
6. Implement SessionModule (CRUD + RRULE logic)
7. Implement BookingModule (guest + auth flows)
8. Add Redis for slot locking (atomic operations)
9. Seed data for development

## Booking State Machine

```
Guest/User clicks "Join"
       │
       ▼
   [pending] ──── approval_mode = auto ──► [confirmed]
       │                                       │
       │── approval_mode = manual              │
       │         │                             │
       ▼         ▼                             │
  [pending] → Host Accept → [confirmed]       │
       │                                       │
       │── Host Reject ──► [cancelled]         │
       │                                       │
       └── User/Guest Cancel ──► [cancelled]   │
                                               │
                              Session ends ──► [attended]
```

## Todo

- [ ] Setup Prisma schema + Supabase connection
- [ ] Run initial migration
- [ ] AuthModule (Better Auth integration)
- [ ] UserModule (CRUD + ELO)
- [ ] CourtModule (CRUD)
- [ ] SessionModule (CRUD + RRULE)
- [ ] BookingModule (guest + auth)
- [ ] Redis slot locking
- [ ] Seed script

## Success Criteria

- All CRUD endpoints working via Swagger/Postman
- Host can create session (single + recurring)
- Guest can book without login (name + phone)
- Authenticated user can book with account
- Slot count atomically decremented on booking
- Booking state transitions work correctly
