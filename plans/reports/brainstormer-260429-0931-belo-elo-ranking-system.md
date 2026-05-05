# BELo Ranking System — Brainstorm Report

> **Date:** 2026-04-29 | **Branch:** `feat/elo-score` | **Status:** Design Approved

---

## Problem Statement

Tích hợp hệ thống xếp hạng ELO mở rộng (BELo) vào ShuttleUp, hỗ trợ:
- 3 game types độc lập: `singles`, `doubles`, `mixed`
- Pair synergy bonus, carry weight, K-factor theo kinh nghiệm
- Full audit trail mỗi trận
- Host submit kết quả (Phase 1) + 2-sided confirmation / challenge (Phase 2)
- Leaderboard với tier system (6 bậc)

---

## Confirmed Requirements

| # | Quyết định |
|---|-----------|
| Session mapping | 1 session = 1 ELO match |
| Game type | Host chọn khi tạo session |
| Submit Phase 1 | Host submit kết quả, immediate confirm |
| Submit Phase 2 | 2-sided confirmation + standalone challenge |
| Conflict | Admin resolve khi 2 bên không đồng ý |
| Substitution | Hệ thống không hỗ trợ — record người cũ |
| Inactivity decay | Phase 2 (skip MVP) |
| Anti-cheat pattern | Phase 2 (skip MVP) |
| Audit trail | Full breakdown mỗi trận |
| ELO visibility | Ẩn khi < 5 trận ("Calibrating") |
| Mismatch warning | Hiển thị trên cả 3 nơi: submit form, leaderboard, ghép cặp |

---

## Database Schema Design

### Approach Evaluated

| Approach | Pros | Cons |
|----------|------|------|
| **A: Columns trên `users`** (`elo_singles`, `elo_doubles`, `elo_mixed`) | Simple query, no join | Rigid, khó extend game type mới |
| **B: Bảng riêng `user_elo_ratings`** ✅ | Normalized, flexible, dễ add game type | +1 JOIN khi lấy profile |

**→ Chọn B.** Phù hợp KISS + extensible.

### Schema Tables

```prisma
model UserEloRating {
  id            String   @id @default(cuid())
  userId        String
  gameType      GameType
  eloScore      Int      @default(1000)
  totalGames    Int      @default(0)
  isCalibrating Boolean  @default(true) // false sau >= 5 trận
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id])

  @@unique([userId, gameType])
  @@index([gameType, eloScore]) // leaderboard query
}

model EloMatch {
  id          String         @id @default(cuid())
  sessionId   String?        @unique // null nếu là standalone challenge
  challengeId String?        @unique
  gameType    GameType
  score       MatchScore     // TWO_ZERO | TWO_ONE
  status      EloMatchStatus // CONFIRMED | DISPUTED | CANCELLED
  playedAt    DateTime
  createdAt   DateTime       @default(now())

  session      Session?              @relation(...)
  challenge    EloChallenge?         @relation(...)
  participants EloMatchParticipant[]
}

model EloMatchParticipant {
  id              String   @id @default(cuid())
  matchId         String
  userId          String
  team            TeamSide // TEAM_A | TEAM_B
  isWinner        Boolean
  eloBefore       Int
  eloAfter        Int
  delta           Int
  kFactor         Int
  expectedScore   Float    // E(player) — xác suất kỳ vọng
  carryWeight     Float    // weight nhận delta (1.0 nếu singles)
  synergyBonus    Int      // 0 nếu singles
  scoreMultiplier Float

  match EloMatch @relation(...)
  user  User     @relation(...)

  @@index([userId]) // lịch sử cá nhân
}

model PairSynergy {
  id            String   @id @default(cuid())
  playerIdA     String   // always smaller UUID (normalized key)
  playerIdB     String
  gameType      GameType
  gamesTogether Int      @default(0)
  updatedAt     DateTime @updatedAt

  @@unique([playerIdA, playerIdB, gameType])
}

model EloChallenge {
  id           String          @id @default(cuid())
  challengerId String
  challengedId String
  gameType     GameType
  status       ChallengeStatus // PENDING | ACCEPTED | REJECTED | COMPLETED | EXPIRED
  expiresAt    DateTime        // +48h từ lúc tạo
  matchId      String?
  createdAt    DateTime        @default(now())
}
```

