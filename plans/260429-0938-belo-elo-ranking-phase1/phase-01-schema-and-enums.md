# Phase 01 — Schema & Enums

## Context Links
- Brainstorm: `plans/reports/brainstormer-260429-0931-belo-elo-ranking-system.md`
- Spec: `plans/260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md`
- Schema: `shuttleup-api/prisma/schema.prisma`
- Enums: `shuttleup-api/src/common/constants/enums.ts`

## Overview
- **Priority:** High (blocks all other phases)
- **Status:** Pending
- Add 4 new Prisma models + new enums + migrate `CourtSession` to include `gameType`

## Key Insights
- `CourtSession` model already exists (`court_sessions` table) — needs `gameType` field added
- `User.eloScore` (single Int) already exists — keep for legacy, add `UserEloRating` relation as the new source of truth
- Prisma uses `String @default(...)` for enums (no native enum type used in project) — follow same pattern
- `PairSynergy` pair key must be normalized: `playerIdA < playerIdB` alphabetically

## Requirements

### Functional
- 4 new models: `UserEloRating`, `EloMatch`, `EloMatchParticipant`, `PairSynergy`
- New enums: `GameType`, `MatchScore`, `EloMatchStatus`, `TeamSide`
- `CourtSession` gets `gameType String @default("singles")`
- `User` gets `eloRatings UserEloRating[]` relation

### Non-functional
- Indexes on leaderboard query path: `[gameType, eloScore]`
- Indexes on participant history: `[userId]`
- `@@unique([playerIdA, playerIdB, gameType])` on PairSynergy

## Related Code Files
- **Modify:** `shuttleup-api/prisma/schema.prisma`
- **Modify:** `shuttleup-api/src/common/constants/enums.ts`

## Implementation Steps

### Step 1 — Add enums to `common/constants/enums.ts`

```typescript
export enum GameType {
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  MIXED = 'mixed',
}

export enum MatchScore {
  TWO_ZERO = '2-0',
  TWO_ONE = '2-1',
}

export enum EloMatchStatus {
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export enum TeamSide {
  TEAM_A = 'TEAM_A',
  TEAM_B = 'TEAM_B',
}
```

### Step 2 — Add `gameType` to `CourtSession` model

```prisma
model CourtSession {
  // ... existing fields ...
  gameType      String    @default("singles") // GameType enum value

  // Add relation
  eloMatch      EloMatch?
}
```

### Step 3 — Add `UserEloRating` model

```prisma
model UserEloRating {
  id            String   @id @default(cuid())
  userId        String
  gameType      String   // GameType: 'singles' | 'doubles' | 'mixed'
  eloScore      Int      @default(1000)
  totalGames    Int      @default(0)
  isCalibrating Boolean  @default(true)  // false after >= 5 games
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, gameType])
  @@index([gameType, eloScore(sort: Desc)])
  @@map("user_elo_ratings")
}
```

Add to `User` model:
```prisma
eloRatings UserEloRating[]
```

### Step 4 — Add `EloMatch` model

```prisma
model EloMatch {
  id          String   @id @default(cuid())
  sessionId   String?  @unique  // null for future standalone challenges
  gameType    String   // GameType
  score       String   // MatchScore: '2-0' | '2-1'
  status      String   @default("CONFIRMED")  // EloMatchStatus
  playedAt    DateTime
  createdAt   DateTime @default(now())

  session      CourtSession?        @relation(fields: [sessionId], references: [id])
  participants EloMatchParticipant[]

  @@map("elo_matches")
}
```

### Step 5 — Add `EloMatchParticipant` model

```prisma
model EloMatchParticipant {
  id              String  @id @default(cuid())
  matchId         String
  userId          String
  team            String  // TeamSide: 'TEAM_A' | 'TEAM_B'
  isWinner        Boolean
  eloBefore       Int
  eloAfter        Int
  delta           Int
  kFactor         Int
  expectedScore   Float
  carryWeight     Float   // 1.0 for singles
  synergyBonus    Int     @default(0)
  scoreMultiplier Float

  match EloMatch @relation(fields: [matchId], references: [id], onDelete: Cascade)
  user  User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("elo_match_participants")
}
```

Add to `User` model:
```prisma
eloMatchParticipants EloMatchParticipant[]
```

### Step 6 — Add `PairSynergy` model

```prisma
model PairSynergy {
  id            String   @id @default(cuid())
  playerIdA     String   // Always the lexicographically smaller userId
  playerIdB     String
  gameType      String   // GameType
  gamesTogether Int      @default(0)
  updatedAt     DateTime @updatedAt

  @@unique([playerIdA, playerIdB, gameType])
  @@map("pair_synergy")
}
```

### Step 7 — Run migration

```bash
cd shuttleup-api
npx prisma migrate dev --name add-belo-elo-ranking-tables
npx prisma generate
```

## Todo List
- [ ] Add 4 enums to `enums.ts`
- [ ] Add `gameType` field to `CourtSession`
- [ ] Add `UserEloRating` model + User relation
- [ ] Add `EloMatch` model + CourtSession relation
- [ ] Add `EloMatchParticipant` model + User/EloMatch relations
- [ ] Add `PairSynergy` model
- [ ] Run `prisma migrate dev`
- [ ] Run `prisma generate`
- [ ] Verify no Prisma compile errors

## Success Criteria
- `npx prisma migrate dev` runs without errors
- `npx prisma generate` generates all new model types
- `npx prisma studio` shows 4 new tables

## Risk Assessment
- **Low:** `User.eloScore` legacy field conflicts — it stays, `UserEloRating` is new source of truth
- **Low:** `CourtSession` rename collision — `@map("court_sessions")` stays unchanged
