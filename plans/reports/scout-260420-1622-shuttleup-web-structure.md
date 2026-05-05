# Scout Report: shuttleup-web

> **Date:** 2026-04-20 16:22 | **Path:** `d:\portfolio\shuttleUp\shuttleup-web`

---

## 1. Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | `16.2.3` |
| **React** | React 19 | `19.2.4` |
| **Language** | TypeScript | `^5` |
| **Styling** | Tailwind CSS v4 + shadcn/ui (base-nova) | `^4` |
| **UI Components** | shadcn/ui + Radix UI + Lucide Icons | latest |
| **Auth** | Better Auth (client) | `^1.6.4` |
| **State** | Zustand | `^5.0.12` |
| **Data Fetching** | TanStack React Query | `^5.99.0` |
| **HTTP Client** | Axios | `^1.15.0` |
| **Forms** | React Hook Form + Zod | `^7.72.1` / `^4.3.6` |
| **Animation** | Framer Motion | `^12.38.0` |
| **Themes** | next-themes | `^0.4.6` |
| **Toast** | Sonner | `^2.0.7` |
| **Unit Test** | Vitest + Testing Library | `^4.1.4` |
| **E2E Test** | Playwright | `^1.59.1` |

---

## 2. Directory Structure

```
shuttleup-web/
├── public/                          # Static assets
│   ├── manifest.json               # PWA manifest
│   └── sw.js                       # Service worker
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (Navbar+Footer+Theme+Toaster)
│   │   ├── page.tsx                # Landing page (Hero+Features+CTA)
│   │   ├── globals.css             # Tailwind v4 + shadcn theme tokens (oklch)
│   │   ├── login/page.tsx          # Login form ("use client")
│   │   ├── register/page.tsx       # Register form (react-hook-form+zod)
│   │   ├── profile/page.tsx        # Profile (static mock — Server Component)
│   │   ├── sessions/
│   │   │   ├── page.tsx            # Public session feed (mock data)
│   │   │   └── [id]/              # Session detail (dynamic route)
│   │   └── dashboard/
│   │       ├── layout.tsx          # Auth guard layout ("use client")
│   │       ├── page.tsx            # Dashboard overview (mock stats)
│   │       └── sessions/
│   │           ├── [id]/           # Edit session
│   │           └── new/            # Create session form
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Global nav ("use client", auth-aware)
│   │   │   ├── Navbar.test.tsx     # Unit test
│   │   │   └── Footer.tsx          # Simple footer
│   │   ├── ui/                     # 16 shadcn/ui components
│   │   │   ├── avatar, badge, button, card, checkbox, dialog
│   │   │   ├── dropdown-menu, form, input, label, popover
│   │   │   ├── select, sonner, table, tabs, tooltip
│   │   ├── theme-provider.tsx      # next-themes wrapper
│   │   ├── theme-toggle.tsx        # Dark/light toggle
│   │   └── sw-register.tsx         # PWA service worker registration
│   └── lib/
│       ├── api.ts                  # Axios instance (baseURL from env)
│       ├── auth-client.ts          # Better Auth client (exports useSession/signIn/signUp/signOut)
│       └── utils.ts                # cn() utility (clsx + tailwind-merge)
├── e2e/                            # Playwright test directory
├── components.json                 # shadcn/ui config (base-nova style, RSC enabled)
├── next.config.ts                  # Empty config — no customization yet
├── vitest.config.ts                # Vitest + jsdom + path aliases
├── playwright.config.ts            # E2E config
├── .env.example                    # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
└── AGENTS.md                       # Next.js 16 breaking changes warning
```

**Total source files:** ~25 (excluding ui components & configs)

---

## 3. Architecture Patterns

### Routing — App Router (Correct)
- Uses Next.js 16 App Router (`src/app/`)
- Path alias `@/*` → `./src/*`
- Dynamic routes: `sessions/[id]`, `dashboard/sessions/[id]`

### Auth Flow
- `auth-client.ts` → `createAuthClient()` from `better-auth/react`
- `useSession()` hook used in Navbar and Dashboard layout for auth state
- Dashboard layout acts as auth guard: redirects to `/login` if no session
- ⚠️ **Bug:** `auth-client.ts` baseURL defaults to `http://localhost:3001` but API runs on `:3000`

