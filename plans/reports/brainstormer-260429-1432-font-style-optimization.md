# Font & Style Optimization — ShuttleUp Brainstorm

## Problem Statement

Current font setup (Barlow Condensed / Barlow / Geist) feels generic. Need typography and styling that reflects **competitive sports/badminton** identity while maintaining readability and modern aesthetics.

## Current Font Stack

| Role | Font | Source | Issue |
|------|------|--------|-------|
| Headings | Barlow Condensed (700,800) | Google Fonts + CSS | Generic sports feel, not distinctive |
| Body | Barlow (300-600) | Google Fonts + CSS | Decent but bland |
| Mono | Geist Mono | next/font | Fine for code |
| Fallback | Geist Sans | next/font (layout.tsx) | Set as CSS var but overridden by Barlow in globals.css |

**Core issue:** Barlow Condensed is a safe sports font but lacks personality. The system doesn't feel *distinctive* or *premium* for a competitive ranking platform.

## Options Evaluated (UI/UX Pro Max Data)

### Option A: Gaming Bold — `Russo One / Chakra Petch` ❌ Too heavy

- **Mood:** gaming, esports, action
- **Pros:** Very distinctive, competitive feel, great for leaderboards
- **Cons:** Russo One is single-weight only (can't vary for different heading levels). Chakra Petch body text is less readable than Barlow. Feels too "gamer" for a community badminton app.

### Option B: Keep Current — `Barlow Condensed / Barlow` ⚠️ Safe but bland

- **Mood:** sports, fitness, athletic
- **Pros:** Already integrated, condensed for impact, proven sports pairing
- **Cons:** Generic. Nike, Adidas, every gym website uses it. Doesn't differentiate ShuttleUp.

### Option C: Startup Bold — `Outfit / Rubik` ⚠️ Too startup-y

- **Mood:** startup, innovative, bold, dynamic
- **Pros:** Modern, clean, multiple weights available
- **Cons:** Doesn't say "sports" at all. Would feel like a SaaS product.

### Option D: Bold Statement — `Bebas Neue / Source Sans 3` ⚠️ One-dimensional

- **Mood:** bold, impactful, dramatic
- **Pros:** Bebas Neue is iconic for sports headlines
- **Cons:** All-caps only for headings, limits flexibility. Source Sans 3 is corporate.

### Option E: `Space Grotesk / DM Sans` ✅ RECOMMENDED

- **Mood:** tech, modern, innovative, bold
- **Pros:**
  - Space Grotesk has **unique character** — geometric with subtle quirks that feel premium
  - DM Sans is **highly readable** — proven for dashboards and data-heavy UIs
  - Both have full weight ranges (400-700)
  - **Matches ShuttleUp's identity**: tech-forward sports platform with ranking system (not just another gym app)
  - Great for numbers/stats (ELO scores, leaderboards)
  - Google Fonts available — no hosting needed
- **Cons:** Less "athletic" than Barlow Condensed. Mitigate with bold weights + uppercase tracking for section headers.

### Option F: Hybrid — `Space Grotesk (headings) / Barlow (body)` ⭐ BEST FIT

- **Rationale:** Keep Barlow's sports readability for body text, upgrade headings to Space Grotesk for the tech/premium feel
- **Pros:**
  - Space Grotesk headings = distinctive, premium, great for ELO numbers
  - Barlow body = already tested, sports-appropriate, readable
  - Minimal migration — only change `--font-display`, keep `--font-body`
  - The geometric shapes of Space Grotesk complement Barlow's semi-condensed form
- **Cons:** Mixing two different font families. But this is standard practice.

## Recommendation: Option F (Hybrid)

```
Headings:  Space Grotesk (500, 600, 700) → --font-display
Body:      Barlow (300, 400, 500, 600) → --font-body (keep current)
Mono:      Geist Mono → --font-mono (keep current)
```

### Why not go full Space Grotesk + DM Sans?
Barlow is already loaded, tested, and sports-appropriate. Replacing body font is high-risk for minimal gain. Space Grotesk as heading font alone creates enough differentiation.

### Style Refinements to Complement

| Element | Current | Proposed |
|---------|---------|----------|
| Heading weight | 700-800 | 600-700 (Space Grotesk reads heavier at same weight) |
| Heading tracking | `tracking-tight` | Keep `tracking-tight` — Space Grotesk is naturally well-spaced |
| ELO numbers | Body font | `font-display` — Space Grotesk's numerals are distinctive |
| Section labels | Uppercase Barlow | Uppercase Space Grotesk w/ `tracking-wider` |
| Simulator tabs | Generic text | `font-display` for tab labels |

### Migration Scope

| File | Change |
|------|--------|
| `globals.css` | Replace Barlow Condensed import with Space Grotesk |
| `globals.css` | Update `--font-display` to `'Space Grotesk'` |
| `layout.tsx` | No change needed (CSS import handles it) |
| Components | No changes — all use `font-display` CSS var already |

**Estimated effort:** ~10 minutes. Change 2 lines in `globals.css`.

## Visual Preview (Mental Model)

```
BEFORE (Barlow Condensed):
╔═══════════════════════════════════════╗
║  TRẢI NGHIỆM BELO RANKING           ║  ← Wide condensed, generic sports
║  Giả lập tính điểm ELO cho cầu lông  ║  ← Barlow body, readable
╚═══════════════════════════════════════╝

AFTER (Space Grotesk):
╔═══════════════════════════════════════╗
║  Trải nghiệm BELo Ranking           ║  ← Geometric, premium, techy
║  Giả lập tính điểm ELO cho cầu lông  ║  ← Barlow body, same readable
╚═══════════════════════════════════════╝
```

## Emoji → SVG Icons (Bonus Fix)

Per UI/UX Pro Max pre-delivery checklist: **No emojis as icons**. Current simulator tabs use emojis (🏸 👥 🔀). Should replace with Lucide SVG icons:

| Current | Replace With |
|---------|-------------|
| 🏸 | `<Swords />` or `<Target />` (Lucide) |
| 👥 | `<Users />` (Lucide) |
| 🔀 | `<Shuffle />` (Lucide) |

## Next Steps

1. **Quick win:** Update `globals.css` — swap heading font to Space Grotesk (~2 min)
2. **Optional:** Replace tab emojis with Lucide icons (~5 min)
3. **Verify:** Check all pages for heading alignment, line-height, spacing
