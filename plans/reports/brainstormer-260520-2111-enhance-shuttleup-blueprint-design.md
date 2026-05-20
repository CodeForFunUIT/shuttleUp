# Brainstorm: Enhance ShuttleUp Blueprint Design

> **Date:** 2026-05-20 | **Status:** Brainstorm Complete

---

## 1. Problem Statement

ShuttleUp currently has a functional MVP but the mobile app UI is **plain Material defaults** — white backgrounds, basic cards, no animations, no brand personality. The web app already has a **"BELo" design system** (Shuttle Gold + Energy Orange + Rally Red with Barlow Condensed typography, Framer Motion animations, glassmorphism). The mobile app needs to catch up and the overall brand needs cohesion across platforms.

### Current State Assessment

| Platform | Design Maturity | Animation | Brand Consistency |
|----------|----------------|-----------|-------------------|
| Web (Next.js) | ★★★★☆ | Framer Motion, Ken Burns hero, stagger animations | BELo design system, dark/light mode |
| Mobile (Flutter) | ★★☆☆☆ | Zero animations | Basic emerald theme, no dark mode |

### Key Gaps Identified

- **Mobile**: No hero animation, no page transitions, no micro-interactions
- **Mobile**: Theme uses old emerald palette (`#059669`) — out of sync with web's BELo palette (`#F5C842` gold, `#FF6B35` orange)
- **Mobile**: No dark mode support
- **Mobile**: System default fonts instead of brand typography (Barlow Condensed)
- **Mobile**: No skeleton loading states — uses basic `CircularProgressIndicator`
- **No splash screen** with branded animation
- **No onboarding flow** on mobile

---

## 2. Evaluated Approaches

### Approach A: "BELo Mobile" — Full Design System Port (★ RECOMMENDED)

Port the web's BELo design system to Flutter with platform-native animation patterns.

| Pros | Cons |
|------|------|
| Brand consistency across platforms | Higher upfront effort (~40-60h) |
| Portfolio-grade quality | Need to test on both iOS/Android |
| Reusable design tokens | May require custom widgets |
| Dark mode out of the box | Font loading adds ~200KB |

### Approach B: "Material You + Brand Tint" — Lean Enhancement

Keep Material 3 defaults, only apply brand colors and minor tweaks.

| Pros | Cons |
|------|------|
| Fastest to implement (~15h) | Won't match web quality |
| Uses Flutter's built-in M3 theming | Looks generic |
| Minimal risk | Not portfolio-grade |

### Approach C: "Full Custom UI" — Bespoke Everything

Build every widget from scratch with Rive/Lottie animations.

| Pros | Cons |
|------|------|
| Maximum uniqueness | Massive effort (~100h+) |
| Pixel-perfect control | Maintenance nightmare |
| Impressive for portfolio | Over-engineered for solo dev |

---

## 3. Recommended Solution: "BELo Mobile" Design System

### 3.1 Color Palette — Unified BELo

Align mobile with the web's existing BELo design system:

