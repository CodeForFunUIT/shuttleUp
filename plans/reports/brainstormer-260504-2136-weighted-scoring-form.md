# Brainstorm: Weighted Scoring Form (Onboarding Questionnaire)

> **Date:** 2026-05-04
> **Status:** Agreed
> **Feature:** Multi-step registration with BELo skill assessment wizard

---

## Problem Statement

Every new user starts at ELO 1200 regardless of actual skill. A 10-year tournament veteran and a first-timer both enter "Đồng" tier. This causes matchmaking pollution, wasted calibration games, and bad UX for experienced players stuck in "low ELO hell."

---

## Agreed Solution

### Architecture: 2-Step Registration Flow

```
Step 1: Account Creation          Step 2: Skill Assessment Wizard
┌─────────────────────────┐      ┌──────────────────────────────────┐
│  Name / Email / Password │ ──→  │  7 questions, 1-per-screen       │
│  (existing form)         │      │  Progress bar + animations       │
│                          │      │  "Skip" button always visible    │
│  [Create Account] ──────────→   │  Live ELO preview counter        │
└─────────────────────────┘      │  [Finish] → Dashboard            │
                                  └──────────────────────────────────┘
```

### Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Timing | Step 2 after account creation | Account exists first, wizard updates ELO |
| Skippable | Yes, "Skip" visible on every step | Non-blocking; defaults to 1200 |
| ELO target | Replaces `User.eloScore` directly | Simple; per-game-type ratings start at 1000 separately |
| Anti-gaming | Trust K=32 calibration phase | Over-reporters self-correct in ~5 games |
| Re-assessment | One-time only | Prevents manipulation; stored as `onboardingCompleted` flag |
| UX style | Step-by-step wizard | Premium feel, BELo dark theme, progress animations |

---

## Question Set & Weights

**Base ELO: 1200** | **Max bonus: +740** | **Range: 1200–1940**

### Q1 — Playing Experience (max +200)

> "How long have you played badminton?"

| Option | Weight | Rationale |
|---|---|---|
| Just started | +0 | True beginner |
| Less than 1 year | +50 | Some exposure |
| 1–3 years | +100 | Developing player |
| 3–5 years | +150 | Experienced |
| More than 5 years | +200 | Veteran |

### Q2 — Play Frequency (max +80)

> "How often do you play?"

| Option | Weight |
|---|---|
| Rarely (few times a month) | +0 |
| 1–2 times per week | +30 |
| 3–4 times per week | +60 |
| Almost daily (5+) | +80 |

### Q3 — Tournament Experience (max +150)

> "Have you competed in any tournament?"

| Option | Weight |
|---|---|
| Never | +0 |
| Local / club level | +50 |
| District / city level | +100 |
| Provincial or higher | +150 |

### Q4 — Game Style (max +50)

> "How would you describe your playing style?"

| Option | Weight |
|---|---|
| Casual rallies for fun | +0 |
| Competitive but friendly | +30 |
| I play to win | +50 |

### Q5 — Technique Assessment (max +80)

> "Can you perform a clear, smash, and drop shot consistently?"

| Option | Weight |
|---|---|
| Not yet learning | +0 |
| Sometimes | +30 |
| Most of the time | +60 |
| Always, with control | +80 |

### Q6 — Training Background (max +60)

> "What's your training background?"

| Option | Weight |
|---|---|
| Self-taught | +0 |
| Learned from videos/friends | +15 |
| Had formal lessons or club coaching | +40 |
| Currently training with a coach | +60 |

### Q7 — Self Rating (max +120)

> "How would you rate your overall skill?"

| Option | Weight |
|---|---|
| Complete beginner | +0 |
| Below average | +30 |
| Average | +60 |
| Above average | +90 |
| Expert / competitive | +120 |

---

## ELO Outcome Mapping

| Total Bonus | Starting ELO | BELo Tier | Player Profile |
|---|---|---|---|
| 0–50 | 1200–1250 | Đồng | True beginner / casual |
| 51–200 | 1251–1400 | Đồng → Bạc | Regular casual player |
| 201–400 | 1401–1600 | Bạc | Intermediate, some competition |
| 401–600 | 1601–1800 | Bạc → Vàng | Experienced competitor |
| 601–740 | 1801–1940 | Vàng | Tournament-level veteran |

