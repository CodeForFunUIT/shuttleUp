---
title: "Weighted Scoring Form — Onboarding Questionnaire"
description: "7-question step-by-step wizard after registration to seed initial BELo ELO (1200–1940)"
status: done
priority: high
effort: "medium (3-4h)"
branch: feat/onboarding-wizard
tags: [onboarding, belo, elo, registration, wizard]
created: 2026-05-04T21:42:00+07:00
brainstorm: plans/reports/brainstormer-260504-2136-weighted-scoring-form.md
---

# Weighted Scoring Form — Implementation Plan

## Phases Overview

| # | Phase | Effort | Files |
|---|---|---|---|
| 1 | [Backend — Schema + Endpoint](./phase-01-backend.md) | 45min | 5 files |
| 2 | [Frontend — Wizard Components](./phase-02-frontend-wizard.md) | 1.5h | 6 files |
| 3 | [Integration — Registration Flow](./phase-03-integration.md) | 30min | 3 files |
| 4 | [Polish — Animations + Dark Theme](./phase-04-polish.md) | 45min | 4 files |

## Architecture

```
Registration Step 1        Step 2 (NEW)           Dashboard
┌──────────────┐    ┌────────────────────┐    ┌──────────┐
│ Name/Email/  │───→│ /register/onboard  │───→│ /dashboard│
│ Password     │    │ 7-step wizard      │    │          │
│ [Create Acc] │    │ Skip → default 1200│    │          │
└──────────────┘    │ Finish → PATCH API │    └──────────┘
                    └────────────────────┘
```

## Key Files

### Backend (shuttleup-api)
- `prisma/schema.prisma` — Add `onboardingCompleted` + `onboardingAnswers`
- `src/users/dto/submit-onboarding.dto.ts` — NEW validation DTO
- `src/users/users.service.ts` — Add `submitOnboarding()` + weight calc
- `src/users/users.controller.ts` — Add `PATCH /users/me/onboarding`
- `src/auth/auth.service.ts` — Register new fields in Better Auth

### Frontend (shuttleup-web)
- `src/components/onboarding/wizard-questions.ts` — Question config data
- `src/components/onboarding/wizard-step.tsx` — Single question UI
- `src/components/onboarding/wizard-progress-bar.tsx` — Gold gradient bar
- `src/components/onboarding/elo-preview-counter.tsx` — Animated ELO badge
- `src/components/onboarding/skill-wizard.tsx` — Main container
- `src/app/[locale]/register/onboarding/page.tsx` — Wizard page
- `src/app/[locale]/register/page.tsx` — Add redirect after signup

## Dependencies

- Prisma migration (Phase 1 must complete before Phase 2 testing)
- BELo design tokens already in `globals.css` (from previous work)
- No new npm packages needed (use existing framer-motion for animations if present, otherwise CSS transitions)

## Risks

- Server must validate answer indices (0–4 range) to prevent gaming
- Mobile wizard UX needs large touch targets
- K=32 calibration trusted for anti-gaming (no extra mechanism)
