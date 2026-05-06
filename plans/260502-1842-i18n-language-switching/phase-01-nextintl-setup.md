# Phase 1: next-intl Setup + Route Restructure

## Context Links
- [Plan Overview](./plan.md)
- [next-intl docs](https://next-intl.dev/docs/getting-started/app-router-setup)
- Current layout: [layout.tsx](../../shuttleup-web/src/app/layout.tsx)

## Overview
- **Priority:** Critical (foundation for all other phases)
- **Status:** ✅ Done
- Install `next-intl`, create routing/request config, middleware, and move all routes under `[locale]/`

## Requirements

### Functional
- `next-intl` installed and configured
- All existing routes accessible under `/en/...` and `/vi/...`
- Default locale (`en`) prefix omitted via `localePrefix: 'as-needed'`
- Auto-redirect: `/sessions` → `/en/sessions` (transparent)
- `<html lang>` attribute set dynamically per locale

### Non-functional
- Zero visual regressions — pages must look identical after restructure
- All `<Link>` and `useRouter` from `next/navigation` must be replaced with `next-intl/navigation` versions

## Related Code Files

### Files to CREATE
- `shuttleup-web/src/i18n/routing.ts` — locale routing config
- `shuttleup-web/src/i18n/request.ts` — request config (loads messages)
- `shuttleup-web/src/i18n/navigation.ts` — re-export createNavigation helpers
- `shuttleup-web/src/middleware.ts` — locale detection middleware
- `shuttleup-web/src/messages/en.json` — initial EN messages (minimal)
- `shuttleup-web/src/messages/vi.json` — initial VI messages (minimal)

### Files to MODIFY
- `shuttleup-web/src/app/layout.tsx` → becomes a thin shell, moves content to `[locale]/layout.tsx`
- `shuttleup-web/src/app/[locale]/layout.tsx` — new, wraps `NextIntlClientProvider`
- ALL pages under `src/app/` → move to `src/app/[locale]/`
- ALL components using `next/navigation` → swap to `@/i18n/navigation`

## Implementation Steps

### Step 1: Install next-intl
```bash
cd shuttleup-web && npm install next-intl
```

### Step 2: Create i18n routing config
```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'  // /en omitted, /vi shown
});
```

### Step 3: Create navigation helpers
```ts
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### Step 4: Create request config
```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

### Step 5: Create middleware
```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

### Step 6: Create initial message files
```json
// src/messages/en.json
{
  "Common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "login": "Login",
    "signOut": "Sign Out",
    "dashboard": "Dashboard",
    "profile": "Profile"
  }
}
```
```json
// src/messages/vi.json
{
  "Common": {
    "loading": "Đang tải...",
    "error": "Đã có lỗi xảy ra",
    "login": "Đăng nhập",
    "signOut": "Đăng xuất",
    "dashboard": "Bảng điều khiển",
    "profile": "Hồ sơ"
  }
}
```

### Step 7: Restructure routes
```bash
# Move all route folders under [locale]
mkdir -p shuttleup-web/src/app/\[locale\]
mv shuttleup-web/src/app/dashboard shuttleup-web/src/app/\[locale\]/
mv shuttleup-web/src/app/sessions shuttleup-web/src/app/\[locale\]/
mv shuttleup-web/src/app/login shuttleup-web/src/app/\[locale\]/
mv shuttleup-web/src/app/register shuttleup-web/src/app/\[locale\]/
mv shuttleup-web/src/app/profile shuttleup-web/src/app/\[locale\]/
# Move page.tsx (homepage) into [locale]
mv shuttleup-web/src/app/page.tsx shuttleup-web/src/app/\[locale\]/page.tsx
```

### Step 8: Create root layout (thin shell)
Root `src/app/layout.tsx` becomes minimal — just `<html>` + `<body>` + font classes.  
New `src/app/[locale]/layout.tsx` gets all providers + `NextIntlClientProvider`.

### Step 9: Update next.config.ts
```ts
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

### Step 10: Replace navigation imports
Find all files importing from `next/navigation` or `next/link` and replace:
- `import Link from "next/link"` → `import { Link } from "@/i18n/navigation"`
- `import { useRouter, usePathname } from "next/navigation"` → `import { useRouter, usePathname } from "@/i18n/navigation"`

**Files to update:**
- `Navbar.tsx` — uses `Link`, `usePathname`, `useRouter`
- `login/page.tsx` — uses `Link`, `useRouter`
- `register/page.tsx` — uses `Link`, `useRouter`
- `dashboard/page.tsx` — uses `Link`
- `dashboard/layout.tsx` — uses `Link`, `usePathname`
- `sessions/page.tsx` — uses `Link`
- `sessions/[id]/page.tsx` — uses `Link`, `useRouter`
- `sessions/[id]/book/page.tsx` — uses `Link`, `useRouter`
- `dashboard/sessions/new/page.tsx` — uses `useRouter`
- `dashboard/sessions/[id]/page.tsx` — uses `Link`, `useRouter`
- `court-select.tsx` — no nav imports (OK)
- `homepage-sections.tsx` — uses `Link`

### Step 11: Verify build
```bash
cd shuttleup-web && npx tsc --noEmit && npm run build
```

## Todo List
- [ ] Install next-intl
- [ ] Create `src/i18n/routing.ts`
- [ ] Create `src/i18n/navigation.ts`
- [ ] Create `src/i18n/request.ts`
- [ ] Create `src/middleware.ts`
- [ ] Create `src/messages/en.json` (minimal)
- [ ] Create `src/messages/vi.json` (minimal)
- [ ] Move all route folders under `[locale]/`
- [ ] Refactor root layout → thin shell + `[locale]/layout.tsx`
- [ ] Update `next.config.ts` with next-intl plugin
- [ ] Replace `next/link` → `@/i18n/navigation` in all components
- [ ] Replace `next/navigation` → `@/i18n/navigation` in all components
- [ ] Verify `tsc --noEmit` passes
- [ ] Verify `npm run build` passes
- [ ] Manual test: `/` loads homepage, `/vi` loads Vietnamese homepage

## Success Criteria
- All existing routes work at both `/en/...` and `/vi/...`
- Default locale prefix omitted (`/sessions` works, not `/en/sessions`)
- `<html lang="en">` or `<html lang="vi">` set correctly
- Zero visual regression
- Build passes with 0 errors

## Risks
| Risk | Mitigation |
|---|---|
| `better-auth` redirects break with locale prefix | Auth callback URLs don't go through `[locale]` — middleware matcher excludes `/api` |
| `useSession` from auth-client conflicts with `useRouter` replacement | `auth-client.ts` doesn't use `next/navigation` — no change needed |
| `metadata` export breaks in `[locale]/layout.tsx` | Use `generateMetadata` with `getTranslations` for dynamic metadata |