```
┌─────────────────────────────────────────────────────────┐
│                  BELo Color System                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRIMARY: Shuttle Gold    #F5C842  ████████████████████  │
│  ACCENT:  Energy Orange   #FF6B35  ████████████████████  │
│  DANGER:  Rally Red       #E8385A  ████████████████████  │
│  SUCCESS: Net Green        #4ADE80  ████████████████████  │
│  INFO:    Court Blue       #378ADD  ████████████████████  │
│                                                         │
│  ── Light Mode ──                                       │
│  Background:  #F5F6F8     Surface: #FFFFFF              │
│  Text:        #0D0F12     Muted:   #4B5563              │
│  Border:      rgba(0,0,0,0.12)                          │
│                                                         │
│  ── Dark Mode ──                                        │
│  Background:  #0D0F12     Surface: #161A20              │
│  Text:        #F0F2F5     Muted:   #6B7280              │
│  Border:      rgba(255,255,255,0.12)                    │
│                                                         │
│  ── Brand Gradient ──                                   │
│  #F5C842 → #FF6B35 → #E8385A  (Gold → Orange → Red)    │
│                                                         │
│  ── Skill Tier Badges ──                                │
│  Beginner:     green-100/green-800                      │
│  Intermediate: blue-100/blue-800                        │
│  Advanced:     orange-100/orange-800                    │
│  Pro:          red-100/red-800                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Why this over the old emerald palette:** The web already shipped with BELo. Gold is more distinctive than generic green for a sports app. The warm gradient (Gold → Orange → Red) evokes energy, competition, and action — perfectly aligned with badminton's dynamic nature.

### 3.2 Typography — Barlow Condensed + Barlow

```
┌─────────────────────────────────────────────────────────┐
│                  BELo Typography Scale                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DISPLAY (Barlow Condensed, 600-700)                    │
│  ├── displayLarge:   36px / 1.1  — Hero headlines       │
│  ├── displayMedium:  28px / 1.2  — Section titles       │
│  └── displaySmall:   24px / 1.2  — Card headers         │
│                                                         │
│  HEADLINE (Barlow Condensed, 500-600)                   │
│  ├── headlineLarge:  22px / 1.3  — Page titles          │
│  ├── headlineMedium: 20px / 1.3  — Subsections          │
│  └── headlineSmall:  18px / 1.3  — Widget titles        │
│                                                         │
│  BODY (Barlow, 400)                                     │
│  ├── bodyLarge:      16px / 1.6  — Primary body         │
│  ├── bodyMedium:     14px / 1.5  — Secondary body       │
│  └── bodySmall:      12px / 1.4  — Captions             │
│                                                         │
│  LABEL (Barlow, 500)                                    │
│  ├── labelLarge:     14px / 1.2  — Buttons, CTAs        │
│  ├── labelMedium:    12px / 1.2  — Badges, tags         │
│  └── labelSmall:     11px / 1.2  — Timestamps           │
│                                                         │
│  MONO (JetBrains Mono, 400)                             │
│  └── For stats, ELO scores, prices                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Rationale:** Barlow Condensed is designed for sports/athletic brands. Condensed style fits mobile's constrained width while maintaining impact. Already used on web (BELo §3.1).

### 3.3 Animation Strategy

#### 3.3.1 Hero / Splash Screen Animation

```
┌─────────────────────────────────────────────────────────┐
│              Splash → Home Transition                    │
│                                                         │
│  Frame 0ms: Dark background (#0D0F12)                   │
│  Frame 300ms: Shuttlecock icon fades in + floats up     │
│  Frame 600ms: "ShuttleUp" text slides in from bottom    │
│  Frame 800ms: Brand gradient line sweeps left→right     │
│  Frame 1200ms: Fade out, reveal home page               │
│                                                         │
│  Implementation: Flutter's AnimationController           │
│  + CurvedAnimation(Curves.easeOutCubic)                 │
│  Duration: 1.5s total                                   │
│  Respects: MediaQuery.disableAnimations                 │
└─────────────────────────────────────────────────────────┘
```

**Flutter-specific approach:** Use `AnimationController` + `Tween` combos. No Lottie/Rive dependency needed — keeps app size small. The shuttle icon can use a custom `CustomPainter` or a simple SVG.

#### 3.3.2 Page Transition Animations

| Transition | Animation | Duration | Curve |
|-----------|-----------|----------|-------|
| Push (forward) | Slide right + fade | 300ms | easeOutCubic |
| Pop (back) | Slide left + fade | 250ms | easeInCubic |
| Bottom sheet | Slide up + scale(0.95→1.0) | 300ms | easeOutQuart |
| Tab switch | Crossfade | 200ms | easeInOut |

**Implementation:** Custom `GoRouter` transition builder using `SlideTransition` + `FadeTransition`.

#### 3.3.3 Micro-Interactions

| Element | Animation | Duration |
|---------|-----------|----------|
| Session card tap | Scale(0.98) + shadow lift | 150ms |
| FAB press | Scale(0.9) bounce back | 200ms |
| Badge appear | Scale(0→1) + slight bounce | 300ms |
| Slot counter change | Number roll animation | 400ms |
| Pull-to-refresh | Custom shuttlecock spin | on drag |
| Booking success | Confetti burst + checkmark | 800ms |
| Bottom nav select | Icon scale(1→1.2→1) + dot indicator slide | 250ms |
| Skeleton loading | Shimmer sweep left→right | 1500ms loop |
| Stat counter | Count-up animation | 600ms |
| Card list stagger | Sequential fade-in from bottom | 100ms delay each |

