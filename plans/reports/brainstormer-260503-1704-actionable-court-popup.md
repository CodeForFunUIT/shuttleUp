# Brainstorm: Actionable Court Popup with Session List

## Problem Statement
When a user clicks a court marker on the map, the popup shows aggregated stats (session count, price range, available slots) but **no way to take action**. Users can't see which specific sessions are available or navigate to book one. This creates a dead end in the UX flow.

**User expectation:** Click marker → see what's available → book a session.

## Evaluated Approaches

### Option A: Expand Popup with Inline Session List + Book Links
Show a scrollable mini-list of individual sessions directly inside the Leaflet popup, each with a "Book" link.

*   **Pros:** Everything visible without leaving the map. Quick comparison.
*   **Cons:** Leaflet popups have limited space and don't support React routing well. Scrollable content inside a small popup is awkward on mobile. Popup closes on map interaction, losing context.

### Option B: "View Sessions" Button → Navigate to Filtered Sessions Page
Add a CTA button in the popup that links to `/sessions?court={courtId}` — a filtered view of the sessions page showing only sessions at that court.

*   **Pros:** Clean separation of concerns. Reuses existing session cards with full booking flow. Works well on mobile.
*   **Cons:** Requires adding a `court` query param filter to the sessions page. Navigates away from the map entirely.

### Option C: "View Sessions" Button → Side Panel / Drawer
Keep the map visible and open a slide-in panel (drawer) from the right showing the court's sessions as cards. Each card links to `/sessions/{id}` for booking.

*   **Pros:** Best UX — map stays visible, sessions are browsable, clear path to booking. Modern pattern (Airbnb, Google Maps use this).
*   **Cons:** Slightly more complex to implement (need a drawer/sheet component). But shadcn/ui already has `Sheet` component available.

## Final Recommended Solution

**Recommendation: Option C — Side Panel (Sheet) with Session Cards**

*Rationale:*
1. **Best UX flow:** User clicks marker → popup shows summary + "View X sessions" button → sheet slides in with full session cards → click "View details" → goes to `/sessions/{id}` with booking button. No dead ends.
2. **Map stays visible** — user doesn't lose spatial context. They can close the sheet and click another marker.
3. **Reuses existing card design** — the session card from the grid view can be extracted as a shared component.
4. **shadcn/ui Sheet** is already installable (Radix UI based) — minimal effort.
5. **KISS:** The popup stays simple (court name + stats + CTA button). The complexity moves to the sheet which has more room.

## Implementation Considerations
1. Add shadcn `Sheet` component if not already installed.
2. Add state to `sessions-map.tsx` for `selectedCourt: CourtGroup | null`.
3. When "View Sessions" button clicked in popup → set `selectedCourt` → open Sheet.
4. Sheet content: court header + scrollable list of session mini-cards with "View Details" links to `/sessions/{id}`.
5. Each session card shows: title, time, skill badge, price, available slots, host name.

## Success Metrics
- User can go from map marker → view individual sessions → navigate to booking page in ≤ 3 clicks.
- Sheet is responsive and works on mobile.
- Map remains interactive while sheet is open.

## Next Steps
Implement directly — this is a small, focused change (~1-2 files). No separate plan needed.
