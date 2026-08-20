# ShuttleUp — Design Guidelines

> **Last Updated:** August 20, 2026 | **Status:** Active — Championship Gold

## Brand Identity

| Item | Value |
|------|-------|
| **Name** | ShuttleUp |
| **Tagline** | Tìm bạn chơi cầu lông — nhanh, đúng trình, gần nhà |
| **Tone** | Friendly, sporty, energetic, tournament-grade |
| **Target Mood** | Premium athletic + modern + trustworthy |
| **Emoji** | 🏸 |

## Color Palette: Championship Gold

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Shuttle Gold (Dark) | `#F5C842` | Primary CTA, highlight, active tier badges (Dark Mode) |
| Polished Gold (Light) | `#D9A300` | Primary CTA buttons, focus states (Light Mode) |
| Energy Flame | `#FF6B35` | Secondary highlights, live badges, accent buttons |
| Court Black | `#0B0E14` | Primary dark canvas background |
| Midnight Plate | `#131822` | Dark card surface and modals |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Porcelain Slate | `#F4F6F9` | Light mode canvas background |
| Light Plate | `#FFFFFF` | Light mode card surface |
| Subdued Plate | `#1C2433` | Elevated hover surfaces (Dark) |
| Sky Blue | `#2563EB` / `#38BDF8` | Links, informational chips |

### Semantic Colors

| State | Color | Hex |
|-------|-------|-----|
| Win / Rank Gain | Emerald | `#10B981` (Light) / `#34D399` (Dark) |
| Warning / Urgency | Amber | `#D9A300` (Light) / `#F5C842` (Dark) |
| Loss / Danger | Rally Red | `#EF4444` (Light) / `#F87171` (Dark) |
| Info | Sky Blue | `#2563EB` (Light) / `#38BDF8` (Dark) |

### Dark Mode (Default)

- Background: `#0B0E14` (Pro Court Black)
- Surface / Cards: `#131822` (Midnight Plate)
- Text: `#F0F4F8`
- Muted text: `#8B9BB4`
- Border: `rgba(255, 255, 255, 0.08)`
- Gold Glow: `box-shadow: 0 0 24px -4px rgba(245, 200, 66, 0.35)`

## Typography

### Web (Next.js)

| Role | Font | Weight | Size |
|------|------|--------|------|
| Headings | Barlow Condensed | 600–800 | 24–72px |
| Body | Plus Jakarta Sans / Inter | 400–600 | 14–18px |
| Mono (Stats/Elo) | JetBrains Mono | 400–600 | 12–16px |
| Small / Badges | Plus Jakarta Sans | 500–600 | 12–14px |

### Mobile (Flutter)

- Primary Font: Plus Jakarta Sans / Inter (via Google Fonts or system fallbacks)
- Display / Athletic Numbers: Barlow Condensed / Heavy weight
- Typography scale: Material 3 Athletic styling

## Spacing System

Use a 4px base grid (Tailwind default):

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon padding |
| `sm` | 8px | Tight spacing |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Page margins |

## Component Patterns

### Cards

- Rounded corners: `rounded-xl` (12px)
- Shadow: `shadow-sm` for elevated cards
- Padding: `p-4` to `p-6`
- Border: `border border-gray-200` (light) / `border-gray-800` (dark)

### Buttons

- Primary: Filled green background, white text
- Secondary: Outlined with border
- Ghost: No background, text-only
- Size variants: `sm`, `default`, `lg`
- Rounded: `rounded-full` for pills, `rounded-lg` for standard

### Forms

- Input height: 40–44px
- Label: Above input, medium weight
- Error message: Below input, red text, small size
- Group spacing: 16px between fields

### Navigation

- Top navbar: Fixed, glassmorphism effect on scroll
- Mobile: Bottom tab navigation (Flutter)
- Web mobile: Hamburger menu with slide-out drawer

## Layout Guidelines

### Web Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, full-width cards |
| Tablet | 640–1024px | 2-column grid |
| Desktop | > 1024px | 3-column grid, max-width 1280px |

### Page Structure

```
┌────────────────────────┐
│       Top Navbar       │  ← Fixed, 64px height
├────────────────────────┤
│                        │
│     Page Content       │  ← max-w-7xl, centered
│                        │
│     (responsive grid)  │
│                        │
├────────────────────────┤
│       Footer           │  ← Links, copyright
└────────────────────────┘
```

### Mobile App Structure

```
┌────────────────────────┐
│     Status Bar         │
├────────────────────────┤
│     App Bar            │  ← Title + actions
├────────────────────────┤
│                        │
│     Screen Content     │  ← Scrollable
│                        │
├────────────────────────┤
│   Bottom Navigation    │  ← 4-5 tabs
└────────────────────────┘
```

## Iconography

- **Web:** Lucide React (included in project)
- **Mobile:** Material Icons (built-in) + Lucide Flutter for consistency
- **Style:** Outlined, 24px default, 1.5px stroke

## Motion & Animation

- **Transitions:** 200ms ease-in-out (default)
- **Page transitions:** Fade + slight slide
- **Loading states:** Skeleton screens, not spinners
- **Micro-interactions:** Button press scale (95%), hover lift on cards

## Accessibility

- Minimum contrast ratio: 4.5:1 (WCAG AA)
- Focus indicators on all interactive elements
- Semantic HTML (headings hierarchy, landmarks)
- Touch targets: minimum 44×44px on mobile
- Alt text on all images
