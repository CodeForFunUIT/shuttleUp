# Phase 2: Backend — Match Service & DTO

## Context

- [Plan Overview](plan.md)
- **Depends on**: Phase 1 (types must be updated first)
- Files: `elo-match.service.ts`, `submit-match.dto.ts`

## Overview

- **Priority**: 🔴 High
- **Status**: ⬜ Not started

## Changes

### 2.1 `src/elo/dto/submit-match.dto.ts`

**Remove `score` field entirely:**

```diff
 export class SubmitMatchDto {
   @ApiProperty({ enum: GameType })
   @IsEnum(GameType)
   gameType: GameType;

-  @ApiProperty({ example: '2-0', enum: ['2-0', '2-1'] })
-  @IsIn(['2-0', '2-1'])
-  score: '2-0' | '2-1';

   @ApiProperty({ example: ['userId1'] })
   @IsArray()
   teamA: string[];
   ...
```

### 2.2 `src/elo/services/elo-match.service.ts`

**Remove `scoreMultiplier` from `PlayerResult` interface (line 28):**

```diff
 interface PlayerResult {
   userId: string;
   team: string;
   isWinner: boolean;
   eloBefore: number;
   eloAfter: number;
   delta: number;
   kFactor: number;
   expectedScore: number;
   carryWeight: number;
   synergyBonus: number;
-  scoreMultiplier: number;
 }
```

**Update all places that call `this.eloCalc.calculateSingles()` or `this.eloCalc.calculateDoubles()`:**
- Remove `score` param from call
- Remove `scoreMultiplier` from result mapping

**Update all places that call `this.eloCalc.getScoreMultiplier()`:**
- Remove these calls entirely

**Update `PlayerResult` object construction:**
- Remove `scoreMultiplier: result.scoreMultiplier` lines
- Remove `scoreMultiplier: this.eloCalc.getScoreMultiplier(...)` lines

**Update DB write in `persistMatch()`:**
- Remove `scoreMultiplier: p.scoreMultiplier` from participant data

## Todo

- [ ] Remove `score` from `SubmitMatchDto`
- [ ] Remove `scoreMultiplier` from `PlayerResult` interface
- [ ] Update `processSinglesMatch()` — remove score param and multiplier
- [ ] Update `processDoublesMatch()` — remove score param and multiplier
- [ ] Update `persistMatch()` — remove scoreMultiplier from DB write
- [ ] Run `npm run lint` and `npm run test`
