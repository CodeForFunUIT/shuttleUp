# Phase 1: API Guards

## Overview
- **Priority**: High
- **Status**: ⬜ Todo
- **Effort**: Small (~10 lines)

## Context Links
- [bookings.service.ts](../../shuttleup-api/src/bookings/bookings.service.ts)
- [Brainstorm](../reports/brainstormer-260504-1712-booking-bugs.md)

## Requirements
1. Host cannot book their own session → 403 Forbidden
2. Guest cannot create duplicate booking with same phone → 409 Conflict

## Related Code Files
- **Modify**: `shuttleup-api/src/bookings/bookings.service.ts` — `create()` method

## Implementation Steps

### Step 1: Add host self-booking guard
In `BookingsService.create()`, after fetching the session (L44-51), add:
```typescript
// Prevent host from booking their own session
if (userId && userId === session.hostId) {
  throw new ForbiddenException('You cannot book your own session');
}
```
Insert after L51 (session null check), before L53 (gameType check).

### Step 2: Add guest phone dedup
After the logged-in user dedup block (L63-74), add a parallel check for guests:
```typescript
if (!userId && guestPhone) {
  const existingGuest = await this.prisma.booking.findFirst({
    where: {
      sessionId,
      guestPhone,
      status: { notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED] },
    },
  });
  if (existingGuest) {
    throw new ConflictException('A booking with this phone number already exists');
  }
}
```

## Todo List
- [ ] Add host self-booking guard in `create()`
- [ ] Add guest phone dedup in `create()`
- [ ] Verify API rejects correctly via Swagger/curl

## Success Criteria
- `POST /api/bookings` with hostId === userId returns 403
- `POST /api/bookings/guest` with duplicate phone+session returns 409
