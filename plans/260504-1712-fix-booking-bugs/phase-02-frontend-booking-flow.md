# Phase 2: Frontend Booking Flow

## Overview
- **Priority**: High
- **Status**: ⬜ Todo
- **Effort**: Medium

## Context Links
- [book/page.tsx](../../shuttleup-web/src/app/[locale]/sessions/[id]/book/page.tsx)
- [session detail page.tsx](../../shuttleup-web/src/app/[locale]/sessions/[id]/page.tsx)
- [use-bookings.ts](../../shuttleup-web/src/lib/hooks/use-bookings.ts)
- [auth-client.ts](../../shuttleup-web/src/lib/auth-client.ts)

## Key Insight
**`book/page.tsx` is completely fake** — it does `setTimeout(1000)` and shows a toast. It never calls the API. This is the root cause of bugs 2, 3, 4.

## Requirements
1. Logged-in user: "Request to Join" button calls `POST /api/bookings` directly (no guest form needed)
2. Guest user: `book/page.tsx` must call `POST /api/bookings/guest` with real data
3. After booking success, disable the CTA button and show "Request Pending" state
4. Guest gets bookingId stored in localStorage for tracking
5. Session detail page checks if user already has active booking → disabled CTA

## Related Code Files
- **Modify**: `shuttleup-web/src/app/[locale]/sessions/[id]/page.tsx` — add auth-aware CTA
- **Modify**: `shuttleup-web/src/app/[locale]/sessions/[id]/book/page.tsx` — wire real API call
- **Modify**: `shuttleup-web/src/lib/hooks/use-bookings.ts` — add `useCreateBooking` + `useMyBookingStatus` hooks

## Implementation Steps

### Step 1: Add booking mutation hooks to `use-bookings.ts`

```typescript
/** Create a booking as authenticated user */
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.post("/api/bookings", { sessionId }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bookings"] });
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Create a booking as guest */
export function useCreateGuestBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionId: string; guestName: string; guestPhone: string }) =>
      api.post("/api/bookings/guest", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Check if current user already has an active booking for a session */
export function useMyBookingStatus(sessionId: string) {
  return useQuery<{ hasActiveBooking: boolean }>({
    queryKey: ["bookings", "my-status", sessionId],
    queryFn: async () => {
      // Use the session's bookings data already loaded, or add a dedicated endpoint
      // For now, try to create — the API will throw 409 if duplicate
      return { hasActiveBooking: false };
    },
    enabled: false, // Manual trigger only
  });
}
```

### Step 2: Update session detail page CTA (page.tsx)

Replace the static "Request to Join" `<Link>` with smart behavior:
- **If logged-in**: Show a `<Button>` that directly calls `useCreateBooking` mutation
- **If logged-in + is host**: Hide CTA or show "You're the host"
- **If logged-in + already booked**: Show "Request Pending" (disabled)
- **If not logged-in**: Keep current behavior → link to `/sessions/${id}/book` guest form

This requires:
- Import `useSession` from auth-client
- Import `useCreateBooking` from use-bookings
- Add state tracking for booking result
- Add a new API endpoint `GET /api/bookings/my-status?sessionId=xxx` to check if user already booked

### Step 3: Wire guest booking form (book/page.tsx)

Replace the fake `setTimeout` with real API call:
```typescript
const guestBooking = useCreateGuestBooking();

const handleBooking = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await guestBooking.mutateAsync({
      sessionId: id,
      guestName: name,
      guestPhone: phone,
    });
    // Store bookingId in localStorage for guest tracking
    const guestBookings = JSON.parse(localStorage.getItem("guestBookings") || "[]");
    guestBookings.push({ bookingId: result.id, sessionId: id, phone });
    localStorage.setItem("guestBookings", JSON.stringify(guestBookings));

    toast.success("Booking Request Sent!", {
      description: "The host will confirm your slot shortly.",
    });
    router.push(`/sessions/${id}`);
  } catch (err) {
    // Handle 409 conflict (duplicate), 403 forbidden, etc.
    toast.error("Booking failed", { description: err.message });
  }
};
```

### Step 4: Add `GET /api/bookings/my-status` endpoint (API)

In `bookings.controller.ts`, add:
```typescript
@Get('my-status')
@UseGuards(AuthGuard)
getMyStatus(
  @CurrentUser('id') userId: string,
  @Query('sessionId') sessionId: string,
) {
  return this.bookingsService.getMyBookingStatus(sessionId, userId);
}
```

In `bookings.service.ts`:
```typescript
async getMyBookingStatus(sessionId: string, userId: string) {
  const booking = await this.prisma.booking.findFirst({
    where: {
      sessionId,
      userId,
      status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
    },
  });
  return { hasActiveBooking: !!booking, booking };
}
```

## Todo List
- [ ] Add `useCreateBooking` and `useCreateGuestBooking` mutations to `use-bookings.ts`
- [ ] Add `GET /api/bookings/my-status` endpoint to API
- [ ] Update session detail page CTA with auth-aware logic
- [ ] Wire `book/page.tsx` to call real guest booking API
- [ ] Store guest bookingId in localStorage on success
- [ ] Handle error states (409 duplicate, 403 host-self, session full)
- [ ] Test all 4 scenarios manually

## Success Criteria
- [ ] Logged-in user clicks "Request to Join" → real booking created → button shows "Request Pending"
- [ ] Host sees "You're the host" instead of booking CTA
- [ ] Guest form submits real API call → bookingId saved in localStorage
- [ ] Spamming booking button shows error toast for duplicate
- [ ] Slot count remains correct (only changes on host approval)

## Risk Assessment
- **Low**: localStorage can be cleared — acceptable for MVP guest tracking
- **Low**: Need to ensure `my-status` endpoint is placed BEFORE `:id` param routes in controller
