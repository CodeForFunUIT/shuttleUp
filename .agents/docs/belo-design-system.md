# BELo Design System
> Style guide, theme & typography cho app cầu lông phong trào.
> Áp dụng cho cả Mobile (iOS/Android) và Web app.

---

## Mục lục

1. [Triết lý thiết kế](#1-triết-lý-thiết-kế)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius & Elevation](#5-border-radius--elevation)
6. [Tier Badges](#6-tier-badges)
7. [Components](#7-components)
8. [Motion & Animation](#8-motion--animation)
9. [Icon System](#9-icon-system)
10. [Responsive Breakpoints](#10-responsive-breakpoints)
11. [Dark / Light Mode](#11-dark--light-mode)
12. [Design Tokens (CSS Variables)](#12-design-tokens-css-variables)

---

## 1. Triết lý thiết kế

**"Nike meets Lichess"** — kỷ luật thể thao, data-driven, không decoration thừa.

| Nguyên tắc | Mô tả |
|---|---|
| **Dark-first** | Nền tối là mặc định. Light mode là tùy chọn, không phải ưu tiên. |
| **Data nổi bật** | Số ELO to, rõ, đứng đầu. UI phục vụ data — không tranh chú ý với nội dung. |
| **Gold là action** | Shuttle Gold chỉ dùng cho CTA, điểm nhấn quan trọng — không dùng trang trí. |
| **Motion = energy** | Transition nhanh (150ms). Delta điểm có animation đếm số khi cập nhật. |
| **Hierarchy rõ ràng** | Người mở app thấy ngay ELO của mình, không cần scroll hay tìm kiếm. |

---

## 2. Color Palette

### 2.1 Brand Colors (Primary)

| Token | Tên | Hex | Dùng cho |
|---|---|---|---|
| `--color-brand-gold` | Shuttle Gold | `#F5C842` | CTA button, highlight ELO, tier Vàng accent |
| `--color-brand-orange` | Energy Orange | `#FF6B35` | Gradient mid, win streak indicator |
| `--color-brand-red` | Rally Red | `#E8385A` | Gradient end, loss indicator (kết hợp với orange) |

**Gradient thương hiệu:**
```css
background: linear-gradient(90deg, #F5C842 0%, #FF6B35 50%, #E8385A 100%);
```
Chỉ dùng cho: accent bar đầu trang, tier Kim Cương, thanh tiến trình ELO cao.

---

### 2.2 Background Surfaces (Dark Mode)

| Token | Hex | Dùng cho |
|---|---|---|
| `--bg-base` | `#0D0F12` | Nền trang chính (Court Black) |
| `--bg-surface` | `#161A20` | Card mặc định, bottom sheet |
| `--bg-elevated` | `#1C2128` | Card nổi, dropdown, modal |
| `--bg-overlay` | `rgba(0,0,0,0.6)` | Overlay modal, bottom sheet backdrop |

---

### 2.3 Background Surfaces (Light Mode)

| Token | Hex | Dùng cho |
|---|---|---|
| `--bg-base` | `#F5F6F8` | Nền trang |
| `--bg-surface` | `#FFFFFF` | Card |
| `--bg-elevated` | `#FFFFFF` | Card nổi |

---

### 2.4 Text Colors

| Token | Dark Mode | Light Mode | Dùng cho |
|---|---|---|---|
| `--text-primary` | `#F0F2F5` | `#0D0F12` | Nội dung chính, số ELO |
| `--text-secondary` | `#9CA3AF` | `#4B5563` | Label phụ, mô tả |
| `--text-muted` | `#6B7280` | `#9CA3AF` | Placeholder, timestamp |
| `--text-inverse` | `#0D0F12` | `#F0F2F5` | Text trên nền sáng (button gold) |

---

### 2.5 Semantic Colors

| Tên | Hex | Token | Dùng cho |
|---|---|---|---|
| Win Green | `#4ADE80` | `--color-win` | Delta dương, thắng |
| Loss Red | `#F87171` | `--color-loss` | Delta âm, thua |
| Info Blue | `#378ADD` | `--color-info` | Thông báo, link |
| Warning Amber | `#F5C842` | `--color-warning` | Cảnh báo lệch trình (dùng chung Gold) |
| Danger Red | `#E8385A` | `--color-danger` | Lệch trình nặng, lỗi |

---

### 2.6 Border Colors

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--border-subtle` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--border-default` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.12)` |
| `--border-strong` | `rgba(255,255,255,0.25)` | `rgba(0,0,0,0.25)` |

---

## 3. Typography

### 3.1 Font Stack

```css
/* UI chính */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Số ELO display lớn */
font-family: 'Barlow Condensed', 'Inter', sans-serif;

/* Số delta, tỉ số, mono data */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

**Lý do chọn:**
- **Inter** — dễ đọc ở size nhỏ trên mobile, hỗ trợ tiếng Việt tốt
- **Barlow Condensed** — cảm giác thể thao, số to mà gọn, phù hợp hiển thị ELO
- **JetBrains Mono** — căn cột số delta/tỉ số trong bảng xếp hạng

---

### 3.2 Type Scale

| Role | Font | Size | Weight | Line Height | Dùng cho |
|---|---|---|---|---|---|
| Display | Barlow Condensed | 40px | 600 | 1.1 | ELO cá nhân trang hồ sơ |
| Heading 1 | Inter | 28px | 500 | 1.25 | Tên màn hình chính |
| Heading 2 | Inter | 22px | 500 | 1.3 | Section title |
| Heading 3 | Inter | 18px | 500 | 1.4 | Card title, tên người chơi |
| Body | Inter | 14px | 400 | 1.6 | Nội dung chính |
| Caption | Inter | 12px | 400 | 1.5 | Timestamp, meta info |
| Label | Inter | 11px | 500 | 1.4 | Badge, tag, tab label |
| Mono | JetBrains Mono | 14px | 400 | 1.5 | Delta +/−, tỉ số, số liệu |

---

### 3.3 Quy tắc Typography

- **Chỉ dùng 2 weight**: 400 (regular) và 500 (medium). Không dùng 600, 700 — quá nặng trên nền tối.
- **Số ELO** trên màn hình chính: luôn dùng Barlow Condensed, size tối thiểu 32px.
- **Delta điểm** (+18, −7): luôn dùng mono, màu semantic (win/loss), không bao giờ muted.
- **Tên người chơi**: Inter 500, không uppercase, không letter-spacing.
- **Label tier**: uppercase, letter-spacing 0.05em, size 11px.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

```
4px   — gap nhỏ nhất (icon + label)
8px   — spacing nội bộ component
12px  — gap giữa các element trong card
16px  — padding card, khoảng cách hàng
20px  — section spacing nhỏ
24px  — padding màn hình (horizontal)
32px  — section spacing lớn
48px  — khoảng cách giữa các section chính
```

### 4.2 Layout Grid

**Mobile:**
- Horizontal padding: 16px
- Grid: 4 cột, gutter 8px
- Max content width: 100%

**Web / Tablet:**
- Horizontal padding: 24px
- Grid: 12 cột, gutter 16px
- Max content width: 1200px, căn giữa

### 4.3 Bottom Navigation (Mobile)

Chiều cao: 56px + safe area inset. 4–5 tab items. Active tab dùng Shuttle Gold icon.

---

## 5. Border Radius & Elevation

### 5.1 Border Radius

| Token | Value | Dùng cho |
|---|---|---|
| `--radius-sm` | 6px | Badge, tag nhỏ, input |
| `--radius-md` | 10px | Button, chip, stat box |
| `--radius-lg` | 14px | Card chính, bottom sheet |
| `--radius-xl` | 20px | Modal, full-screen sheet |
| `--radius-full` | 9999px | Avatar, pill button |

### 5.2 Elevation (Dark Mode)

Không dùng drop shadow trên nền tối — elevation thể hiện qua màu nền sáng dần:

| Level | Background | Dùng cho |
|---|---|---|
| 0 | `#0D0F12` | Nền trang |
| 1 | `#161A20` | Card cơ bản |
| 2 | `#1C2128` | Card nổi, modal |
| 3 | `#232930` | Dropdown, tooltip |

**Light mode**: dùng `box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)` cho card.

---

## 6. Tier Badges

Màu tier tách biệt hoàn toàn khỏi brand palette để tránh nhầm lẫn semantic.

| Tier | ELO | Background | Text Color | Border |
|---|---|---|---|---|
| Kim Cương | ≥ 2000 | `#E8B4B8` | `#2D0A0C` | none |
| Vàng | 1700–1999 | `#F5C842` | `#3D2800` | none |
| Bạc | 1400–1699 | `#C8CDD6` | `#1A1E24` | none |
| Đồng | 1100–1399 | `#7B9FCC` | `#071629` | none |
| Sắt | 800–1099 | `#8AAE72` | `#0D2305` | none |
| Nhập môn | < 800 | `#9B8FD4` | `#0D0826` | none |

```css
.badge-tier {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
```

---

## 7. Components

### 7.1 CTA Button

**Primary (Gold):**
```css
background: #F5C842;
color: #0D0F12;
border: none;
border-radius: var(--radius-md);
padding: 12px 24px;
font-size: 14px;
font-weight: 500;
letter-spacing: 0.02em;

/* Hover */
background: #E8B830;

/* Active */
transform: scale(0.97);
```

**Ghost:**
```css
background: transparent;
color: #F0F2F5;
border: 1px solid rgba(255,255,255,0.25);
border-radius: var(--radius-md);
padding: 12px 24px;
font-size: 14px;
font-weight: 500;
```

---

### 7.2 Player Card

```
┌─────────────────────────────────────────┐
│  [Avatar]  Tên người chơi    [Tier]      │
│            1,847 ELO                     │
│            ████████░░░░  82%             │
└─────────────────────────────────────────┘
```

- Avatar: 40px, border-radius full, màu nền dùng accent tương ứng tier
- ELO number: Barlow Condensed 24px 500, `--text-primary`
- Progress bar: height 4px, gradient Gold→Orange, track `rgba(255,255,255,0.1)`
- Tier badge: góc phải, size nhỏ (11px)

---

### 7.3 Match History Row

```
┌──────────────────────────────────────────────┐
│  vs Hùng Anh          2 – 0      +18         │
│  Đơn nam · hôm qua    Thắng    (màu xanh)    │
└──────────────────────────────────────────────┘
```

- Tên đối thủ: Inter 500 14px
- Tỉ số: mono 14px `#F5C842`
- Delta: mono 14px, `--color-win` / `--color-loss`
- Timestamp + type: caption 11px muted
- Tap → vào chi tiết trận

---

### 7.4 Stat Box

```css
background: rgba(255,255,255,0.05);
border: 0.5px solid rgba(255,255,255,0.08);
border-radius: var(--radius-md);
padding: 12px 16px;
text-align: center;
```

- Số liệu: Barlow Condensed 24px hoặc Inter 20px 500
- Label: 11px muted uppercase

---

### 7.5 Tab Navigation

```css
/* Container */
background: rgba(255,255,255,0.05);
border-radius: var(--radius-md);
padding: 3px;

/* Active tab */
background: var(--bg-elevated);
color: var(--text-primary);
border-radius: calc(var(--radius-md) - 2px);

/* Inactive */
color: var(--text-muted);
```

---

### 7.6 ELO Delta Toast

Hiển thị sau khi ghi kết quả trận — xuất hiện từ bottom, tự dismiss sau 3s:

```
┌─────────────────────┐
│  +18 ELO            │
│  1,829 → 1,847      │
└─────────────────────┘
```

- Background: `--bg-elevated`
- Delta: Barlow Condensed 28px `--color-win` / `--color-loss`
- Số ELO: caption muted, hiện cả trước → sau
- Animation: slide-up 200ms ease-out, fade-out 300ms

---

### 7.7 Leaderboard Row

```
#  Avatar  Tên          ELO     Tier     Δ7d
1  [MT]    Minh Tuấn   1,847   Vàng    +42
2  [NK]    Nam Khánh   1,801   Vàng    +12
3  [HL]    Hải Linh    1,756   Vàng    −8
```

- Số thứ tự: Barlow Condensed 16px muted
- Top 3 dùng màu: Gold / Silver / Bronze cho số thứ tự
- Δ7d: mono, semantic color win/loss
- Tap row → trang hồ sơ người chơi

---

## 8. Motion & Animation

### 8.1 Duration & Easing

| Loại | Duration | Easing |
|---|---|---|
| Micro (feedback) | 100ms | ease-out |
| Standard (transition) | 150ms | ease-in-out |
| Enter (appear) | 200ms | ease-out |
| Exit (disappear) | 150ms | ease-in |
| Số đếm ELO | 300ms | ease-out |
| Page transition | 250ms | ease-in-out |

### 8.2 ELO Counter Animation

Khi điểm thay đổi, số đếm từ giá trị cũ lên/xuống giá trị mới:

```javascript
function animateElo(from, to, duration = 300, element) {
  const start = performance.now();
  const diff = to - from;
  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.textContent = Math.round(from + diff * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
```

### 8.3 Delta Highlight

Sau khi ELO cập nhật, số delta (+18 / −7) xuất hiện và fade:

```css
@keyframes deltaIn {
  0%   { opacity: 0; transform: translateY(-8px); }
  20%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-4px); }
}
.delta-pop {
  animation: deltaIn 2s ease forwards;
}
```

### 8.4 Tier Up Celebration

Khi người chơi lên tier mới: full-screen overlay 1.5s với tên tier mới, màu tier, confetti nhẹ (particles). Không dùng cho tier down.

---

## 9. Icon System

Dùng **Lucide Icons** (open source, consistent stroke width 1.5px).

| Icon | Dùng cho |
|---|---|
| `trophy` | Tier, giải thưởng |
| `swords` | Trận đấu, đối kháng |
| `trending-up` | ELO tăng |
| `trending-down` | ELO giảm |
| `users` | Đôi, club |
| `user` | Đơn, hồ sơ cá nhân |
| `calendar` | Lịch sử, ngày |
| `plus-circle` | Ghi kết quả |
| `bar-chart-2` | Thống kê |
| `settings` | Cài đặt |
| `zap` | Synergy, hóa học cặp đôi |

**Quy tắc:**
- Size mặc định: 20px (mobile), 18px (web)
- Stroke: 1.5px
- Không fill — chỉ outline
- Màu: `--text-secondary` mặc định, `#F5C842` khi active

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile S | < 375px | 1 cột, padding 12px |
| Mobile | 375–767px | 1 cột, padding 16px |
| Tablet | 768–1023px | 2 cột, padding 24px |
| Desktop | 1024–1279px | 3 cột, max-width 960px |
| Desktop L | ≥ 1280px | 3–4 cột, max-width 1200px |

**Web navigation:**
- Mobile: bottom tab bar (4 items)
- Tablet/Desktop: sidebar trái (240px), collapse được

---

## 11. Dark / Light Mode

App ưu tiên **dark mode**, nhưng hỗ trợ đầy đủ cả hai.

### 11.1 Phát hiện preference

```css
@media (prefers-color-scheme: dark) {
  :root { /* dark tokens */ }
}
@media (prefers-color-scheme: light) {
  :root { /* light tokens */ }
}
```

Ngoài ra cho phép user override thủ công trong Settings.

### 11.2 Lưu ý khi design Light Mode

- Background chính: `#F5F6F8` (không phải trắng thuần — tránh chói)
- Card: `#FFFFFF` với shadow nhẹ thay vì border
- Brand Gold trên nền trắng: cần thêm border `1px solid #E8B830` để tránh lost contrast
- Tier badge màu giữ nguyên (đã thiết kế đủ contrast cả hai mode)
- ELO number: chuyển sang `#0D0F12`

---

## 12. Design Tokens (CSS Variables)

```css
:root {
  /* Brand */
  --color-brand-gold: #F5C842;
  --color-brand-orange: #FF6B35;
  --color-brand-red: #E8385A;
  --color-brand-gradient: linear-gradient(90deg, #F5C842 0%, #FF6B35 50%, #E8385A 100%);

  /* Semantic */
  --color-win: #4ADE80;
  --color-loss: #F87171;
  --color-info: #378ADD;
  --color-warning: #F5C842;
  --color-danger: #E8385A;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Typography */
  --font-display: 'Barlow Condensed', 'Inter', sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Motion */
  --duration-micro: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Dark Mode (default) */
[data-theme="dark"], @media (prefers-color-scheme: dark) {
  --bg-base: #0D0F12;
  --bg-surface: #161A20;
  --bg-elevated: #1C2128;
  --text-primary: #F0F2F5;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;
  --text-inverse: #0D0F12;
  --border-subtle: rgba(255,255,255,0.08);
  --border-default: rgba(255,255,255,0.12);
  --border-strong: rgba(255,255,255,0.25);
}

/* Light Mode */
[data-theme="light"], @media (prefers-color-scheme: light) {
  --bg-base: #F5F6F8;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --text-primary: #0D0F12;
  --text-secondary: #4B5563;
  --text-muted: #9CA3AF;
  --text-inverse: #F0F2F5;
  --border-subtle: rgba(0,0,0,0.06);
  --border-default: rgba(0,0,0,0.10);
  --border-strong: rgba(0,0,0,0.20);
}
```

---

*BELo Design System v1.0 — thiết kế cho app cầu lông phong trào.*
*Kết hợp với `belo-badminton-ranking-spec.md` để có đầy đủ logic nghiệp vụ + giao diện.*