### Enums thêm vào `common/constants/enums.ts`

```typescript
export enum GameType        { SINGLES = 'singles', DOUBLES = 'doubles', MIXED = 'mixed' }
export enum MatchScore      { TWO_ZERO = '2-0', TWO_ONE = '2-1' }
export enum EloMatchStatus  { CONFIRMED = 'CONFIRMED', DISPUTED = 'DISPUTED', CANCELLED = 'CANCELLED' }
export enum TeamSide        { TEAM_A = 'TEAM_A', TEAM_B = 'TEAM_B' }
export enum ChallengeStatus { PENDING='PENDING', ACCEPTED='ACCEPTED', REJECTED='REJECTED', COMPLETED='COMPLETED', EXPIRED='EXPIRED' }
```

---

## Module Architecture

```
src/elo/
├── elo.module.ts
├── elo.controller.ts                 # HTTP endpoints
├── services/
│   ├── elo-calculation.service.ts   # Pure math — stateless, 100% unit testable
│   ├── elo-match.service.ts         # Match CRUD + confirm flow
│   ├── elo-leaderboard.service.ts   # Ranking queries
│   └── elo-challenge.service.ts     # Challenge lifecycle (Phase 2)
├── dto/
│   ├── submit-match.dto.ts
│   ├── create-challenge.dto.ts
│   └── respond-challenge.dto.ts
└── types/
    └── elo-calculation.types.ts     # Internal types for calculation
```

---

## Key Architectural Decisions

### Decision 1 — ELO Calculation: Synchronous vs Async (Bull Queue)

| Option | Pros | Cons |
|--------|------|------|
| **Sync** ✅ | Simple, immediate feedback, no queue overhead | Blocking ~5ms per match |
| Async (Bull) | Non-blocking | Overkill cho MVP, eventual consistency phức tạp |

**→ Sync.** ELO calc là pure math, <5ms. Notification emit qua EventEmitter (async).

### Decision 2 — Match State Machine

```
Phase 1 (MVP):
  Host submit → status: CONFIRMED → ELO updated immediately

Phase 2 (2-sided):
  Host submit → PENDING_LOSER_CONFIRM (24h timeout)
      ├── Loser confirms → CONFIRMED → ELO updated
      ├── Loser disputes → DISPUTED → Admin queue
      └── Timeout (24h) → auto CONFIRMED
```

`PENDING_LOSER_CONFIRM` thêm vào `EloMatchStatus` enum ở Phase 2 — backward compatible.

### Decision 3 — Leaderboard: Real-time Query vs Redis Cache

| Option | Pros | Cons |
|--------|------|------|
| **Real-time DB query** ✅ (MVP) | Zero infra thêm, luôn accurate | Slow khi >10k users |
| Redis sorted set | O(log n) ranking, very fast | Cần sync strategy, phức tạp |

**→ Real-time + index.** `@@index([gameType, eloScore])` đủ cho MVP. Redis khi scale cần.

### Decision 4 — Challenge System Integration

```
Flow 1 — Session-based (Phase 1):
  Session ends → host navigates to ELO submit page
  → game_type pre-filled từ session → picks winner + score → Submit → CONFIRMED

Flow 2 — Standalone Challenge (Phase 2):
  User A → POST /elo/challenges → User B notified (+push)
  B accepts → Both play → host (hoặc winner) submits kết quả
  → Both confirm → CONFIRMED
  → Dispute → Admin resolves
```

`EloMatch.sessionId` nullable FK — liên kết session khi có, null khi standalone challenge.

---

