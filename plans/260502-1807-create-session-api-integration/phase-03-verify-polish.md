# Phase 3: Verify & Polish

## Overview
- **Priority:** Medium
- **Status:** ⬜ Not started
- **Depends on:** Phase 2

## Implementation Steps

### Step 1: End-to-End Verification
1. Start both API (`npm run start:dev`) and web (`npm run dev`)
2. Login with a test user
3. Navigate to `/dashboard/sessions/new`
4. Fill form → select a court → submit
5. Verify session appears in `/dashboard`
6. Check DB: `SELECT * FROM court_sessions ORDER BY "createdAt" DESC LIMIT 1;`

### Step 2: Edge Case Testing
- Submit with empty fields → inline errors should appear
- Submit with past date → should either warn or allow (decide)
- Set 0 slots → Zod blocks (min 1)
- Set negative price → Zod blocks (min 0)
- No court selected → error message
- Unauthenticated user → redirect to login

### Step 3: Polish
- Ensure form resets on successful submit
- Ensure court search works with Vietnamese diacritics
- Verify mobile responsiveness of the form
- Format price input to show VND formatting hint

### Step 4: Compile Check
```bash
cd shuttleup-web && npm run build
```

## Todo
- [ ] E2E manual test: create session flow
- [ ] Validate edge cases (empty, invalid, unauthenticated)
- [ ] Compile check passes
- [ ] Mobile responsive check

## Success Criteria
- Full create session flow works end-to-end
- No build errors
- Form is usable on mobile
