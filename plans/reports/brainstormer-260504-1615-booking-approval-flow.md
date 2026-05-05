# Brainstorm: Session Booking Approval Flow

## Problem Statement

Currently, when a user/guest clicks "Book Slot Now," a `Booking` is created with `PENDING_PAYMENT` status and the slot is **immediately decremented**. The host has zero control over who joins.

**Goal**: Add a host-approval gate so participants "request to join" → host sees pending requests (with a notification dot on the "Manage" button) → host can accept or reject → only accepted bookings proceed to payment.

---

## Current State Analysis

| Layer | Current Behavior |
|---|---|
| **Prisma `Booking`** | Statuses: `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED` |
| **`BookingsService.create()`** | Immediately decrements `availableSlots`, emits `booking.created` event |
| **Frontend `BookingStatus`** | Same 4 statuses in `types.ts` |
| **Dashboard "Manage" button** | No-op — just a placeholder `<Button>` with no link or action |
| **Notification model** | Exists in Prisma with `userId`, `title`, `message`, `type`, `isRead`, `link` |

---

## Approaches Evaluated

### A) Extend Existing `Booking` Model (★ Recommended)

Add a `PENDING_APPROVAL` status to the existing `Booking` model. When a user books, the booking starts as `PENDING_APPROVAL` instead of `PENDING_PAYMENT`. Host approves → transitions to `PENDING_PAYMENT`. Host rejects → transitions to `REJECTED`.

**Pros:**
- Minimal schema change (1 new enum value + 1 new status)
- Reuses existing `Booking` model, relations, and event system
- No new tables or modules needed
- `availableSlots` only decremented on approval, not on request
- KISS — simplest path

**Cons:**
- `Booking` model gets slightly overloaded (booking ≠ request semantically)
- Need to handle the "slot not yet reserved" edge case (race condition between approval and another booking)

### B) New `JoinRequest` Model

Create a separate `JoinRequest` table. After host approves, a `Booking` is created from the `JoinRequest`.

**Pros:**
- Clean separation of concerns (request vs booking)
- Booking model stays pure

**Cons:**
- New table, new module, new service, new controller — significant overhead
- Data duplication (request has same fields as booking)
- YAGNI — over-engineering for a simple approval gate
- More complex queries to show pending counts

### C) Auto-Approve + Host Kick

Keep current auto-book behavior. Add ability for host to remove/kick participants post-booking.

**Pros:**
- No booking flow changes at all
- Very simple to implement

**Cons:**
- Bad UX — participant thinks they're in, then gets kicked
- Payment refund complexity
- Doesn't match user's requirement at all

---

## Recommended Solution: Approach A

### Data Flow

```
User clicks "Book Slot Now"
  → POST /api/bookings (or /api/bookings/guest)
    → Booking created with status = PENDING_APPROVAL
    → availableSlots NOT decremented yet
    → Notification created for host (type: "BOOKING_REQUEST")
    → Event emitted: booking.requested

Host opens Dashboard
  → "Manage" button shows dot (count of PENDING_APPROVAL bookings)
  → Click → opens participant list panel/dialog

Host clicks "Accept"
  → PATCH /api/bookings/:id/approve
    → status → PENDING_PAYMENT
    → availableSlots decremented (with Redis lock)
    → Notification to requester
    → If no slots left after approval, reject remaining pending requests

Host clicks "Reject"
  → PATCH /api/bookings/:id/reject
    → status → REJECTED
    → Notification to requester
```

### Schema Changes

```prisma
# Booking.status values:
# PENDING_APPROVAL → PENDING_PAYMENT → CONFIRMED → CANCELLED → REFUNDED
#                  → REJECTED
```

```typescript
// enums.ts — add:
PENDING_APPROVAL = 'PENDING_APPROVAL',
REJECTED = 'REJECTED',
```

No new tables needed. Just 2 new status values.

### API Endpoints (New)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/bookings/pending?sessionId=X` | Host only | List pending-approval bookings for a session |
| `PATCH` | `/api/bookings/:id/approve` | Host only | Approve a booking request |
| `PATCH` | `/api/bookings/:id/reject` | Host only | Reject a booking request |
| `GET` | `/api/sessions/:id/pending-count` | Host only | Count of pending requests (for notification dot) |

