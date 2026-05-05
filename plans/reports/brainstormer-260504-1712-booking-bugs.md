# Brainstorm: Booking Feature Bugs

## Problem Statement

Four bugs identified in booking flow:

### Bug 1: Host Can Book Own Session
- **Current**: No check if `userId === session.hostId` in `BookingsService.create()`
- **Impact**: Host gets notified about their own booking request — nonsensical UX
- **Fix**: Add guard `if (userId && userId === session.hostId) throw ForbiddenException`

### Bug 2: Availability Not Updating After Booking
- **Current**: By design — slots only decrement on **approval**, not on booking request
- **Problem**: Session detail page shows `availableSlots` which doesn't change when someone requests
- **Fix (Frontend)**: After successful booking, show "Request Pending" state instead of stale slot count. Invalidate query cache on session detail page after booking mutation.
- **Note**: The slot count IS correct behavior for the approval flow. But the frontend isn't reacting to the booking state change.

### Bug 3: Can Spam Booking Multiple Times
- **Current**: Duplicate check exists at L63-73 of `bookings.service.ts` — but ONLY for `userId` (logged-in users)
- **Root Cause 1**: The booking form (`book/page.tsx`) is **FAKE** — it does `setTimeout(1000)` and shows a toast, never calls the real API!
- **Root Cause 2**: Session detail page "Request to Join" button has no disabled state for already-booked users
- **Root Cause 3**: Guest bookings have no duplicate protection (no userId to check against)
- **Fix**:
  - **Critical**: Wire `book/page.tsx` to actually call `POST /api/bookings/guest`
  - **Logged-in users**: Add a "Request to Join" mutation that calls `POST /api/bookings` and disables the button after success
  - **Frontend**: Check if current user already has an active booking for this session → disable button
  - **Guest**: Add phone-based dedup in API: `findFirst({ guestPhone, sessionId, status NOT cancelled/rejected })`

### Bug 4: Guest Booking Tracking
- **Question**: If I'm not logged in, how do I know I've booked?
- **Options evaluated**:

| Approach | Pros | Cons |
|---|---|---|
| A) LocalStorage bookmark | Simple, no auth needed | Lost on clear/device change |
| B) Phone-based lookup page | No auth, works cross-device | Privacy concern, need verify flow |
| C) Force login before booking | Clean tracking, full history | Friction for casual players |
| D) Show confirmation page + store bookingId in localStorage | Simple, immediate feedback | Can't check later from another device |

- **Recommended**: **Approach D + C hybrid** — Guest gets a confirmation page with booking ID stored in localStorage for immediate tracking. Add a subtle "Create account to track all bookings" nudge. Logged-in users see bookings in dashboard.

## Root Cause Summary

The **biggest issue** is that `book/page.tsx` is a **stub with fake setTimeout** — it never calls the API. This explains bugs 2, 3, and partially 4.

## Recommended Solution

### API Changes
1. Add `hostId === userId` guard in `BookingsService.create()`
2. Add guest phone dedup in `BookingsService.create()`

### Frontend Changes (Session Detail Page)
1. **Logged-in users**: Replace "Request to Join" link with a direct mutation button. After booking, disable + show "Request Pending".
2. **Guests**: Wire `book/page.tsx` to call `POST /api/bookings/guest` for real. After success, store `bookingId` in localStorage and show confirmation.
3. Add `useMyBookingForSession(sessionId)` hook → checks if current user already has active booking → disable CTA.

### Complexity
- API: ~10 lines (two guards)
- Frontend: Medium — need to rewrite `book/page.tsx` and update session detail CTA logic

## Success Criteria
- [ ] Host cannot book own session (API returns 403)
- [ ] Logged-in user booking creates real record, button disables after
- [ ] Guest booking calls real API, stores bookingId
- [ ] No duplicate bookings possible (API-level enforcement)
- [ ] Slot count stays correct (decrements only on approve — this is correct)
