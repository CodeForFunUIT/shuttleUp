# Phase 5: Wire Frontend ↔ Backend Locale

## Context Links
- [Plan Overview](./plan.md)
- [api.ts](../../shuttleup-web/src/lib/api.ts)
- Depends on Phase 1 (next-intl) + Phase 4 (backend I18nService)

## Overview
- **Priority:** Medium
- **Status:** ⬜ Not started
- Add axios interceptor that sends `Accept-Language` header matching current locale
- 30 min task — single file change

## Implementation Steps

### Step 1: Update axios interceptor

In `shuttleup-web/src/lib/api.ts`, read the current locale and inject it as a header:

```ts
api.interceptors.request.use((config) => {
  // Read locale from cookie or document
  const locale = typeof document !== 'undefined'
    ? (document.cookie.match(/NEXT_LOCALE=(\w+)/)?.[1] ?? 'en')
    : 'en';

  config.headers['Accept-Language'] = locale;
  return config;
});
```

**Alternative (cleaner):** Create a hook or context that passes locale to axios. But since `api.ts` is a singleton, cookie reading is the simplest KISS approach.

### Step 2: Verify round-trip

1. Switch to Vietnamese in frontend
2. Trigger an API error (e.g., book a non-existent session)
3. Confirm error toast shows Vietnamese message

## Todo List
- [ ] Update `src/lib/api.ts` request interceptor to send `Accept-Language`
- [ ] Verify EN error messages when locale is EN
- [ ] Verify VI error messages when locale is VI

## Success Criteria
- All API requests include `Accept-Language: en` or `Accept-Language: vi`
- Error toasts display in the correct language
