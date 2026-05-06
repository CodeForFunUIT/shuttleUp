# Phase 4: Polish — Animations + Dark Theme

> Priority: MEDIUM | Status: Pending | Effort: 45min

## Context Links
- [BELo Design System](../../.agents/docs/belo-design-system.md)
- [Global CSS](../../shuttleup-web/src/app/globals.css)

## Overview

Apply BELo design polish: step transition animations, ELO counting animation, result celebration screen, and responsive refinements.

## Implementation Steps

### Step 1 — Step Transition Animation

Each wizard step slides in from the right (forward) or left (backward):

```css
/* wizard-step enter/exit */
@keyframes slideInRight {
  from { transform: translateX(40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-40px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.wizard-step-enter { animation: slideInRight 150ms ease-out; }
.wizard-step-enter-back { animation: slideInLeft 150ms ease-out; }
```

Use BELo-spec 150ms duration for all transitions.

### Step 2 — ELO Counting Animation

When user selects an option, the ELO preview counter smoothly counts to new value:

```typescript
function useAnimatedCounter(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const ref = useRef({ start: target, startTime: 0 });

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;

    ref.current = { start, startTime: performance.now() };

    const tick = (now: number) => {
      const elapsed = now - ref.current.startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(ref.current.start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return display;
}
```

### Step 3 — Result / Celebration Screen

After completing all 7 questions, show a result screen before "Finish":

```
┌─────────────────────────────────┐
│                                  │
│     🎉                           │
│     Your Starting BELo           │
│                                  │
│         1 4 5 0                  │  ← large, Barlow Condensed
│       🥈 Bạc (Silver)            │  ← tier badge with glow
│                                  │
│  Based on your answers, you'll   │
│  start in the Silver tier.       │
│  Play 5 games to calibrate.     │
│                                  │
│  [Skip] [🚀 Start Playing]      │
│                                  │
└─────────────────────────────────┘
```

- ELO number: `font-barlow-condensed text-5xl font-bold`
- Tier badge: scale-up animation with gold glow
- Background: subtle radial gradient from brand gold

### Step 4 — Responsive Refinements

- Mobile: wizard card takes full width with `px-4`
- Option cards: min height `52px`, text `text-base`
- Progress bar: fixed at top of viewport on mobile
- ELO preview: positioned bottom-center on mobile, bottom-right on desktop
- Back/Next buttons: full width on mobile, inline on desktop

### Step 5 — Accessibility

- Radio options use `role="radiogroup"` + `role="radio"`
- Keyboard navigation: arrow keys between options
- Focus visible outline on selected option
- Progress bar has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Skip link announces "Skipping assessment, using default rating"

## Todo List

- [ ] Add slide animations to wizard-step.tsx
- [ ] Implement useAnimatedCounter hook
- [ ] Build result/celebration screen (step 8 in wizard)
- [ ] Responsive tweaks for mobile
- [ ] Accessibility audit (ARIA roles, keyboard nav)
- [ ] Final visual QA against BELo spec

## Success Criteria

- Smooth 150ms step transitions (no jank)
- ELO counter animates on selection change
- Result screen shows tier with celebration feel
- Mobile layout works on 375px width
- Keyboard navigation functional
- Gold accent consistent with BELo design tokens
