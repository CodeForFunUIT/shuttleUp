# Phase 2: Backend — API Endpoints + Notification Events

## Context Links

- [Plan Overview](./plan.md)
- [Phase 1](./phase-01-backend-schema-service.md)
- [bookings.controller.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/bookings/bookings.controller.ts)
- [notifications.service.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/notifications/notifications.service.ts)
- [notifications.processor.ts](file:///d:/portfolio/shuttleUp/shuttleup-api/src/notifications/notifications.processor.ts)

## Overview

- **Priority**: High
- **Status**: ⬜ Planned
- **Description**: Expose approve/reject/pending API endpoints in `BookingsController`. Wire up notification events for `booking.requested`, `booking.approved`, `booking.rejected` in `NotificationsService` and `NotificationsProcessor`.

## Related Code Files

### Modify
| File | Changes |
|---|---|
| `shuttleup-api/src/bookings/bookings.controller.ts` | Add `PATCH :id/approve`, `PATCH :id/reject`, `GET pending`, `GET pending/counts` |
| `shuttleup-api/src/notifications/notifications.service.ts` | Add `@OnEvent` listeners for `booking.requested`, `booking.approved`, `booking.rejected` |
| `shuttleup-api/src/notifications/notifications.processor.ts` | Add processor handlers for new event types |

## Implementation Steps

### 1. Add controller endpoints
File: `shuttleup-api/src/bookings/bookings.controller.ts`

```typescript
// Host-only endpoints (all require AuthGuard)

@ApiBearerAuth()
@ApiOperation({ summary: 'Get pending-approval bookings for a session' })
@UseGuards(AuthGuard)
@Get('pending')
getPending(
  @CurrentUser('id') userId: string,
  @Query('sessionId') sessionId: string,
) {
  return this.bookingsService.getPendingBySession(sessionId, userId);
}

@ApiBearerAuth()
@ApiOperation({ summary: 'Get pending counts for all host sessions (dashboard dot)' })
@UseGuards(AuthGuard)
@Get('pending/counts')
getPendingCounts(@CurrentUser('id') userId: string) {
  return this.bookingsService.getPendingCountsByHost(userId);
}

@ApiBearerAuth()
@ApiOperation({ summary: 'Approve a booking request' })
@UseGuards(AuthGuard)
@Patch(':id/approve')
approve(
  @CurrentUser('id') userId: string,
  @Param('id') id: string,
) {
  return this.bookingsService.approve(id, userId);
}

@ApiBearerAuth()
@ApiOperation({ summary: 'Reject a booking request' })
@UseGuards(AuthGuard)
@Patch(':id/reject')
reject(
  @CurrentUser('id') userId: string,
  @Param('id') id: string,
) {
  return this.bookingsService.reject(id, userId);
}
```

> **Note**: Add `Get`, `Patch`, `Query` to the imports from `@nestjs/common`.

### 2. Wire notification event listeners
File: `shuttleup-api/src/notifications/notifications.service.ts`

```typescript
@OnEvent('booking.requested')
handleBookingRequested(event: BookingRequestedEvent) {
  void this.dispatch('booking.requested', {
    bookingId: event.bookingId,
    sessionId: event.sessionId,
    hostId: event.hostId,
    requesterName: event.requesterName,
    sessionTitle: event.sessionTitle,
  });
}

@OnEvent('booking.approved')
handleBookingApproved(event: BookingApprovedEvent) {
  void this.dispatch('booking.approved', {
    bookingId: event.bookingId,
    sessionId: event.sessionId,
    userId: event.userId,
  });
}

@OnEvent('booking.rejected')
handleBookingRejected(event: BookingRejectedEvent) {
  void this.dispatch('booking.rejected', {
    bookingId: event.bookingId,
    sessionId: event.sessionId,
    userId: event.userId,
  });
}
```

### 3. Add processor handlers
File: `shuttleup-api/src/notifications/notifications.processor.ts`

Add cases to `process()` switch:

- `booking.requested` → Create in-app notification for host: "X wants to join your session Y"
- `booking.approved` → Create in-app notification for requester: "Your request to join Y was approved"
- `booking.rejected` → Create in-app notification for requester: "Your request to join Y was declined"

For guest bookings (no userId), skip requester notification — they have no account to receive it.

## Todo List

- [ ] Add `Get`, `Patch`, `Query` imports to bookings controller
- [ ] Add `GET pending` endpoint with `sessionId` query param
- [ ] Add `GET pending/counts` endpoint for batch dashboard query
- [ ] Add `PATCH :id/approve` endpoint
- [ ] Add `PATCH :id/reject` endpoint
- [ ] Add Swagger decorators for all new endpoints
- [ ] Add `@OnEvent('booking.requested')` listener in NotificationsService
- [ ] Add `@OnEvent('booking.approved')` listener in NotificationsService
- [ ] Add `@OnEvent('booking.rejected')` listener in NotificationsService
- [ ] Add processor handlers for 3 new event types
- [ ] Import new event classes in both notification files
- [ ] Run `npm run lint` and `npm test`

## Success Criteria

- `GET /api/bookings/pending?sessionId=X` returns pending bookings with user profiles
- `GET /api/bookings/pending/counts` returns `{ [sessionId]: count }` map
- `PATCH /api/bookings/:id/approve` transitions status + decrements slot
- `PATCH /api/bookings/:id/reject` transitions status
- All endpoints verify host authorization (only session host can approve/reject)
- Notifications created in DB for all 3 event types
- Swagger docs updated

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Route ordering conflict (`pending` vs `:id`) | Place `GET pending` and `GET pending/counts` BEFORE param routes |
| Missing imports cause compile errors | Run `nest build` after changes |