### Data Fetching
- **Currently mock data only** — Sessions page has hardcoded `MOCK_SESSIONS` array
- Dashboard page has hardcoded stats
- Profile page has hardcoded user info
- `@tanstack/react-query` installed but **NOT used anywhere yet**
- `axios` instance configured but **NOT called from any page**
- `zustand` installed but **NOT used anywhere yet**

### Component Strategy
- shadcn/ui base-nova style with oklch color system
- 16 UI primitives installed (standard shadcn set)
- Custom layout components: Navbar, Footer
- ThemeProvider with system/dark/light support
- PWA support via manifest.json + service worker

---

## 4. Key Observations

### ✅ Strengths
- **Modern stack** — Next.js 16, React 19, Tailwind v4, shadcn/ui latest
- **Type-safe forms** — Register page uses `react-hook-form` + `zod` properly
- **Auth integration ready** — Better Auth client wired correctly
- **Testing infra** — Both Vitest (unit) and Playwright (E2E) configured
- **PWA ready** — Service worker + manifest already in place
- **Dark mode** — next-themes with oklch CSS variables

### ⚠️ Issues & Gaps
1. **No real API calls** — Every page uses mock/hardcoded data
2. **Zustand unused** — Installed but no stores created
3. **React Query unused** — Installed but no QueryClient provider or queries
4. **Missing `QueryClientProvider`** — Must be added to root layout before using React Query
5. **Auth client baseURL mismatch** — Defaults to `:3001` instead of `:3000`
6. **Profile page is static** — Doesn't use `useSession()` for real user data
7. **No middleware.ts** — No server-side auth protection (only client-side redirect)
8. **next.config.ts empty** — No image domains, rewrites, or env config
9. **No `loading.tsx` or `error.tsx`** — Missing Next.js convention files
10. **No API routes** — No `app/api/` directory (all API handled by NestJS backend)
11. **Component naming** — Layout components use PascalCase filenames (Navbar.tsx) while shadcn/ui uses kebab-case (button.tsx) — inconsistent

---

## 5. File Inventory by Category

### Pages (7 routes)
| Route | File | Type | Data Source |
|---|---|---|---|
| `/` | `app/page.tsx` | Server Component | Static |
| `/login` | `app/login/page.tsx` | Client Component | Better Auth |
| `/register` | `app/register/page.tsx` | Client Component | Better Auth |
| `/profile` | `app/profile/page.tsx` | Server Component | Mock |
| `/sessions` | `app/sessions/page.tsx` | Server Component | Mock |
| `/sessions/[id]` | `app/sessions/[id]/` | — | — |
| `/dashboard` | `app/dashboard/page.tsx` | Server Component | Mock |
| `/dashboard/sessions/new` | `app/dashboard/sessions/new/` | — | — |
| `/dashboard/sessions/[id]` | `app/dashboard/sessions/[id]/` | — | — |

### Lib (3 files)
- `api.ts` — Axios with interceptors (unused)
- `auth-client.ts` — Better Auth hooks
- `utils.ts` — cn() helper

### Layout Components (3)
- `Navbar.tsx` + test
- `Footer.tsx`

### UI Components (16 shadcn)
- avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, popover, select, sonner, table, tabs, tooltip

---

## 6. Recommendations (Priority Order)

1. **Wire React Query** — Add `QueryClientProvider` to root layout, create hooks for sessions/bookings
2. **Connect API** — Replace mock data with real `api.ts` calls via React Query
3. **Fix auth-client baseURL** — Should use `NEXT_PUBLIC_API_URL` not hardcoded `:3001`
4. **Add middleware.ts** — Server-side auth guard for `/dashboard/*` routes
5. **Add loading/error states** — `loading.tsx` and `error.tsx` for each route group
6. **Create Zustand stores** — Auth store, session filters, booking cart
7. **Standardize naming** — Pick one convention for custom components (kebab-case recommended)
8. **Configure next.config.ts** — Add image domains, API rewrites if needed

---

## 7. Unresolved Questions

- [ ] What data does `/sessions/[id]` and `/dashboard/sessions/[id]` render? (dirs exist but files not confirmed)
- [ ] Is PWA actively used or placeholder from scaffolding?
- [ ] Will the web share the same domain as API (cookie-based auth) or separate domains (token-based)?
- [ ] Any plans for i18n (Vietnamese + English)?
