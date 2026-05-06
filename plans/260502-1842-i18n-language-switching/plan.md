---
title: i18n Language Switching (EN/VI)
description: Add bilingual support using next-intl (frontend) + custom I18nService (backend)
status: planned
priority: medium
effort: 12h
branch: feature/i18n-language-switching
tags: [i18n, next-intl, nestjs, frontend, backend]
created: 2026-05-02T18:42:00+07:00
---

# i18n Language Switching (EN/VI)

## Context

- [Brainstorm Report](../reports/brainstormer-260502-1839-i18n-language-switching.md)
- Tech: Next.js 16 App Router + NestJS API
- Scope: 12 pages, ~23 components with hardcoded strings, 6 API services with error messages

## Phases

| # | Phase | Status | Est. |
|---|---|---|---|
| 1 | [next-intl Setup + Route Restructure](./phase-01-nextintl-setup.md) | ✅ | 3h |
| 2 | [Extract Strings → JSON Messages](./phase-02-extract-strings.md) | 🚧 | 4h |
| 3 | [Language Switcher Component](./phase-03-language-switcher.md) | ⬜ | 1h |
| 4 | [Backend I18nService + API Translations](./phase-04-backend-i18n.md) | ⬜ | 2h |
| 5 | [Wire Frontend ↔ Backend Locale](./phase-05-wire-locale-header.md) | ⬜ | 30m |
| 6 | [Testing + Polish](./phase-06-testing-polish.md) | ⬜ | 1.5h |

## Architecture

```
shuttleup-web/
├── src/
│   ├── i18n/
│   │   ├── routing.ts        # defineRouting({locales: ['en','vi'], defaultLocale: 'en'})
│   │   └── request.ts        # getRequestConfig → loads JSON
│   ├── messages/
│   │   ├── en.json            # All EN strings, namespaced
│   │   └── vi.json            # All VI strings, namespaced
│   ├── middleware.ts          # createMiddleware(routing)
│   └── app/
│       └── [locale]/          # ALL existing routes move here
│           ├── layout.tsx     # NextIntlClientProvider
│           ├── page.tsx
│           └── ...

shuttleup-api/
├── src/
│   ├── i18n/
│   │   ├── en.json            # API error/validation messages EN
│   │   ├── vi.json            # API error/validation messages VI
│   │   └── i18n.service.ts    # t(key, locale) → translated string
│   └── common/
│       └── filters/
│           └── http-exception.filter.ts  # Uses I18nService
```

## Key Dependencies

- `next-intl` (frontend)
- No new deps for backend (custom service + JSON)
