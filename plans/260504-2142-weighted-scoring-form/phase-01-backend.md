# Phase 1: Backend — Schema + Endpoint

> Priority: HIGH | Status: Pending | Effort: 45min

## Context Links
- [Brainstorm Report](../reports/brainstormer-260504-2136-weighted-scoring-form.md)
- [Prisma Schema](../../shuttleup-api/prisma/schema.prisma)
- [Users Service](../../shuttleup-api/src/users/users.service.ts)
- [Users Controller](../../shuttleup-api/src/users/users.controller.ts)
- [Auth Service](../../shuttleup-api/src/auth/auth.service.ts)

## Overview

Add 2 new fields to User model, create onboarding DTO with validation, implement weight calculation logic server-side, and expose a `PATCH /users/me/onboarding` endpoint.

## Key Insights

- Current default ELO is 1200 (in schema + auth.service.ts)
- `skillLevel` is already a string field: BEGINNER/INTERMEDIATE/ADVANCED/PRO
- Need to auto-derive `skillLevel` from final calculated ELO
- Weight calculation MUST be server-side (never trust client)
- Answer indices validated to prevent out-of-range manipulation

## Related Code Files

| File | Action |
|---|---|
| `prisma/schema.prisma` | MODIFY — add 2 fields to User model |
| `src/users/dto/submit-onboarding.dto.ts` | CREATE — new DTO |
| `src/users/users.service.ts` | MODIFY — add weight calc + submitOnboarding() |
| `src/users/users.controller.ts` | MODIFY — add PATCH /users/me/onboarding |
| `src/auth/auth.service.ts` | MODIFY — register new additionalFields |

## Implementation Steps

### Step 1 — Prisma Schema Migration

Add to `User` model in `prisma/schema.prisma`:

```prisma
  onboardingCompleted Boolean @default(false)
  onboardingAnswers   Json?   // Store raw answers for analytics
```

Run migration:
```bash
cd shuttleup-api && npx prisma migrate dev --name add-onboarding-fields
```

### Step 2 — Create SubmitOnboardingDto

Create `src/users/dto/submit-onboarding.dto.ts`:

```typescript
import { IsInt, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OnboardingAnswers {
  @IsInt() @Min(0) @Max(4) experience: number;   // 0-4
  @IsInt() @Min(0) @Max(3) frequency: number;    // 0-3
  @IsInt() @Min(0) @Max(3) tournament: number;   // 0-3
  @IsInt() @Min(0) @Max(2) gameStyle: number;    // 0-2
  @IsInt() @Min(0) @Max(3) technique: number;    // 0-3
  @IsInt() @Min(0) @Max(3) training: number;     // 0-3
  @IsInt() @Min(0) @Max(4) selfRating: number;   // 0-4
}

export class SubmitOnboardingDto {
  @ValidateNested()
  @Type(() => OnboardingAnswers)
  answers: OnboardingAnswers;
}
```

### Step 3 — Weight Calculation in UsersService

Add to `users.service.ts`:

```typescript
// Weight lookup tables (index → bonus points)
const WEIGHTS = {
  experience: [0, 50, 100, 150, 200],     // max +200
  frequency:  [0, 30, 60, 80],            // max +80
  tournament: [0, 50, 100, 150],           // max +150
  gameStyle:  [0, 30, 50],                 // max +50
  technique:  [0, 30, 60, 80],            // max +80
  training:   [0, 15, 40, 60],            // max +60
  selfRating: [0, 30, 60, 90, 120],       // max +120
} as const;                                // TOTAL max: 740

const BASE_ELO = 1200;

function calculateWeightedElo(answers: Record<string, number>): number {
  let bonus = 0;
  for (const [key, index] of Object.entries(answers)) {
    const table = WEIGHTS[key as keyof typeof WEIGHTS];
    if (table && index >= 0 && index < table.length) {
      bonus += table[index];
    }
  }
  return BASE_ELO + bonus; // Range: 1200–1940
}

function deriveSkillLevel(elo: number): string {
  if (elo >= 1700) return 'PRO';
  if (elo >= 1400) return 'ADVANCED';
  if (elo >= 1100) return 'INTERMEDIATE';
  return 'BEGINNER';
}
```

Add method:
```typescript
async submitOnboarding(userId: string, dto: SubmitOnboardingDto) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');
  if (user.onboardingCompleted) {
    throw new BadRequestException('Onboarding already completed');
  }

  const newElo = calculateWeightedElo(dto.answers);
  const skillLevel = deriveSkillLevel(newElo);

  return this.prisma.user.update({
    where: { id: userId },
    data: {
      eloScore: newElo,
      skillLevel,
      onboardingCompleted: true,
      onboardingAnswers: dto.answers,
    },
    select: { eloScore: true, skillLevel: true, onboardingCompleted: true },
  });
}
```

### Step 4 — Controller Endpoint

Add to `users.controller.ts`:

```typescript
@ApiBearerAuth()
@ApiOperation({ summary: 'Submit onboarding questionnaire' })
@UseGuards(AuthGuard)
@Patch('me/onboarding')
submitOnboarding(
  @CurrentUser('id') userId: string,
  @Body() dto: SubmitOnboardingDto,
) {
  return this.usersService.submitOnboarding(userId, dto);
}
```

> **IMPORTANT:** Place this BEFORE the `@Get(':id')` route to avoid route conflicts.

### Step 5 — Auth Service Fields

Add to `auth.service.ts` additionalFields:

```typescript
onboardingCompleted: { type: 'boolean', required: false, defaultValue: false },
```

### Step 6 — Update findOne/findAll selects

Add to both `findOne` and `findAll` select objects:
```typescript
onboardingCompleted: true,
```

## Todo List

- [ ] Add Prisma fields + run migration
- [ ] Create SubmitOnboardingDto with validation
- [ ] Implement weight calculation + submitOnboarding()
- [ ] Add PATCH /users/me/onboarding endpoint
- [ ] Register onboardingCompleted in auth.service.ts
- [ ] Update findOne/findAll selects
- [ ] Test with curl/Postman

## Success Criteria

- Migration runs clean
- `PATCH /users/me/onboarding` returns calculated ELO + skill level
- Out-of-range indices rejected (400)
- Second call returns 400 "Already completed"
- Max answers → ELO 1940, min answers → ELO 1200