#### 3.3.4 Hero Animation (Home Screen)

The session list page should have a **collapsible hero header** that:

1. Shows a branded gradient banner with greeting text + animated stat counters
2. Collapses into the app bar on scroll (SliverAppBar)
3. Uses `SliverPersistentHeader` for smooth parallax effect
4. Animated search bar slides up from hero → sticks at top

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  ┌──────────────────┐    │  │ ┌──────────────────────┐ │
│  │  Good evening,   │    │  │ │ 🔍 Search sessions.. │ │
│  │  Minh 🏸          │    │  │ └──────────────────────┘ │
│  │                  │    │  │ ╔════════════════════════╗│
│  │  12 sessions     │    │  │ ║  Weekend Smash D7     ║│
│  │  near you        │    │→ │ ║  Sat • 8:00AM         ║│
│  │  ──────────────  │    │  │ ╚════════════════════════╝│
│  │  🔍 Search..     │    │  │ ╔════════════════════════╗│
│  └──────────────────┘    │  │ ║  Casual Rally Q2      ║│
│  ╔════════════════════╗  │  │ ╚════════════════════════╝│
│  ║  Weekend Smash D7  ║  │  │                          │
│  ╚════════════════════╝  │  │                          │
│         EXPANDED          │  │      COLLAPSED           │
└──────────────────────────┘  └──────────────────────────┘
```

### 3.4 Component Redesign Blueprint

#### Session Card — Before vs After

```
BEFORE (current):                    AFTER (BELo Mobile):
┌──────────────────────┐             ┌──────────────────────┐
│ Weekend Smash    6/10│             │ ░░░░ gradient top ░░░░│
│                      │             │ Weekend Smash    ●6/10│
│ ⏰ Sat, Oct 14 •8:00 │             │                      │
│ 📍 Court ABC        │             │ ⏰ Sat, Oct 14 • 8AM  │
│ ──────────────────── │             │ 📍 Court ABC, D7     │
│ Intermediate  120k₫  │             │                      │
└──────────────────────┘             │ ┌────────┐ ┌──────┐  │
                                     │ │Intermed│ │120k₫ │  │
                                     │ └────────┘ └──────┘  │
                                     │ ▓▓▓▓▓▓░░░░ 60% full  │
                                     └──────────────────────┘
                                     ↑ gradient accent top
                                     ↑ progress bar for slots
                                     ↑ rounded badges with BELo colors
