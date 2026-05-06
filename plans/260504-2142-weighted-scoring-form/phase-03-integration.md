# Phase 3: Integration — Registration Flow

> Priority: HIGH | Status: Pending | Effort: 30min

## Context Links
- [Register Page](../../shuttleup-web/src/app/[locale]/register/page.tsx)
- [Auth Client](../../shuttleup-web/src/lib/auth-client.ts)
- [Dashboard Layout](../../shuttleup-web/src/app/[locale]/dashboard/layout.tsx)

## Overview

Wire Step 1 (account creation) to redirect to Step 2 (wizard). Add onboarding guard to dashboard so users who haven't completed or skipped are redirected back.

## Related Code Files

| File | Action |
|---|---|
| `src/app/[locale]/register/page.tsx` | MODIFY — redirect to /register/onboarding after signup |
| `src/lib/auth-client.ts` | MODIFY — add onboardingCompleted to additionalFields |
| `src/app/[locale]/dashboard/layout.tsx` | MODIFY — optional: show onboarding banner if not completed |

## Implementation Steps

### Step 1 — Modify Register Page Redirect

In `register/page.tsx`, change the success handler:

```typescript
// BEFORE
toast.success("Account created successfully!");
router.push("/dashboard");

// AFTER
toast.success("Account created! Let's set up your skill level.");
router.push("/register/onboarding");
```

### Step 2 — Update Auth Client

Add `onboardingCompleted` to the auth client so it's available in `useSession()`:

```typescript
// In auth-client.ts — if Better Auth supports additionalFields on client
// The field should already be returned in session data since it's in
// auth.service.ts additionalFields. Verify by checking session response.
```

> Note: Better Auth automatically includes `additionalFields` in session response. Just need to verify the backend field registration (Phase 1 Step 5) is correct.

### Step 3 — Optional Dashboard Banner

In `dashboard/layout.tsx`, add a dismissible banner for users who skipped:

```tsx
{!session.user.onboardingCompleted && (
  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between">
    <p className="text-sm text-primary">
      Complete your skill assessment to get a more accurate BELo rating
    </p>
    <Link href="/register/onboarding">
      <Button size="sm" variant="outline" className="text-primary border-primary/30">
        Take Assessment
      </Button>
    </Link>
  </div>
)}
```

This is non-blocking — just a gentle nudge for skippers.

## Todo List

- [ ] Update register page success redirect → /register/onboarding
- [ ] Verify onboardingCompleted in session response
- [ ] Add optional dashboard banner for non-completed users
- [ ] Test full flow: register → wizard → skip/finish → dashboard

## Success Criteria

- New registration redirects to wizard (not directly to dashboard)
- After wizard completion → lands on dashboard
- After skip → lands on dashboard with banner
- Existing users unaffected (onboardingCompleted defaults false, banner shows)