## API Endpoints

### Phase 1

```
POST   /elo/matches                  # Host submit kết quả (session-based)
GET    /elo/matches/:id              # Chi tiết trận + full audit trail
GET    /elo/leaderboard              # Rankings ?gameType=singles&page=1&limit=20
GET    /elo/users/:userId            # ELO profile (3 game types + tier)
GET    /elo/users/:userId/history    # Lịch sử trận cá nhân
GET    /elo/pairs/:userId1/:userId2  # Synergy info giữa 2 người
```

### Phase 2

```
POST   /elo/challenges               # Tạo challenge
PATCH  /elo/challenges/:id/respond   # Accept/reject
PATCH  /elo/challenges/:id/confirm   # Confirm kết quả (loser side)
PATCH  /elo/matches/:id/dispute      # Loser dispute kết quả
PATCH  /elo/matches/:id/resolve      # Admin resolve dispute
```

---

## ELO Calculation Service Interface

```typescript
// Pure stateless — zero DB dependency, easy to unit test
class EloCalculationService {
  calculateSingles(params: SinglesMatchParams): SinglesResult
  calculateDoubles(params: DoublesMatchParams): DoublesResult
  getKFactor(totalGames: number): 32 | 24 | 16
  getScoreMultiplier(score: MatchScore, isWinner: boolean): number
  getSynergyBonus(gamesTogether: number): 0 | 5 | 10 | 15
  getCarryWeights(eloA: number, eloB: number): [number, number]
  getMismatchLevel(eloDiff: number): 'none' | 'warning' | 'danger'
}
```

---

## Cross-Module Integration (Event-Driven)

```typescript
// Session kết thúc → notify host submit ELO (SessionsModule → EloModule)
this.eventEmitter.emit('session.completed', new SessionCompletedEvent(sessionId, hostId));

// ELO confirmed → notify người chơi (EloModule → NotificationsModule)
this.eventEmitter.emit('elo.match.confirmed', new EloMatchConfirmedEvent(matchId));
```

---

## Phase Plan

### Phase 1 — MVP (Current branch)

- [ ] Prisma schema: 4 bảng mới + enums + migration
- [ ] `EloCalculationService` (pure math) + unit tests 100%
- [ ] `EloMatchService` (submit, store, query)
- [ ] `EloLeaderboardService` (rankings + tier calc)
- [ ] API: 6 endpoints Phase 1
- [ ] Event integration với SessionsModule
- [ ] `UserEloRating` seeded khi user đăng ký (hook vào user.created event)
- [ ] Mismatch warning logic trong submit DTO

### Phase 2 — Challenge & 2-sided Confirmation

- [ ] `EloChallengeService` + endpoints
- [ ] 2-sided confirmation state machine
- [ ] Admin dispute resolution
- [ ] Push notification cho challenge
- [ ] Inactivity decay (Bull Queue cron job)

### Phase 3 — Anti-cheat & Analytics

- [ ] Pattern detection cho match farming
- [ ] ELO history charts (API endpoint)
- [ ] Season reset mechanism

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Host submit sai kết quả cố ý | Medium | Phase 2: 2-sided confirm. Phase 3: pattern detection |
| ELO swing quá mạnh ban đầu | Low | K=32 placement period là đúng spec. Monitor |
| Leaderboard slow khi scale | Low | Index đủ <50k. Redis migration path sẵn |
| Synergy exploiting (pair farming) | Low | Carry weight giảm incentive. Phase 3 monitor |
| Float precision trong carry weight | Low | Dùng `round()` như spec — đã handle |

---

## Success Metrics

- ELO computed correctly theo spec (unit test coverage 100% cho `EloCalculationService`)
- Leaderboard query < 200ms với 10k records
- Submit result trong < 3 steps từ session ended
- Validation reject nếu < 2 players mỗi team

---

*BELo Brainstorm v1.0 — ShuttleUp, branch feat/elo-score*