> **Note:** Max is 1940, intentionally below Kim Cương (2000+). Nobody starts at Diamond — you earn it.

---

## Technical Architecture

### Frontend (Next.js)

```
src/
├── app/[locale]/register/
│   ├── page.tsx                    # Step 1: existing account form
│   └── onboarding/
│       └── page.tsx                # Step 2: wizard page
├── components/onboarding/
│   ├── skill-wizard.tsx            # Main wizard container + state
│   ├── wizard-step.tsx             # Single question step (reusable)
│   ├── wizard-progress-bar.tsx     # Animated progress indicator
│   ├── elo-preview-counter.tsx     # Live animated ELO counter
│   └── wizard-questions.ts         # Question config (data-driven)
```

**UX Flow:**
1. User completes Step 1 → `authClient.signUp.email()` → account created
2. Redirect to `/register/onboarding`
3. Wizard shows 7 questions, one per screen
4. Each answer animates ELO counter preview
5. "Skip" button → redirect to `/dashboard` with default 1200
6. "Finish" → PATCH `/api/users/me/onboarding` with answers → redirect to `/dashboard`

### Backend (NestJS)

```
src/users/
├── dto/
│   └── submit-onboarding.dto.ts    # Zod/class-validator DTO
├── users.controller.ts             # PATCH /users/me/onboarding
└── users.service.ts                # calculateWeightedElo() + updateUser()
```

**API Contract:**
```typescript
// PATCH /users/me/onboarding
{
  answers: {
    experience: number,      // 0-4 index
    frequency: number,       // 0-3 index
    tournament: number,      // 0-3 index
    gameStyle: number,       // 0-2 index
    technique: number,       // 0-3 index
    training: number,        // 0-3 index
    selfRating: number       // 0-4 index
  }
}

// Response: { eloScore: 1450, skillLevel: "INTERMEDIATE" }
```

**Server-side weight calculation** (never trust client):
- Server maps answer indices → weights using same config
- Calculates total bonus, sets `eloScore = 1200 + totalBonus`
- Auto-derives `skillLevel` from final ELO
- Sets `onboardingCompleted = true` flag

### Database Changes

```prisma
model User {
  // ... existing fields
  onboardingCompleted Boolean @default(false)
  onboardingAnswers   Json?   // Store raw answers for analytics
}
```

---

## UX Design Spec (BELo Theme)

### Wizard Step Layout
- Full-screen dark background (`#0D0F12`)
- Centered card with question + radio options
- Animated progress bar at top (Shuttle Gold gradient)
- Bottom: "Skip" (ghost) | "Next" (Gold CTA)
- Final step: "Finish" with confetti/celebration animation

### ELO Preview Counter
- Fixed bottom-right floating badge
- Shows current calculated ELO in `font-barlow-condensed`
- Number counts up/down with spring animation on each answer
- Tier badge updates dynamically

### Animations
- Step transitions: slide-left (150ms, BELo spec)
- ELO counter: spring physics counting animation
- Progress bar: smooth width transition
- Final screen: tier reveal with scale-up + glow

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Users over-report skill | Medium | K=32 calibration corrects in ~5 games |
| Users skip questionnaire | Low | Default 1200 is fine; most will want to set their ELO |
| Gaming via API manipulation | Low | Server-side weight calc; index validation |
| Mobile UX on wizard | Medium | Single-column, large touch targets, swipe support |

---

## Success Metrics

- **Adoption rate:** % of new users who complete vs skip wizard
- **Calibration accuracy:** Compare initial weighted ELO vs ELO after 10 games
- **Time-to-stable:** # games to reach ±50 of stable ELO (expect fewer with seeding)
- **User satisfaction:** Reduced "stuck in low ELO" complaints

---

## Next Steps

1. Create implementation plan with phased approach
2. Phase 1: Backend (Prisma migration + endpoint)
3. Phase 2: Frontend wizard components
4. Phase 3: Registration flow integration + redirect logic
5. Phase 4: Polish (animations, BELo theme, responsive)
