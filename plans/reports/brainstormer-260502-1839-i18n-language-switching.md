# Brainstorm: i18n Language Switching (EN/VI)

## Problem Statement

ShuttleUp needs bilingual support (English + Vietnamese) across:
- **Frontend**: Next.js 16 App Router — 50 TSX files, ~12 pages, hardcoded strings everywhere
- **Backend**: NestJS API — error messages, validation messages in responses
- **URL-based routing**: `/en/sessions`, `/vi/sessions` (Option A confirmed)
- **Translation source**: JSON files in codebase (no external CMS)

## Current Codebase Facts

| Aspect | Status |
|---|---|
| Pages | 12 routes (5 public, 7 dashboard) |
| Components with hardcoded text | ~20 files (Navbar, Footer, homepage, belo, forms) |
| API error messages | Centralized in `http-exception.filter.ts` + service throws |
| Middleware | None currently |
| `next.config.ts` | Empty — no i18n config yet |
| Route structure | `src/app/{route}/page.tsx` (no `[locale]` segment) |

---

## Evaluated Approaches

### Option A: `next-intl` (Recommended ✅)

The de-facto i18n library for Next.js App Router. 7.4k+ GitHub stars, actively maintained.

**How it works:**
1. All routes move under `src/app/[locale]/` dynamic segment
2. Middleware auto-detects locale from URL prefix → cookie → Accept-Language header
3. JSON message files: `messages/en.json`, `messages/vi.json`
4. `useTranslations('Namespace')` hook in components
5. Server components supported via `getTranslations()`

**Architecture:**
```
src/
├── i18n/
│   ├── routing.ts          # defineRouting({locales, defaultLocale})
│   └── request.ts          # getRequestConfig (loads JSON per locale)
├── messages/
│   ├── en.json
│   └── vi.json
├── middleware.ts            # createMiddleware(routing)
└── app/
    └── [locale]/
        ├── layout.tsx       # NextIntlClientProvider wraps children
        ├── page.tsx
        ├── dashboard/...
        └── sessions/...
```

**Pros:**
- First-class App Router support (RSC + client components)
- Built-in middleware handles locale detection + redirects
- `localePrefix: 'as-needed'` — omits `/en` for default locale, shows `/vi` for Vietnamese
- ICU MessageFormat for plurals, genders, etc.
- Type-safe keys possible with TS plugin
- SEO: auto `<html lang>`, alternate links, sitemap helpers
- Tiny bundle: ~2KB client-side

**Cons:**
- Route restructuring required (all pages → `[locale]/`)
- All `<Link>` and `useRouter` imports change to `next-intl/navigation`
- ~20 files need string extraction — upfront effort
- Learning curve for ICU syntax (minor)

**Effort estimate:** 1.5–2 days

---

### Option B: `react-i18next` + `i18next`

The classic i18n solution, framework-agnostic.

**Pros:**
- Huge ecosystem (plugins, tools, extractors)
- Familiar if you've used i18next before
- Works with any React setup

**Cons:**
- **No built-in Next.js routing** — you'd have to manually build the `[locale]` middleware, locale detection, and URL rewrites yourself
- Heavier bundle (~8KB)
- SSR setup is tricky with App Router — requires manual `initReactI18next` on server
- Two separate initialization paths (server vs client)
- More boilerplate for same result

**Effort estimate:** 2.5–3 days (extra time for routing DIY)

---

### Option C: Custom Lightweight (DIY)

Roll your own with React Context + JSON imports.

**Pros:**
- Zero dependencies
- Full control
- Simple for 2 languages

**Cons:**
- Must build: middleware, locale detection, URL rewriting, `<Link>` wrapper, context provider, `useTranslation` hook — all from scratch
- No ICU formatting, no plurals out of box
- No type safety
- Reinventing the wheel — violates KISS
- Maintenance burden grows with features

**Effort estimate:** 3–4 days (then ongoing maintenance)

---

## Backend i18n (NestJS)

For API response translations, the approach is the same regardless of frontend choice:

**Strategy: `Accept-Language` header + message maps**

```
shuttleup-api/src/
├── i18n/
│   ├── en.json              # { "SESSION_NOT_FOUND": "Session not found" }
│   ├── vi.json              # { "SESSION_NOT_FOUND": "Không tìm thấy phiên đánh" }
│   └── i18n.service.ts      # Reads header, returns translated message
```

1. Frontend sends `Accept-Language: vi` header (axios interceptor reads current locale)
2. Backend `I18nService` loads correct JSON, exposes `t(key)` method
3. Exception filters + services use `i18nService.t('SESSION_NOT_FOUND')` instead of hardcoded strings
4. Validation pipe errors: use `class-validator`'s message option with i18n keys

**Alternative considered:** `nestjs-i18n` package — but it's overkill for 2 languages. A simple service + JSON map is KISS.

---

## Final Recommendation

### Frontend: `next-intl` (Option A)

| Criteria | Score |
|---|---|
| App Router compatibility | ⭐⭐⭐⭐⭐ |
| Routing (URL prefixes) | ⭐⭐⭐⭐⭐ (built-in) |
| Bundle size | ⭐⭐⭐⭐⭐ (~2KB) |
| DX / maintenance | ⭐⭐⭐⭐ |
| Setup effort | ⭐⭐⭐⭐ (1.5 days) |
| SEO support | ⭐⭐⭐⭐⭐ |

### Backend: Custom `I18nService` + JSON

Simple, no extra dependencies, follows KISS for 2 languages.

### Language Switcher UI

- Globe icon dropdown in Navbar (next to ThemeToggle)
- Shows "EN 🇬🇧 / VI 🇻🇳" flags
- Uses `next-intl`'s `useRouter().replace()` + `usePathname()` to switch locale in URL
- Persists preference in cookie (`NEXT_LOCALE`)

---

## Implementation Phases

| Phase | Scope | Est. |
|---|---|---|
| 1 | next-intl setup: routing, middleware, layout restructure | 3h |
| 2 | Extract strings → JSON (en.json, vi.json) for all pages | 4h |
| 3 | Language switcher component + Navbar integration | 1h |
| 4 | Backend I18nService + translate API errors/validation | 2h |
| 5 | Axios interceptor sends Accept-Language header | 30m |
| 6 | Testing + polish | 1.5h |
| **Total** | | **~12h** |

## Risks

| Risk | Mitigation |
|---|---|
| Route restructuring breaks existing links | next-intl middleware auto-redirects `/sessions` → `/en/sessions` |
| Missing translations at runtime | `next-intl` falls back to `defaultLocale` messages |
| Vietnamese court names mixed with VI UI | Court data stays in original language (not translated) |
| SEO duplicate content | `next-intl` provides `alternateLinks` in middleware |

## Next Steps

Ready to create a detailed `/plan` for implementation? The phases above are ready to expand into actionable steps.
