# UI/UX Audit Report — ShuttleUp Web
> Date: 2026-04-20 | Checked against: Web Interface Guidelines (vercel-labs)

---

## src/app/page.tsx

`page.tsx:13` — Decorative `<span>` (green dot) missing `aria-hidden="true"`
`page.tsx:26` — `<ArrowRight>` icon inside button missing `aria-hidden="true"`
`page.tsx:17` — h1 missing `text-wrap: balance` / `text-pretty` (headlines prone to widows)
`page.tsx:44,51,58` — Feature icon divs (`MapPin`, `Star`, `Calendar`) missing `aria-hidden="true"`
`page.tsx:9` — `bg-white` hardcoded — won't adapt to dark mode (use `bg-background`)
`page.tsx:39` — `bg-slate-50` hardcoded — won't adapt to dark mode (use `bg-muted`)
`page.tsx:47,54,61` — Feature description `text-slate-600` hardcoded — use `text-muted-foreground`

---

## src/components/layout/Navbar.tsx

`Navbar.tsx:12` — `<nav>` missing `aria-label="Main navigation"` (accessibility landmark)
`Navbar.tsx:14` — Logo link has no skip-to-content link before it (guideline: include skip link)
`Navbar.tsx:14` — "ShuttleUp 🏸" — emoji in text not wrapped with `aria-hidden` + visually hidden label alternative
`Navbar.tsx:21` — ThemeToggle (icon-only button) — verify it has `aria-label` (not visible from this file)

---

## src/app/login/page.tsx

`login.tsx:52-59` — Email input missing `autocomplete="email"` and `name="email"`
`login.tsx:63-69` — Password input missing `autocomplete="current-password"` and `name="password"`
`login.tsx:55` — Placeholder `"host@shuttleup.com"` should end with `…` → `"host@shuttleup.com…"` or use pattern hint format
`login.tsx:52` — Email input missing `spellCheck={false}`
`login.tsx:72` — Loading text `"Signing in..."` → `"Signing in…"` (ellipsis rule)
`login.tsx:29` — Error toast only; no inline error next to field — errors should be inline for forms
`login.tsx:77` — Footer says "Mock Credentials work with Better Auth" — should be removed before production (dev artifact)

---

## src/app/register/page.tsx

`register.tsx:82` — Name input missing `autocomplete="name"` and `name="name"`
`register.tsx:95` — Email input missing `autocomplete="email"`, `name="email"`, `spellCheck={false}`
`register.tsx:108` — Password input missing `autocomplete="new-password"`, `name="password"`
`register.tsx:82,95,108` — All placeholders missing `…` suffix per guideline
`register.tsx:115` — Register button label "Sign up" — fine, but loading state shows only spinner with no text → add "Creating account…"
`register.tsx:67` — h2 "Create an account" — should be Title Case: already fine ✓
`register.tsx:69` — Description uses "your ELO" — first person ok here (second person guideline applies to instructions)

---

## src/app/sessions/page.tsx

`sessions.tsx:30` — Loading text `"Loading sessions..."` → `"Loading sessions…"` (ellipsis rule)
`sessions.tsx:62` — `transition-shadow` on Card — acceptable (not `transition: all`) ✓
`sessions.tsx:29,37,49` — Loader/AlertCircle/Calendar icons in state views missing `aria-hidden="true"`
`sessions.tsx:78,82` — `format()` from date-fns is fine, but not server-safe — could cause hydration mismatch if used in SSR context. Currently `"use client"` so OK ✓
`sessions.tsx:86` — "Skill: INTERMEDIATE" — raw enum value exposed to user; should map to readable label ("Intermediate")
`sessions.tsx:67` — "{session.availableSlots} slots left" — when 0, "0 slots left" is odd; prefer "Full" or show differently

---

## src/app/globals.css

`globals.css:52` — `:root` missing `color-scheme: light` declaration (guideline: fixes scrollbar/inputs theming)
`globals.css:86` — `.dark` missing `color-scheme: dark` declaration — native browser elements (scrollbar, inputs) won't follow dark theme
`globals.css:121` — `outline-ring/50` applied globally — verify this provides sufficient focus visibility (4.5:1 contrast ratio minimum)

---

## src/app/layout.tsx

`layout.tsx` — No skip-to-content link (`<a href="#main-content">Skip to content</a>`) before Navbar
`layout.tsx:49` — `<main>` missing `id="main-content"` for skip link target

---

## Summary by Severity

### 🔴 High (Accessibility / Functional)
| # | Issue | File |
|---|---|---|
| 1 | Missing `color-scheme: light/dark` in CSS | `globals.css:52,86` |
| 2 | `<nav>` missing `aria-label` | `Navbar.tsx:12` |
| 3 | No skip-to-content link | `layout.tsx` |
| 4 | Form inputs missing `autocomplete` + `name` | `login.tsx`, `register.tsx` |
| 5 | Icon-only decorative icons not `aria-hidden` | `page.tsx`, `sessions.tsx` |

### 🟡 Medium (UX / Copy)
| # | Issue | File |
|---|---|---|
| 6 | Loading text uses `...` not `…` | `login.tsx:72`, `sessions.tsx:30` |
| 7 | Skill level shown as raw enum (`INTERMEDIATE` → "Intermediate") | `sessions.tsx:86` |
| 8 | "0 slots left" should show "Full" | `sessions.tsx:67` |
| 9 | Hardcoded `bg-white`, `bg-slate-50`, `text-slate-600` in home page | `page.tsx:9,39,47...` |

### 🟢 Low (Polish)
| # | Issue | File |
|---|---|---|
| 10 | Placeholder strings missing `…` suffix | `login.tsx`, `register.tsx` |
| 11 | h1/h2 headings missing `text-wrap: balance` | `page.tsx:17,70` |
| 12 | Dev artifact in login footer | `login.tsx:77` |
| 13 | Register loading button shows spinner only, no label | `register.tsx:115` |

---

## Design Observations (Visual / UX)

> Beyond code — observations about the current visual design as a whole:

**Color System:** Brand uses `emerald-500/600/700` but the design system (`globals.css`) uses a **neutral gray** primary. The two systems conflict — emerald is applied ad-hoc via hardcoded classes, not as a design token. This makes theming inconsistent.

**Dark Mode Gap:** Dark mode is configured via `next-themes` but multiple pages use `bg-white`, `bg-slate-50`, `text-slate-600` which are hardcoded light-mode values. Dark mode will appear broken on those pages.

**Typography:** Uses Geist Sans (good choice). No heading size scale or weight rhythm defined — each page picks its own sizes. Missing `text-wrap: balance` on headings.

**Hero Section Weakness:** The home page hero is text-only with a flat gradient mask background. No visual anchor (image, illustration, 3D element). Feels generic.

**Navigation:** Navbar is minimal — shows only "Find Group" + Login/Dashboard/Profile. No breadcrumbs, no active states, no mobile hamburger menu.

**Spacing:** Generally consistent use of `py-24` for sections. Card spacing is adequate.

**Missing States:** Sessions page has loading/error/empty — good. Dashboard and Profile have no skeleton loading states.

---

## Next: Step B (ui-ux-pro-max)
Ready to proceed to design direction ideation — color palette, style, component upgrade plan.
