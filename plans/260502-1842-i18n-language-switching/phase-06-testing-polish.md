# Phase 6: Testing + Polish

## Context Links
- [Plan Overview](./plan.md)
- Depends on all previous phases

## Overview
- **Priority:** Medium
- **Status:** ⬜ Not started
- End-to-end verification, edge cases, SEO, accessibility

## Testing Checklist

### Routing Tests
- [ ] `/` → homepage in EN (default, no prefix)
- [ ] `/vi` → homepage in Vietnamese
- [ ] `/sessions` → sessions page in EN
- [ ] `/vi/sessions` → sessions page in VI
- [ ] `/dashboard` → dashboard in EN (requires auth)
- [ ] `/vi/dashboard` → dashboard in VI (requires auth)
- [ ] `/login` → login page in EN
- [ ] `/vi/login` → login page in VI
- [ ] Direct URL `/en/sessions` → redirects to `/sessions` (prefix stripped for default)

### Language Switcher Tests
- [ ] Switch EN → VI on homepage: URL changes to `/vi`, content translates
- [ ] Switch VI → EN on sessions page: URL changes to `/sessions`, content translates
- [ ] Switch preserves authenticated state
- [ ] Cookie `NEXT_LOCALE` set after switch
- [ ] Refreshing page stays in chosen locale
- [ ] Works on mobile (Sheet sidebar)

### API Translation Tests
- [ ] `Accept-Language: en` → English error messages
- [ ] `Accept-Language: vi` → Vietnamese error messages
- [ ] `Accept-Language: fr` → Falls back to English
- [ ] No header → Falls back to English

### SEO Tests
- [ ] `<html lang="en">` on EN pages
- [ ] `<html lang="vi">` on VI pages
- [ ] Page titles translated (check `<title>` tag)
- [ ] Meta descriptions translated
- [ ] No duplicate content issues (canonical URLs)

### Edge Cases
- [ ] Deep link with locale: `/vi/sessions/uuid-here` works
- [ ] 404 page respects locale
- [ ] Auth redirects work: unauthenticated → `/login` → after login → `/dashboard` (locale preserved)
- [ ] `better-auth` callbacks at `/api/auth/*` not affected by middleware
- [ ] Static assets (images, manifest.json) not affected by middleware

### Accessibility
- [ ] Screen reader announces language change
- [ ] Globe icon has `aria-label="Switch language"`
- [ ] All translated text is readable and doesn't overflow containers

## Polish Items
- [ ] Verify all Vietnamese translations are natural (not Google Translate quality)
- [ ] Check text overflow in buttons/cards with longer Vietnamese text
- [ ] Ensure currency formatting uses correct locale (`vi-VN` for VND)
- [ ] Date formatting uses locale-appropriate format
- [ ] Loading states show translated text

## Build Verification
```bash
# Frontend
cd shuttleup-web && npx tsc --noEmit && npm run build

# Backend
cd shuttleup-api && npm run build
```

## Success Criteria
- All routing tests pass
- Language switching works seamlessly on every page
- API returns localized errors
- SEO tags are correct per locale
- No visual regressions
- Both projects build successfully
