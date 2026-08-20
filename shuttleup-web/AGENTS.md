# ShuttleUp Web — Agent Instructions & Rules

## Context

Web frontend for **ShuttleUp** — a modern badminton session and court booking platform.
Part of the monorepo: `shuttleup-api` (NestJS) + `shuttleup-web` (Next.js) + `shuttleup-mobile` (Flutter).

**Shared Docs:** `../docs/` (Code Standards, Architecture, Design Guidelines).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime & React | Node.js 20+ / React 19 |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Components | shadcn/ui (base-nova) + Radix UI + Lucide Icons |
| State Management | React Server Components + TanStack Query v5 + Zustand v5 |
| Authentication | Better Auth (`@better-auth/client`) |
| Forms & Validation | React Hook Form + Zod v4 |
| Testing | Vitest + React Testing Library (Unit) / Playwright (E2E) |

---

## Commands

```bash
npm run dev          # Start local dev server (port 3001)
npm run build        # Production build & type check
npm run lint         # Run ESLint (Flat config)
npm run test         # Run unit tests via Vitest
npm run test:e2e     # Run E2E tests via Playwright
```

---

## Architecture & Directory Structure

```
src/
├── app/                     # App Router (pages, layouts, error/loading states)
│   ├── (auth)/              # Route group: login, register, callback
│   ├── (dashboard)/         # Route group: host/admin dashboard
│   ├── sessions/            # Session list, detail, booking flows
│   ├── layout.tsx           # Root layout with providers & theme
│   ├── page.tsx             # Homepage & landing
│   └── globals.css          # Tailwind CSS v4 variables & tokens
├── components/
│   ├── ui/                  # shadcn/ui atomic primitives (button, dialog, card...)
│   ├── features/            # Feature-specific composite components
│   │   ├── sessions/        # SessionCard, SessionFilter, MapView...
│   │   └── booking/         # BookingModal, PaymentSummary...
│   └── layouts/             # Navbar, Footer, Sidebar, PageHeader
├── lib/
│   ├── api/                 # API clients, axios instance, endpoint callers
│   ├── auth/                # Better Auth client initialization (`auth-client.ts`)
│   ├── hooks/               # Custom reusable React hooks
│   └── utils.ts             # `cn()` utility (clsx + tailwind-merge)
└── types/                   # TypeScript interfaces, DTOs, and Zod schemas
```

---

## Core Engineering Rules

### 1. Server-First Default (React Server Components)
- Every page and layout in `app/` is a **Server Component** by default.
- Push `"use client"` to the furthest leaves of the component tree (e.g. interactive buttons, forms, dropdowns).
- Never add `"use client"` to an entire page if only a small child component needs interactivity.

### 2. Forms & Mutations (React 19 & Next.js 16)
- Next.js 16 `fetch` requests are **uncached by default**.
- For form mutations, use React 19 Actions (`useActionState`, `useFormStatus`) or `react-hook-form` + `zodResolver`.
- Validate all form submissions client-side and server-side with Zod schemas.

### 3. State Management Separation
- **Server Cache & Async Data**: Use RSC for initial load; use TanStack Query (`useQuery`, `useMutation`) for client-side caching & refetching.
- **Client UI State**: Use Zustand (`create()`) only for cross-component ephemeral UI state (e.g. filter drawer open, session map filters).
- **Local Component State**: Use `useState` / `useReducer` for isolated widget state.

### 4. Dynamic Import for Browser-Only Libraries
- Libraries that access `window`, `document`, or `navigator` (such as **Leaflet** / `react-leaflet`) **MUST** be loaded dynamically with `ssr: false`:
  ```tsx
  import dynamic from 'next/dynamic';
  const DynamicSessionMap = dynamic(() => import('@/components/features/sessions/session-map'), {
    ssr: false,
    loading: () => <MapSkeleton />,
  });
  ```

### 5. Styling & Design Tokens
- Use Tailwind CSS v4 design tokens defined via CSS custom properties in `globals.css`.
- Merge class names with `cn()` from `@/lib/utils`.
- Never use inline styles or hardcode arbitrary non-theme hex values when a CSS variable or theme token exists.

### 6. TypeScript & Type Safety
- **Zero `any` Policy**: Use `unknown`, discriminated unions, or type assertions backed by Zod schemas.
- Use explicit TypeScript interfaces for all component props.
- Model backend DTOs using shared TypeScript types matching the NestJS API contracts.

### 7. File Size & Modularization
- **Strict Limit**: Every component and file must stay **under 200 lines**.
- When a component grows, break it down into focused sub-components under `src/components/features/<feature>/`.

---

## Forbidden Patterns

- ❌ Direct `<img>` tags — **ALWAYS** use `next/image` (`<Image />`) for automatic optimization.
- ❌ Putting `any` in TypeScript types.
- ❌ Accessing `process.env` in client components without the `NEXT_PUBLIC_` prefix.
- ❌ Hardcoded strings for API endpoints — centralize in `src/lib/api/`.
- ❌ Direct import of Leaflet / map components into Server Components without `next/dynamic(..., { ssr: false })`.
- ❌ Over-nesting `"use client"` at root page levels.
- ❌ Files exceeding 200 lines.

---

## Git Convention

```
<type>(web): <description>
Types: feat, fix, docs, refactor, test, chore, style, perf
```