### Frontend Components

#### 1. Notification Dot on "Manage" Button
- Fetch pending count per session via new hook `usePendingBookings(sessionId)`
- Or batch: single API `GET /api/bookings/pending/counts` returning `{ sessionId: count }` for all host sessions (more efficient)
- Render red dot with count next to "Manage"

```tsx
// Dashboard — line 114 replacement
<div className="relative">
  <Button size="sm" variant="outline" onClick={() => openManagePanel(s.id)}>
    Manage
  </Button>
  {pendingCounts[s.id] > 0 && (
    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
      {pendingCounts[s.id]}
    </span>
  )}
</div>
```

#### 2. Participant List Panel (Sheet/Dialog)
- Triggered by clicking "Manage" button
- Shows list of `PENDING_APPROVAL` bookings with:
  - User avatar + name (or guest name/phone)
  - Skill level + ELO score (if registered user)
  - "Accept" / "Reject" buttons per row
- Also shows already-confirmed participants below

#### 3. Book Slot Button (Session Detail Page)
- Button text changes from "Book Slot Now" → "Request to Join"
- After submitting: show "Request Sent — Waiting for host approval" state
- Subtitle changes from "No account required" → "Host will review your request"

### Notification System Integration

Already have `Notification` model + `EventEmitter2`. Wire up:

```typescript
// Listen to 'booking.requested' event
@OnEvent('booking.requested')
async handleBookingRequested(event: BookingRequestedEvent) {
  await this.prisma.notification.create({
    data: {
      userId: event.hostId,
      title: 'New Join Request',
      message: `${event.requesterName} wants to join "${event.sessionTitle}"`,
      type: 'BOOKING_REQUEST',
      link: `/dashboard?session=${event.sessionId}`,
    },
  });
}
```

---

## Implementation Considerations

### Race Conditions
- When host approves, must check `availableSlots > 0` inside Redis lock (already have `acquireLock` in `BookingsService`)
- If last slot is taken between request and approval → return error "Session is now full"
- Auto-reject remaining `PENDING_APPROVAL` bookings when session becomes `FULL`

### Guest Bookings
- Guests can still request to join (guestName + guestPhone)
- Host sees guest info in the approval panel
- No ELO/skill shown for guests — show "Guest" badge

### Real-time (Future Enhancement)
- Current: polling via `react-query` refetch intervals
- Future: WebSocket/SSE for instant dot updates (Socket.IO module already in skills catalog)
- For MVP: 30s polling interval is sufficient

### Session Auto-Cleanup
- `@Cron` job: auto-reject all `PENDING_APPROVAL` bookings 1 hour before session `startTime`
- Prevent stale requests from lingering

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Race condition on approval | Medium | Redis lock already in place — reuse pattern |
| Host never responds to requests | Medium | Auto-reject cron + timeout notification |
| UX confusion (user expects instant booking) | Low | Clear "Request sent" UI feedback |
| Guest spam requests | Low | Rate limit on booking endpoint (already exists) |

---

## Success Metrics

- [ ] Host can see pending count dot on "Manage" button
- [ ] Host can view list of pending participants with profiles
- [ ] Host can accept → booking moves to `PENDING_PAYMENT`
- [ ] Host can reject → booking moves to `REJECTED`, requester notified
- [ ] `availableSlots` only decremented on approval
- [ ] Guest bookings work with approval flow
- [ ] No race conditions on concurrent approvals

---

## Estimated Effort

| Component | Effort |
|---|---|
| Schema + enum changes | ~30 min |
| API endpoints (approve/reject/pending) | ~2 hours |
| BookingsService refactor (approval flow) | ~1.5 hours |
| Frontend: notification dot + manage panel | ~2 hours |
| Frontend: "Request to Join" UX update | ~30 min |
| Notification event wiring | ~30 min |
| **Total** | **~7 hours** |

---

## Next Steps

1. Create detailed implementation plan with `/plan` if approved
2. Phase 1: Backend (schema + API + service)
3. Phase 2: Frontend (dashboard manage panel + notification dot)
4. Phase 3: Polish (auto-reject cron, notification wiring)
