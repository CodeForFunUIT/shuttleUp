# Homepage Animation & Motion — Brainstorm

## Problem Statement

Homepage is well-designed but feels **static and lifeless**. No scroll animations, no entrance effects, no ambient motion. User wants animation but balanced — **not too heavy** to avoid performance issues.

## Current State

- **Existing animations:** Only `animate-pulse` on live badge, `hover:scale-105` on images
- **framer-motion:** Already installed (`^12.38.0`) ← great, no new deps needed
- **Three.js:** Not installed, user mentions it but warns about weight
- **No scroll-triggered reveals** — everything appears instantly
- **No hero animation** — static text + image

## Animation Budget Strategy

Per UI/UX Pro Max guidelines:
- Duration: **150-300ms** for micro-interactions
- Use **transform/opacity** only (GPU-accelerated, no layout recalc)
- Respect **prefers-reduced-motion**
- Easing: **ease-out** for enter, **ease-in** for exit

## Approaches Evaluated

### 1. CSS-only animations (Tailwind + @keyframes)
- **Pros:** Zero bundle size, fast, simple
- **Cons:** No scroll-triggered reveal, limited stagger control
- **Verdict:** Good for base layer, not enough alone

### 2. Framer Motion scroll animations ✅ RECOMMENDED (primary)
- **Pros:** Already installed, excellent scroll-triggered `whileInView`, stagger via `variants`, `prefers-reduced-motion` built-in
- **Cons:** ~40KB added to client bundle (already included)
- **Verdict:** Perfect fit — covers 90% of needs

### 3. Three.js 3D hero background ⚠️ CONDITIONAL
- **Pros:** Wow factor, particle effects look amazing
- **Cons:** +150KB min bundle, WebGL context, mobile performance risk, SSR complexity
- **Verdict:** Too heavy for a single section. **Save for dedicated "about" or "ranking" page later**

### 4. Lottie animations for icons
- **Pros:** Premium icon animation, lightweight per-animation
- **Cons:** New dependency, need to source/create Lottie files, learning curve
- **Verdict:** Overkill for MVP. Nice-to-have later.

### 5. CSS scroll-driven animations (native)
- **Pros:** Zero JS, native browser support
- **Cons:** Limited browser support (no Safari < 16.4), less control
- **Verdict:** Too early to rely on exclusively

## ⭐ Recommended Solution: Layered Animation System

### Layer 1: CSS Foundation (globals.css)

Add base animation utilities via Tailwind `@keyframes`:

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Reduced motion override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Layer 2: Framer Motion — Scroll-triggered reveals (main impact)

Create a reusable `<AnimatedSection>` wrapper component:

```tsx
// components/ui/animated-section.tsx (~40 lines)
"use client";
import { motion } from "framer-motion";

export function AnimatedSection({ children, delay = 0, direction = "up" }) {
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 30 : -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } },
  };
  return (
    <motion.div variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
      {children}
    </motion.div>
  );
}
```

### Layer 3: Staggered children for grids

```tsx
// Used in Features grid, Stats strip, Image strip
<motion.div variants={containerVariants} initial="hidden" whileInView="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={childVariants}>
      {/* card content */}
    </motion.div>
  ))}
</motion.div>
```

### Layer 4: Hero-specific animations

- **Headline:** Letter-by-letter or word-by-word reveal with stagger
- **Badge:** Slide-in from left
- **CTA buttons:** Fade-up with 0.3s delay after headline
- **Background:** Subtle CSS `scale(1.05)` → `scale(1)` zoom on load (Ken Burns effect)

### Layer 5: Ambient subtle CSS effects

- **Floating particles:** Pure CSS `::before`/`::after` pseudo-elements with `animate-float` 
- **Gradient shimmer:** BELo section dark bg gets subtle moving gradient
- **Counter animation:** Stats numbers count up from 0 when in view (framer-motion `useMotionValue`)

## Section-by-Section Animation Plan

| Section | Animation | Library | Performance |
|---------|-----------|---------|-------------|
| **Hero** | Ken Burns bg zoom + staggered text reveal + badge slide-in | CSS + framer-motion | ✅ Light |
| **Stats** | Count-up numbers + fade-in-up stagger | framer-motion | ✅ Light |
| **Features** | Cards fade-in-up with 0.1s stagger | framer-motion | ✅ Light |
| **BELo Simulator** | Section header fade-in + subtle bg gradient animation | CSS + framer-motion | ✅ Light |
| **Image Strip** | Parallax-lite (slight Y-offset on scroll) + scale on hover | CSS | ✅ Light |
| **CTA Banner** | Text fade-in + button pulse on idle | CSS + framer-motion | ✅ Light |

## File Structure

```
src/components/ui/
├── animated-section.tsx      # ~40 lines — reusable scroll reveal wrapper
├── animated-counter.tsx      # ~35 lines — count-up number animation
├── stagger-container.tsx     # ~30 lines — staggered children wrapper
```

```
src/app/
├── globals.css               # Add @keyframes + reduced-motion
├── page.tsx                   # Wrap sections with AnimatedSection
```

## Performance Guardrails

- **No Three.js** on homepage (save for dedicated pages)
- **No Lottie** (extra dependency for low ROI)
- `viewport={{ once: true }}` — animate only first time in view
- All animations use **transform + opacity** only (GPU composited)
- **prefers-reduced-motion** respected globally
- Framer-motion already tree-shakes well with Next.js
- `next/dynamic` for BELo simulator (already client component)

## What NOT to do (Anti-patterns from UI/UX Pro Max)

- ❌ Continuous/infinite animations on decorative elements (distracting)
- ❌ Parallax scroll-jacking (causes nausea — a11y issue)
- ❌ Linear easing (feels robotic)
- ❌ Animations > 500ms (feels sluggish)
- ❌ Scale transforms that shift layout (use transform only)
- ❌ Heavy WebGL on mobile (performance killer)

## Success Criteria

- [ ] Every section has entrance animation on scroll
- [ ] Stats numbers animate counting up
- [ ] Hero has staggered text reveal
- [ ] Feature cards stagger-in with delay
- [ ] prefers-reduced-motion disables all animations
- [ ] No new npm dependencies needed
- [ ] Lighthouse Performance score stays > 90
- [ ] No layout shift from animations (CLS = 0)

## Next Steps

Create `/plan` if approved. Estimated effort: ~2 hours across 3 phases:
1. Create reusable animation components (~20 min)
2. Apply to homepage sections (~45 min)
3. Add CSS ambient effects + test reduced-motion (~30 min)
