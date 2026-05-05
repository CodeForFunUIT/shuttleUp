# Phase 1: Backend — Schema + Enums + Service Refactor

## Context Links

- [Plan Overview](./plan.md)
- [Brainstorm](../reports/brainstormer-260504-1615-booking-approval-flow.md)
- [enums.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/common/constants/enums.ts)
- [bookings.service.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/bookings/bookings.service.ts)
- [booking.events.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/common/events/booking.events.ts)
- [types.ts (frontend)](file:///d:/portfolio/shuttleUp/shuttleup-web/src/lib/types.ts)

## Overview

- **Priority**: High
- **Status**: ⬜ Planned
- **Description**: Add `PENDING_APPROVAL` and `REJECTED` statuses, refactor `BookingsService.create()` to NOT decrement slots on booking, add `approve()` and `reject()` methods with Redis lock

## Key Insights

- Current `BookingsService.create()` immediately decrements `availableSlots` — must defer this to approval
- Redis lock pattern already exists in `create()` — reuse in `approve()`
- `BookingCreatedEvent` already emits `hostId` — rename/repurpose for approval notification
- Frontend `BookingStatus` type in `types.ts` must stay in sync

## Related Code Files

### Modify
| File | Changes |
|---|---|
| `shuttleup-api/src/common/constants/enums.ts` | Add `PENDING_APPROVAL`, `REJECTED` to `BookingStatus` |
| `shuttleup-api/src/common/events/booking.events.ts` | Add `BookingRequestedEvent`, `BookingApprovedEvent`, `BookingRejectedEvent` |
| `shuttleup-api/src/bookings/bookings.service.ts` | Refactor `create()` to set `PENDING_APPROVAL`; add `approve()`, `reject()`, `getPendingBySession()`, `getPendingCounts()` |
| `shuttleup-web/src/lib/types.ts` | Add `PENDING_APPROVAL`, `REJECTED` to `BookingStatus` type |

## Implementation Steps

### 1. Update `BookingStatus` enum
File: `shuttleup-api/src/common/constants/enums.ts`

```typescript
export enum BookingStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',  // NEW
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',                  // NEW
  ATTENDED = 'ATTENDED',
}
```

### 2. Add new event classes
File: `shuttleup-api/src/common/events/booking.events.ts`

```typescript
export class BookingRequestedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly hostId: string,
    public readonly requesterName: string,
    public readonly sessionTitle: string,
  ) {}
}

export class BookingApprovedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly userId: string | null,
  ) {}
}

export class BookingRejectedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly userId: string | null,
  ) {}
}
```

### 3. Refactor `BookingsService.create()`
File: `shuttleup-api/src/bookings/bookings.service.ts`

Key changes:
- Set initial status to `PENDING_APPROVAL` instead of `PENDING_PAYMENT`
- **Do NOT decrement** `availableSlots` on create
- Emit `booking.requested` event instead of `booking.created`
- Fetch session title + host name for notification payload

### 4. Add `approve()` method to `BookingsService`
```typescript
async approve(bookingId: string, hostUserId: string) {
  // 1. Find booking with session
  // 2. Verify booking.status === PENDING_APPROVAL
  // 3. Verify session.hostId === hostUserId (authorization)
  // 4. Acquire Redis lock on session
  // 5. Check availableSlots > 0
  // 6. Transaction: update booking status → PENDING_PAYMENT, decrement availableSlots
  // 7. If availableSlots becomes 0, update session status to FULL
  // 8. Emit 'booking.approved' event
  // 9. Release lock
}
```

### 5. Add `reject()` method to `BookingsService`
```typescript
async reject(bookingId: string, hostUserId: string) {
  // 1. Find booking with session
  // 2. Verify booking.status === PENDING_APPROVAL
  // 3. Verify session.hostId === hostUserId
  // 4. Update booking status → REJECTED
  // 5. Emit 'booking.rejected' event
}
```

### 6. Add query methods to `BookingsService`
```typescript
// Get pending bookings for a specific session (with user profile data)
async getPendingBySession(sessionId: string, hostUserId: string)

// Get pending counts for all sessions owned by a host (batch for dashboard dot)
async getPendingCountsByHost(hostUserId: string): Promise<Record<string, number>>
```

### 7. Sync frontend types
File: `shuttleup-web/src/lib/types.ts`

```typescript
export type BookingStatus =
  | "PENDING_APPROVAL"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "REJECTED"
  | "REFUNDED";
```

## Todo List

- [ ] Add `PENDING_APPROVAL`, `REJECTED` to `BookingStatus` enum
- [ ] Add `BookingRequestedEvent`, `BookingApprovedEvent`, `BookingRejectedEvent` event classes
- [ ] Refactor `BookingsService.create()` — set `PENDING_APPROVAL`, skip slot decrement, emit `booking.requested`
- [ ] Add `BookingsService.approve()` with Redis lock + slot decrement
- [ ] Add `BookingsService.reject()`
- [ ] Add `BookingsService.getPendingBySession()` with user profile include
- [ ] Add `BookingsService.getPendingCountsByHost()` for batch dashboard query
- [ ] Update frontend `BookingStatus` type in `types.ts`
- [ ] Verify existing `cancel()` handles `PENDING_APPROVAL` status (should reject instead)
- [ ] Run `npm run lint` and `npm test`

## Success Criteria

- `create()` produces bookings with `PENDING_APPROVAL` status
- `approve()` transitions to `PENDING_PAYMENT` and decrements slots atomically
- `reject()` transitions to `REJECTED`
- Race condition safe via Redis lock on approve
- All existing tests still pass

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Existing booking tests break | Update test expectations for new initial status |
| `cancel()` called on `PENDING_APPROVAL` booking | Add guard: if `PENDING_APPROVAL`, treat as reject (no slot to return) |
