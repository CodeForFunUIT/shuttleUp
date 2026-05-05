# ShuttleUp — Design Guidelines

> **Last Updated:** April 16, 2026 | **Status:** Draft

## Brand Identity

| Item | Value |
|------|-------|
| **Name** | ShuttleUp |
| **Tagline** | Tìm bạn chơi cầu lông — nhanh, đúng trình, gần nhà |
| **Tone** | Friendly, sporty, energetic |
| **Target Mood** | Accessible + modern + trustworthy |
| **Emoji** | 🏸 |

## Color Palette (Proposed)

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Shuttle Green | `#10B981` | Primary CTA buttons, active states |
| Dark Green | `#059669` | Hover states, headers |
| Shuttle Dark | `#0F172A` | Text, dark backgrounds |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Court Orange | `#F59E0B` | Highlights, badges, warnings |
| Sky Blue | `#3B82F6` | Links, info states |
| Soft Gray | `#F1F5F9` | Backgrounds, cards |

### Semantic Colors

| State | Color | Hex |
|-------|-------|-----|
| Success | Green | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |
| Info | Blue | `#3B82F6` |

### Dark Mode

- Background: `#0F172A` → `#1E293B` gradient
- Surface: `#1E293B`
- Text: `#F1F5F9`
- Muted text: `#94A3B8`

## Typography

### Web (Next.js)

| Role | Font | Weight | Size |
|------|------|--------|------|
| Headings | Geist Sans | 600–700 | 24–36px |
| Body | Geist Sans | 400 | 16px |
| Mono | Geist Mono | 400 | 14px |
| Small | Geist Sans | 400 | 14px |

### Mobile (Flutter)

- Use Material 3 Typography scale
- Primary font: System default (SF Pro on iOS, Roboto on Android)
- Consider Google Fonts (Inter) for brand consistency

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
