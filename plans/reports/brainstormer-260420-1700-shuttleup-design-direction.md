# ShuttleUp — Design Direction Report
> Date: 2026-04-20 | Tool: ui-ux-pro-max | Audit Base: code-reviewer-260420-1650-ui-audit.md

---

## 1. Design System Recommendation

### Pattern: Community + Booking (Hybrid)
Kết hợp **Community/Forum Landing** (ưu tiên member showcase, active counts) với **Hero + Social Proof** (trust-building trước CTA). Phù hợp vì ShuttleUp là nền tảng vừa tìm người chơi (community) vừa đặt slot (booking).

**Section order đề xuất:**
```
1. Hero          — Headline mạnh + CTA "Tìm buổi chơi" / "Host buổi chơi"
2. Social Proof  — "1,000+ người chơi", active courts, rating sao
3. Features      — Location, Skill Match, Instant Booking
4. Session Feed  — Live preview 3 buổi gần nhất (thực tế từ API)
5. CTA Banner    — Gọi đăng ký / tạo phòng
```

---

## 2. Style: Bold Athletic Minimalism

**Recommended style:** Exaggerated Minimalism × Athletic Branding

| Attribute | Value |
|---|---|
| Vibe | Bold, energetic, action-forward — cảm giác như app thể thao |
| Whitespace | Nhiều, rõ ràng — không rối |
| Typography | To, condensed heading — body sạch |
| Colors | Contrast cao — primary sáng trên nền tối hoặc ngược lại |
| Borders | Minimal, chỉ dùng dividers nhẹ |
| Shadows | Subtle elevation (card box-shadow) — không nặng nề |
| Dark Mode | First-class — thể thao thường dùng dark UI |

---

## 3. Color Palette

### Option A — Emerald Sports (Giữ brand hiện tại, nâng cấp)
> Phù hợp nếu muốn ít rủi ro, chỉ cải thiện consistency

| Role | Token | Hex | oklch |
|---|---|---|---|
| **Primary** | `--primary` | `#059669` | `oklch(0.59 0.17 162)` |
| **Primary foreground** | `--primary-foreground` | `#FFFFFF` | `oklch(1 0 0)` |
| **Secondary** | `--secondary` | `#D1FAE5` | `oklch(0.95 0.07 162)` |
| **Accent / CTA** | `--accent` | `#F97316` | `oklch(0.70 0.18 48)` |
| **Background** | `--background` | `#F8FAFC` | `oklch(0.98 0 0)` |
| **Foreground** | `--foreground` | `#0F172A` | `oklch(0.14 0 0)` |
| **Muted text** | `--muted-foreground` | `#475569` | `oklch(0.43 0 0)` |
| **Border** | `--border` | `#E2E8F0` | `oklch(0.91 0 0)` |

**Dark mode additions:**
| Role | Hex |
|---|---|
| Background dark | `#0A0F1A` |
| Card dark | `#111827` |
| Primary dark | `#34D399` |

---

### Option B — Electric Blue × Orange (Bold rebrand)
> Phù hợp nếu muốn hướng sports/action mạnh hơn

| Role | Hex |
|---|---|
| Primary | `#2563EB` |
| Secondary | `#60A5FA` |
| CTA | `#F97316` |
| Background | `#F8FAFC` |
| Text | `#1E293B` |

---

## 4. Typography

### Recommended: Barlow Condensed + Barlow
> Được thiết kế cho sports/fitness — condensed heading cho impact, regular body cho readability

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
```

| Usage | Font | Weight | Size |
|---|---|---|---|
| Hero H1 | Barlow Condensed | 800 | `clamp(3rem, 8vw, 7rem)` |
| Section H2 | Barlow Condensed | 700 | `2.5rem` – `3rem` |
| Card titles | Barlow | 600 | `1.25rem` |
| Body text | Barlow | 400 | `1rem` (16px) |
| Labels/caps | Barlow Condensed | 600 | `0.875rem`, uppercase |

### Alternative: Bebas Neue + Source Sans 3
> Nếu muốn bold hơn nữa — Bebas Neue rất phổ biến trong sports branding

---

## 5. Component Upgrade Plan

### Priority 1 — Fix (từ Audit)
| Component | Fix |
|---|---|
| `globals.css` | Thêm `color-scheme: light/dark`. Đổi `--primary` → emerald token |
| `layout.tsx` | Thêm skip-to-content link |
| `Navbar.tsx` | Thêm `aria-label`, mobile hamburger menu, logo SVG thay emoji |
| `login/page.tsx` | Thêm `autocomplete`, `name`, ellipsis loading text |
| `register/page.tsx` | Thêm `autocomplete`, loading label text |
| `sessions/page.tsx` | Map enum → label, fix "0 slots left" → "Full" |
| `page.tsx` (home) | Đổi hardcoded colors → CSS tokens |

### Priority 2 — Enhancement
| Component | Upgrade |
|---|---|
| **Hero section** | Thêm visual anchor: animated shuttlecock / court illustration / glassmorphism card preview |
| **Session Card** | Thêm host avatar, skill badge màu, hover với scale + shadow |
| **Navbar** | Mobile hamburger, active link indicator, user avatar khi login |
| **Color system** | Unify brand primary → design token trong `globals.css` |
| **Typography** | Apply Barlow Condensed cho headings toàn trang |

### Priority 3 — New Components
| Component | Description |
|---|---|
| `SkillBadge` | Badge màu encode skill level (green=Beginner, blue=Inter, orange=Advanced, red=Pro) |
| `SessionCard` (redesigned) | Image/color header, host info, slot indicator visual |
| `StatsBar` | "1,000+ players · 50+ courts · 200+ sessions" — social proof strip |
| `SkeletonCard` | Loading skeleton cho sessions grid |
| `MobileNav` | Slide-in drawer navigation cho mobile |

---

## 6. Page-by-page Design Direction

### Home (`/`)
- **Hero**: Full-width, dark background với emerald gradient overlay. H1 condensed font to. 2 CTA buttons. Animated badge "Live — X buổi đang diễn ra".
- **Features**: 3 cột icon + text — đơn giản, icon từ Lucide (không emoji).
- **Session preview**: Grid 3 card thực từ API với skeleton loading.
- **CTA bottom**: Full-width emerald banner, text lớn.

### Sessions (`/sessions`)
- **Filter bar**: Skill level, ngày, quận — không cần URL state ngay nhưng plan cho tương lai.
- **Grid**: 3 col desktop, 1 col mobile. Cards với hover effect rõ.
- **Empty/Error**: Illustrated empty state, không chỉ text.

### Dashboard (`/dashboard`)
- **Sidebar**: Redesign với avatar, tên user, active indicator.
- **Stats cards**: Số liệu thực + sparkline mini chart.
- **Session list**: Table với status badge màu.

---

## 7. Implementation Priority

```
Phase A (Fix critical audit issues)     — 1-2h
Phase B (Apply design token system)     — 2h
Phase C (Typography + Hero redesign)    — 3h
Phase D (Session Card + Navbar upgrade) — 3h
Phase E (New components)                — 4h
```

---

## Unresolved Questions
- [ ] Có muốn dark mode là default không? (thể thao thường dark-first)
- [ ] Option A (Emerald) hay Option B (Electric Blue) cho color palette?
- [ ] Barlow Condensed hay Bebas Neue cho headings?
- [ ] Có ảnh/illustration thực tế cho hero không? (court photo, player photo)
