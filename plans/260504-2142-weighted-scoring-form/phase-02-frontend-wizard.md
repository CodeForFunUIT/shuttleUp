# Phase 2: Frontend — Wizard Components

> Priority: HIGH | Status: Pending | Effort: 1.5h

## Context Links
- [Brainstorm Report](../reports/brainstormer-260504-2136-weighted-scoring-form.md)
- [Register Page](../../shuttleup-web/src/app/[locale]/register/page.tsx)
- [BELo Design System](../../.agents/docs/belo-design-system.md)
- [API Client](../../shuttleup-web/src/lib/api.ts)

## Overview

Build the 7-step onboarding wizard with BELo dark theme, animated progress bar, live ELO counter, and single-question-per-screen UX. All components data-driven from a central config file.

## Key Insights

- Use `framer-motion` if already installed, otherwise CSS transitions (150ms per BELo spec)
- Questions defined as config data → wizard renders dynamically
- ELO preview is client-side calculation (same weights as backend) for instant feedback
- Actual submission goes through backend for server-side validation
- BELo tokens already in globals.css: `--color-brand-gold`, `bg-background`, etc.

## Related Code Files

| File | Action |
|---|---|
| `src/components/onboarding/wizard-questions.ts` | CREATE — question config + weight tables |
| `src/components/onboarding/wizard-step.tsx` | CREATE — single question UI component |
| `src/components/onboarding/wizard-progress-bar.tsx` | CREATE — animated gold progress bar |
| `src/components/onboarding/elo-preview-counter.tsx` | CREATE — floating ELO badge with counter |
| `src/components/onboarding/skill-wizard.tsx` | CREATE — main wizard container + state machine |
| `src/app/[locale]/register/onboarding/page.tsx` | CREATE — wizard page route |

## Implementation Steps

### Step 1 — Question Config (`wizard-questions.ts`)

Data-driven config file. Shared between client preview + backend validation:

```typescript
export interface WizardOption {
  label: string;
  labelVi: string;
  weight: number;
}

export interface WizardQuestion {
  id: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  icon: string; // emoji
  options: WizardOption[];
}

export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'experience',
    title: 'How long have you played badminton?',
    titleVi: 'Bạn đã chơi cầu lông bao lâu?',
    subtitle: 'Your experience helps us find the right starting point',
    subtitleVi: 'Kinh nghiệm giúp xác định điểm xuất phát phù hợp',
    icon: '🏸',
    options: [
      { label: 'Just started', labelVi: 'Mới bắt đầu', weight: 0 },
      { label: 'Less than 1 year', labelVi: 'Dưới 1 năm', weight: 50 },
      { label: '1–3 years', labelVi: '1–3 năm', weight: 100 },
      { label: '3–5 years', labelVi: '3–5 năm', weight: 150 },
      { label: 'More than 5 years', labelVi: 'Trên 5 năm', weight: 200 },
    ],
  },
  // ... remaining 6 questions (see brainstorm report for full data)
];

export const BASE_ELO = 1200;

export function calculateClientElo(answers: Record<string, number>): number {
  let bonus = 0;
  for (const q of WIZARD_QUESTIONS) {
    const idx = answers[q.id];
    if (idx !== undefined && idx >= 0 && idx < q.options.length) {
      bonus += q.options[idx].weight;
    }
  }
  return BASE_ELO + bonus;
}
```

### Step 2 — Wizard Step (`wizard-step.tsx`)

Single question screen component:
- Question title + subtitle + emoji icon
- Radio-button-style option cards (vertical stack)
- Selected option highlighted with Shuttle Gold border
- Large touch targets (min 48px height per option)
- Slide-in animation from right

```
┌─────────────────────────────────┐
│  🏸                              │
│  How long have you played?      │
│  Your experience helps us...    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ ○  Just started          │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ● Less than 1 year ←GOLD│    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ○  1–3 years             │    │
│  └─────────────────────────┘    │
│  ...                             │
└─────────────────────────────────┘
```

Props:
```typescript
interface WizardStepProps {
  question: WizardQuestion;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  direction: 'forward' | 'backward';
}
```

### Step 3 — Progress Bar (`wizard-progress-bar.tsx`)

- Full-width bar at top of wizard
- Gold gradient fill (`#F5C842 → #FF6B35`)
- Width = `(currentStep / totalSteps) * 100%`
- Smooth width transition (300ms ease)
- Step counter text: "3 / 7"

### Step 4 — ELO Preview Counter (`elo-preview-counter.tsx`)

- Fixed-position floating badge (bottom-center or bottom-right)
- Shows current calculated ELO in `font-barlow-condensed`
- Number animates (count up/down) when answers change
- Tier badge shows below ELO number
- Semi-transparent dark card with border glow

```
  ┌───────────────┐
  │  Your BELo    │
  │    1350       │  ← counting animation
  │  🥉 Đồng      │  ← dynamic tier
  └───────────────┘
```

Implementation: Use `useEffect` + `requestAnimationFrame` for counting animation, or CSS `counter-increment` with transitions.

### Step 5 — Main Wizard (`skill-wizard.tsx`)

State machine container:
- `currentStep: number` (0–6 for questions, 7 for result screen)
- `answers: Record<string, number>` — maps question ID → selected index
- Navigation: "Back" / "Next" / "Skip" / "Finish"
- "Skip" → redirects to `/dashboard` immediately (no API call)
- "Finish" (on last step or result screen) → `PATCH /users/me/onboarding` → redirect

```typescript
// State
const [step, setStep] = useState(0);
const [answers, setAnswers] = useState<Record<string, number>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

// Derived
const currentElo = calculateClientElo(answers);
const currentTier = getTierInfo(currentElo);
const isLastQuestion = step === WIZARD_QUESTIONS.length - 1;
const canProceed = answers[WIZARD_QUESTIONS[step]?.id] !== undefined;
```

Button layout:
```
[← Back]              [Skip ↗]  [Next →]
                       or
[← Back]              [Skip ↗]  [Finish ✓]  (last step)
```

### Step 6 — Wizard Page (`register/onboarding/page.tsx`)

```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "@/i18n/navigation";
import { SkillWizard } from "@/components/onboarding/skill-wizard";

export default function OnboardingPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  if (!isPending && !session?.user) {
    router.push("/register");
    return null;
  }

  // Redirect if already completed onboarding
  if (session?.user?.onboardingCompleted) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SkillWizard />
    </div>
  );
}
```

## Todo List

- [ ] Create wizard-questions.ts with all 7 questions + weights
- [ ] Create wizard-step.tsx — option cards with gold selection
- [ ] Create wizard-progress-bar.tsx — gold gradient animated bar
- [ ] Create elo-preview-counter.tsx — floating ELO counter
- [ ] Create skill-wizard.tsx — state machine + navigation
- [ ] Create /register/onboarding/page.tsx — route + guards
- [ ] Add i18n support (en/vi) for all question text

## Success Criteria

- Wizard renders 7 questions sequentially
- Options highlight with gold on selection
- ELO counter updates live with each answer
- Progress bar animates smoothly
- "Skip" skips entirely, "Finish" calls backend API
- Mobile responsive (single column, large touch targets)
- BELo dark theme applied correctly
