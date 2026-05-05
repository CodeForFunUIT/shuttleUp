# Phase 3: Integrate into Homepage

## Context

- [Homepage](file:///d:/portfolio/shuttleUp/shuttleup-web/src/app/page.tsx) — current structure
- [Phase 2: Components](phase-02-simulator-components.md) — must be completed first

## Overview

- **Priority:** Medium
- **Status:** ⬜ Planned (depends on Phase 2)

Add the BELo simulator section to the public homepage between the Features section and Image Strip.

## Related Code Files

| Action | File | Purpose |
|--------|------|---------|
| MODIFY | `src/app/page.tsx` | Add simulator section import + placement |

## Implementation Steps

### 1. Add BELo section to `page.tsx`

**Placement:** Between Features section (line 157) and Image Strip section (line 159).

```tsx
// After Features section (line 157), before Image Strip:

{/* ── BELo Ranking Simulator ─────────────────────────────── */}
<section className="py-24 bg-slate-950 text-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <BeloPublicSimulator />
  </div>
</section>
```

**Section design:**
- Dark background (`bg-slate-950`) to contrast with white sections above/below
- Creates visual "break" that draws attention to the simulator
- Consistent with the dark hero section aesthetic

### 2. Import statement

```tsx
import { BeloPublicSimulator } from "@/components/belo/belo-public-simulator";
```

Note: `page.tsx` stays as Server Component. `BeloPublicSimulator` is `"use client"` — Next.js handles the boundary automatically.

### 3. Verify

- Run `npm run lint` in shuttleup-web
- Run `npm run dev` and check:
  - Homepage loads correctly
  - Simulator section renders between Features and Image Strip
  - All 3 tabs work
  - Mobile responsive
  - Dark background text is readable

## Todo List

- [ ] Add import for `BeloPublicSimulator`
- [ ] Add section between Features and Image Strip
- [ ] Verify responsive layout
- [ ] Run lint check
- [ ] Visual verification in browser

## Success Criteria

- BELo section visible on homepage without scrolling past CTA
- Dark section creates visual contrast
- No layout shift or hydration errors
- Lint passes
