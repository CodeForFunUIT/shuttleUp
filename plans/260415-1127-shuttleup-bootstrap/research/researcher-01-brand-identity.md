# ShuttleUp — Brand Identity & Design Proposal

## Brand Personality

**Vibe:** Sporty, energetic, friendly, modern, Vietnamese youth culture
**Tone:** Casual nhưng đáng tin — như một anh bạn chơi cầu lông rủ bạn đi đánh

## Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Electric Lime | `#BFFF00` | CTAs, active states, accents |
| Primary Dark | Deep Teal | `#0D4F4F` | Headers, backgrounds, text |
| Secondary | Coral Energy | `#FF6B6B` | Notifications, alerts, highlights |
| Neutral Light | Soft Cloud | `#F5F5F0` | Backgrounds, cards |
| Neutral Dark | Charcoal | `#1A1A2E` | Dark mode background |
| Accent | Electric Blue | `#00D4FF` | Links, ELO badges, info |

> Lý do: Lime + Teal tạo cảm giác năng động, thể thao (gợi nhớ shuttlecock).
> Coral cho cảm giác urgency (slot sắp hết). Electric Blue cho thông tin, trust.

## Typography

| Role | Font | Weight | Fallback |
|------|------|--------|----------|
| Headings | **Space Grotesk** | 600–700 | system-ui |
| Body | **Inter** | 400–500 | system-ui |
| Mono/Code | **JetBrains Mono** | 400 | monospace |

> Space Grotesk: geometric sans-serif, sporty feel, tốt cho display text.
> Inter: readable, professional, body text chuẩn.

## Logo Concept

- Shuttlecock icon kết hợp chữ "S" hoặc mũi tên lên (→ "Up")
- Style: Flat, bold, single-color adaptable
- Favicon: shuttlecock icon đơn giản

## Design Principles

1. **Mobile-first** — Design cho mobile trước, scale lên desktop
2. **Card-based layout** — Mỗi session = 1 card (giống Airbnb listings)
3. **Quick actions** — 1-tap booking, minimal forms
4. **Visual hierarchy** — Slot count, price, skill level phải nổi bật
5. **Dark mode** — Hỗ trợ từ đầu (cầu lông thường chơi buổi tối)

## Component Style

- **Buttons**: Rounded-lg, bold, primary = lime on dark
- **Cards**: White bg, subtle shadow, rounded-xl, hover lift effect
- **Badges**: Skill level = color-coded chips (Lime=pro, Blue=mid, Gray=beginner)
- **Inputs**: Outlined, rounded, focus ring = primary color
- **Spacing**: 8px grid system (Tailwind default)

## Inspirations

- Airbnb (card layout, search UX)
- Playo (Indian sports booking app — similar concept)
- Grab (map + booking flow)
- Duolingo (gamification feel for ELO)