```

#### Bottom Navigation — Redesign

```
┌────────────────────────────────────────┐
│                                        │
│   ◉          ○          ○          ○   │
│  Home     Sessions    Map      Profile │
│   ●                                    │  ← animated dot indicator
│  ~~~~                                  │  ← brand gradient underline
└────────────────────────────────────────┘
```

- Active icon: filled + scale 1.15 + BELo Gold color
- Inactive: outlined + muted gray
- Selection dot: animated slide between tabs
- Background: frosted glass (backdrop filter)

### 3.5 Three.js / 3D Element — Web Landing Enhancement

For the **web landing page**, add a 3D shuttlecock visualization:

**Option A: Floating 3D Shuttlecock Hero (Recommended)**
- GLTF shuttlecock model floating in the hero section
- Gentle rotation + hover parallax with mouse movement
- Particle trail effect following the shuttlecock
- Tech: Three.js with `@react-three/fiber` + `@react-three/drei`
- Performance: Only load on desktop (>1024px), show static image on mobile

**Option B: Interactive Court Map 3D**
- 3D isometric view of badminton courts
- Click a court → zoom in → see session details
- Too complex for current scope — Phase 3+

**Option C: 3D Stats Visualization**
- ELO rating as 3D bar chart
- Impressive but niche — few users would see it
- Not worth the bundle size impact

**Recommendation:** Option A only. A floating shuttlecock is the **highest impact-to-effort ratio**. It creates the "wow factor" for portfolio reviewers without over-engineering.

### 3.6 Dark Mode Implementation

```dart
// Dart pseudo-code for BELo dark theme
ThemeData.dark().copyWith(
  colorScheme: ColorScheme.dark(
    primary: Color(0xFFF5C842),      // Shuttle Gold
    secondary: Color(0xFFFF6B35),     // Energy Orange
    surface: Color(0xFF161A20),       // Court Black Surface
    background: Color(0xFF0D0F12),    // Court Black
    error: Color(0xFFE8385A),         // Rally Red
    onPrimary: Color(0xFF0D0F12),
    onSurface: Color(0xFFF0F2F5),
  ),
)
```

---

## 4. Implementation Considerations & Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Font loading increases app size | Low | Google Fonts package with tree-shaking, only load weights 400-700 |
| Animation performance on low-end devices | Medium | Use `RepaintBoundary`, respect `MediaQuery.disableAnimations` |
| Design drift between web and mobile | Medium | Shared design tokens file (JSON → Dart codegen) |
| Over-animating causes nausea/distraction | Medium | Max 1-2 animations per viewport, respect `prefers-reduced-motion` |
| Three.js bundle bloat on web | Medium | Dynamic import, only load on desktop, fallback static image |
| Dark mode contrast issues | Low | Test all colors against WCAG AA 4.5:1 ratio |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| App launch → interactive | <2 seconds |
| Animation frame rate | 60 FPS (16.67ms/frame) |
| WCAG contrast ratio | ≥4.5:1 on all text |
| Brand consistency score | Same palette, fonts, spacing across platforms |
| Portfolio impression | "Wow" factor within 3 seconds of opening app |
| Lighthouse performance (web) | ≥90 after Three.js addition |

---

## 6. Prioritized Enhancement Roadmap

### Phase 1: Foundation (~8-10h)
- [ ] Port BELo color palette to Flutter `AppTheme`
- [ ] Add Barlow Condensed + Barlow fonts via `google_fonts` package
- [ ] Build `AppColors`, `AppTypography`, `AppSpacing` design token files
- [ ] Implement dark mode theme + `ThemeMode` toggle
- [ ] Create reusable animation utility classes

### Phase 2: Core Animations (~10-12h)
- [ ] Branded splash screen with shuttlecock animation
- [ ] Custom page transition builder for GoRouter
- [ ] Shimmer skeleton loading widgets
- [ ] Session card redesign with gradient top + progress bar
- [ ] Staggered list animations for session feed

### Phase 3: Hero & Interaction (~8-10h)
- [ ] SliverAppBar hero with collapsing gradient header
- [ ] Animated stat counters (sessions near you, players online)
- [ ] Bottom navigation redesign with animated indicator
- [ ] Micro-interactions on all buttons/cards
- [ ] Pull-to-refresh with custom shuttlecock spinner

### Phase 4: Polish & Portfolio (~6-8h)
- [ ] Booking success confetti animation
- [ ] Profile page with animated ELO gauge
- [ ] Auth page redesign with branded hero
- [ ] Accessibility audit (reduced motion, contrast)
- [ ] Cross-platform design consistency review

### Phase 5: Web 3D Enhancement (~8-10h)
- [ ] Three.js floating shuttlecock in web hero section
- [ ] Mouse parallax interaction
- [ ] Responsive: 3D on desktop, static image on mobile
- [ ] Performance optimization (lazy load, LOD)

**Total estimated effort: 40-50 hours**

---

## 7. Consensus & Final Decisions

| Decision | Choice |
|----------|--------|
| **Color Palette** | ✅ Port BELo Gold/Orange to Flutter — cross-platform consistency |
| **Typography** | ✅ Barlow Condensed (headings) + Barlow (body) — matches web |
| **Three.js Scope** | ✅ Floating 3D shuttlecock in hero only — high impact, manageable effort |
| **Animation Scope** | ✅ **Full premium** — all 7 animation features |
| **Next Step** | ✅ Create phased implementation plan |

### Animation Features Confirmed (All)
1. Branded splash screen with shuttlecock animation
2. Collapsing hero header with gradient + animated stats
3. Page transition animations (slide + fade)
4. Session card redesign with micro-interactions
5. Shimmer skeleton loading states
6. Bottom navigation with animated indicator
7. Booking success confetti + profile ELO gauge

## 8. Next Steps

→ Proceed to **implementation plan** with 5 phases, ~40-50h total effort.
