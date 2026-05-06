# Implementation Report: i18n Next-intl & Backend Sync

## Work Completed
**1. Next-intl Translation Infrastructure**
- Replaced hard-coded strings in `Footer.tsx` and `Navbar.tsx` with dynamic `useTranslations()` hooks.
- Extracted and structured 100+ strings for `homepage-sections.tsx` handling complex strings like rich text interpolations (`<primary>Badminton</primary>`), CTAs, and dynamic features arrays across `en.json` and `vi.json`.
- Restructured `sessions/page.tsx` with full support for dynamic localization of UI copies, date formats (`vi-VN` vs `en-GB`), custom skill labels, and locale-aware currency parsing (`vi-VN VND` vs `en-US USD`).

**2. LocaleSwitcher Implementation**
- Created the core `LocaleSwitcher` UI component utilizing `next-intl` routing.
- Provides a seamless dropdown language selector in the `Navbar` to toggle between English and Tiếng Việt natively via `useTransition` and `useRouter` hooks.

**3. Backend API I18nService Setup**
- Constructed a global, request-scoped `I18nService` in the `shuttleup-api` backend to translate standard API responses and validation errors.
- Automatically reads the `Accept-Language` header to infer the context's requested language.
- Added API `locales/en.json` and `locales/vi.json` files and updated `nest-cli.json` to properly bundle JSON assets into the final compilation target.
- Successfully built `shuttleup-web` and `shuttleup-api` verifying no type-check or compilation failures.

## Next Steps
- Continue applying `t('...')` hooks across remaining nested dashboard pages following the proven extraction pattern.
- Integrate the `I18nService` into global HTTP exception filters or specific endpoints in the backend to start returning localized error messages.
