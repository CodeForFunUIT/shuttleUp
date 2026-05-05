# Brainstorm: Sign-Out Feature Fix

## Problem Statement

Sign-out not working from Navbar (desktop + mobile). Dashboard sidebar sign-out works correctly.

## Investigation

### API (Backend) — ✅ Working
- `POST /api/auth/sign-out` exists in `auth.controller.ts:58-64`
- Delegates to Better Auth's `toNodeHandler()` — handles session invalidation, cookie clear, DB cleanup
- No changes needed

### Web (Frontend) — ❌ Broken in Navbar, ✅ Works in Dashboard

| Location | Code | Issue |
|---|---|---|
| Navbar desktop L124 | `router.push("/api/auth/sign-out")` | Client-side GET nav to a POST endpoint |
| Navbar mobile L233 | `<Link href="/api/auth/sign-out">` | Same — `<Link>` does GET, not POST |
| Dashboard sidebar L30-32 | `await authClient.signOut(); window.location.href = "/"` | Correct — SDK sends POST |

## Root Cause

Navbar does GET navigation; Better Auth sign-out is POST-only. Request either 404s or hits catch-all and does nothing.

## Recommended Fix

Replicate dashboard sidebar pattern in Navbar:

```typescript
import { signOut } from "@/lib/auth-client"

const handleSignOut = async () => {
  await signOut();
  window.location.href = "/";
}
```

### Why `window.location.href` over `router.push`?
- Hard reload clears React Query cache + stale session data
- `router.push` keeps in-memory state → user may see stale UI

### Changes Required
- `Navbar.tsx` desktop: replace `router.push("/api/auth/sign-out")` → `handleSignOut()`
- `Navbar.tsx` mobile: replace `<Link href="/api/auth/sign-out">` → `<button onClick={handleSignOut}>`
- Import `signOut` from `@/lib/auth-client`

## Complexity

Trivial — ~10 line change in 1 file. No API changes. No plan needed.

## Risks

None. Dashboard sidebar already validates this pattern works end-to-end.
