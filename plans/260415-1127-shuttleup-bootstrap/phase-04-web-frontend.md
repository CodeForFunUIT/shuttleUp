# Phase 4 — Web Frontend

## Priority: 🟡 High

## Overview

Build the Next.js 15 web app with Tailwind + shadcn/ui. Mobile-first responsive design with dark mode support.

## Key Pages

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Landing + session feed | No |
| `/sessions` | Search & filter sessions | No |
| `/sessions/[id]` | Session detail + booking | No |
| `/sessions/[id]/book` | Guest booking form (name + phone) | No |
| `/login` | Host login (Better Auth) | No |
| `/register` | Host registration | No |
| `/dashboard` | Host dashboard | Host only |
| `/dashboard/sessions/new` | Create new session | Host only |
| `/dashboard/sessions/[id]` | Manage session + bookings | Host only |
| `/profile` | User profile + ELO | Logged in |
| `/profile/[id]` | Public profile view | No |

## Component Architecture

```
src/
├── app/
│   ├── (public)/           ← Guest-accessible routes
│   │   ├── page.tsx        ← Landing / feed
│   │   ├── sessions/
│   │   └── login/
│   ├── (dashboard)/        ← Host-only routes (protected)
│   │   ├── layout.tsx      ← Dashboard shell
│   │   └── sessions/
│   └── layout.tsx          ← Root layout
├── components/
│   ├── ui/                 ← shadcn/ui components
│   ├── session/            ← Session card, detail, filters
│   ├── booking/            ← Booking form, status
│   ├── dashboard/          ← Host management components
│   └── layout/             ← Nav, footer, sidebar
├── lib/
│   ├── auth.ts             ← Better Auth client
│   ├── api.ts              ← API client (fetch wrapper)
│   └── utils.ts
└── styles/
    └── globals.css
```

## Implementation Steps

1. Setup shadcn/ui + design tokens (colors, fonts from brand identity)
2. Build layout components (navbar, footer, mobile nav)
3. Landing page with session feed (SSR)
4. Search & filter page with URL params
5. Session detail page (SSR + client interactions)
6. Guest booking form (name + phone, no auth)
7. Better Auth login/register pages
8. Host dashboard layout
9. Create session form (single + recurring)
10. Manage bookings list
11. Profile page + ELO display
12. Dark mode toggle
13. PWA manifest + service worker for local push

## Todo

- [x] Design system setup (shadcn/ui + custom theme)
- [x] Layout components (nav, footer, mobile menu)
- [x] Landing page
- [x] Session feed + search/filter
- [x] Session detail + booking
- [x] Guest booking form
- [x] Auth pages (login/register)
- [x] Host dashboard
- [ ] Create session form
- [ ] Manage bookings
- [ ] Profile page
- [ ] Dark mode
- [ ] Responsive polish
- [ ] Service worker (local push)

## Success Criteria

- All pages render correctly on mobile + desktop
- Guest can find and book a session without login
- Host can create/manage sessions from dashboard
- Dark mode works throughout
- Lighthouse score > 90 performance
