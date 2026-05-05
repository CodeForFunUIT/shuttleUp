# Phase 3: Frontend — Dashboard Manage Panel + Notification Dot

## Context Links

- [Plan Overview](./plan.md)
- [Phase 2](./phase-02-backend-api-events.md)
- [dashboard/page.tsx](file:///d:/portfolio/shuttleUp/shuttleup-web/src/app/%5Blocale%5D/dashboard/page.tsx)
- [sessions/[id]/page.tsx](file:///d:/portfolio/shuttleUp/shuttleup-web/src/app/%5Blocale%5D/sessions/%5Bid%5D/page.tsx)
- [use-sessions.ts](file:///d:/portfolio/shuttleUp/shuttleup-web/src/lib/hooks/use-sessions.ts)
- [api.ts](file:///d:/portfolio/shuttleUp/shuttleup-web/src/lib/api.ts)
- [Sheet component](file:///d:/portfolio/shuttleUp/shuttleup-web/src/components/ui/sheet.tsx)

## Overview

- **Priority**: High
- **Status**: ⬜ Planned
- **Description**: Add notification dot on "Manage" button, create manage panel (Sheet) showing pending participants with accept/reject, update "Book Slot Now" button text to "Request to Join"

## Key Insights

- shadcn `Sheet` component already installed — use for manage side-panel
- `@tanstack/react-query` mutations for approve/reject with optimistic updates
- Batch pending counts API (`GET /api/bookings/pending/counts`) for efficient dashboard rendering
- Polling with `refetchInterval: 30000` for near-real-time dot updates (MVP)

## Related Code Files

### Create
| File | Purpose |
|---|---|
| `shuttleup-web/src/lib/hooks/use-bookings.ts` | Hooks: `usePendingCounts()`, `usePendingBookings(sessionId)`, `useApproveBooking()`, `useRejectBooking()` |
| `shuttleup-web/src/components/dashboard/manage-session-panel.tsx` | Sheet panel showing pending participants + confirmed list |

### Modify
| File | Changes |
|---|---|
| `shuttleup-web/src/app/[locale]/dashboard/page.tsx` | Add notification dot on "Manage" button, wire Sheet open state |
| `shuttleup-web/src/app/[locale]/sessions/[id]/page.tsx` | Change "Book Slot Now" → "Request to Join", update subtitle text |

## Implementation Steps

### 1. Create booking hooks
File: `shuttleup-web/src/lib/hooks/use-bookings.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/** Fetch pending-approval counts per session for dashboard dot */
export function usePendingCounts() {
  return useQuery<Record<string, number>>({
    queryKey: ["bookings", "pending-counts"],
    queryFn: async () => {
      const res: any = await api.get("/api/bookings/pending/counts");
      return (res?.data ?? res) as Record<string, number>;
    },
    refetchInterval: 30_000, // Poll every 30s for near-real-time
  });
}

/** Fetch pending bookings for a specific session (with user profiles) */
export function usePendingBookings(sessionId: string | null) {
  return useQuery({
    queryKey: ["bookings", "pending", sessionId],
    queryFn: async () => {
      const res: any = await api.get(`/api/bookings/pending`, {
        params: { sessionId },
      });
      return (res?.data ?? res);
    },
    enabled: !!sessionId,
  });
}

/** Approve a booking request */
export function useApproveBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.patch(`/api/bookings/${bookingId}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

/** Reject a booking request */
export function useRejectBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      api.patch(`/api/bookings/${bookingId}/reject`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
```

### 2. Create manage session panel component
File: `shuttleup-web/src/components/dashboard/manage-session-panel.tsx`

Structure:
```
Sheet (side="right", 400px)
├── SheetHeader: "Manage: {sessionTitle}"
├── Section: "Pending Requests ({count})"
│   └── List of pending bookings
│       └── Per item:
│           ├── Avatar (initials or "G" for guest)
│           ├── Name + skill level + ELO (or "Guest" badge)
│           ├── Requested at (relative time)
│           ├── [Accept] button (emerald)
│           └── [Reject] button (destructive outline)
├── Divider
└── Section: "Confirmed Participants"
    └── List of confirmed bookings (read-only)
```

Props: `{ sessionId: string; sessionTitle: string; open: boolean; onClose: () => void }`

Use `usePendingBookings(sessionId)` for pending list.
Use `useApproveBooking()` and `useRejectBooking()` mutations on button clicks.
Show `sonner` toast on success/error.

### 3. Update dashboard page
File: `shuttleup-web/src/app/[locale]/dashboard/page.tsx`

Changes:
- Import `usePendingCounts()` hook
- Add state: `const [manageSessionId, setManageSessionId] = useState<string | null>(null)`
- Replace line 114 "Manage" button with:

```tsx
<div className="relative">
  <Button
    size="sm"
    variant="outline"
    onClick={() => setManageSessionId(s.id)}
  >
    Manage
  </Button>
  {pendingCounts?.[s.id] > 0 && (
    <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold pointer-events-none">
      {pendingCounts[s.id]}
    </span>
  )}
</div>
```

- Add `<ManageSessionPanel>` at bottom of component

### 4. Update session detail page
File: `shuttleup-web/src/app/[locale]/sessions/[id]/page.tsx`

Changes on lines 200-209:
- Button text: `"Book Slot Now"` → `"Request to Join"`
- Subtitle text: `"No account required to book."` → `"Host will review your request."`

### 5. Add pending count to stats card (optional enhancement)
Add a 3rd stats card "Pending Requests" next to "Upcoming Sessions" and "Total Participants":

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
    <Bell className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{totalPending}</div>
    <p className="text-xs text-muted-foreground">Awaiting your review</p>
  </CardContent>
</Card>
```

## Todo List

- [ ] Create `shuttleup-web/src/lib/hooks/use-bookings.ts` with 4 hooks
- [ ] Create `shuttleup-web/src/components/dashboard/manage-session-panel.tsx`
- [ ] Update dashboard page — add notification dot on "Manage" button
- [ ] Update dashboard page — wire Sheet open/close state
- [ ] Update dashboard page — add `<ManageSessionPanel>` component
- [ ] Update session detail page — "Request to Join" text
- [ ] Update session detail page — subtitle text
- [ ] Add "Pending Requests" stats card to dashboard (optional)
- [ ] Run `npm run lint` and `npm run build`
- [ ] Manual test: book as guest → check dot appears → approve → verify slot decremented

## Success Criteria

- Red notification dot appears on "Manage" button when pending bookings exist
- Dot shows correct count number
- Clicking "Manage" opens Sheet with pending participant list
- Each participant shows name, skill, ELO (or "Guest" badge)
- Accept button → booking moves to `PENDING_PAYMENT`, dot count decrements
- Reject button → booking moves to `REJECTED`, removed from list
- Toast feedback on accept/reject
- "Book Slot Now" changed to "Request to Join" on session detail page
- Responsive on mobile

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Sheet component missing props | Already installed — verify imports work |
| Polling causes too many API calls | 30s interval is conservative; debounce if needed |
| Dashboard page exceeds 200 lines | Extract manage button + dot into small component if needed |

## Security Considerations

- All approve/reject endpoints require `AuthGuard`
- Host authorization check: `session.hostId === currentUser.id`
- Guest booking data (phone) only visible to host, not other participants
