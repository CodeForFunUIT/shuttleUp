# ShuttleUp — Project Overview & PDR

> **Version:** 1.0 | **Updated:** April 2026 | **Status:** Phase 0 Complete

## Product Vision

ShuttleUp is a centralized platform connecting badminton hosts and walk-in players in Vietnam. It replaces fragmented Facebook groups with smart search, slot management, and deposit payments.

## Target Market

- **Region:** Vietnam, starting from Ho Chi Minh City
- **Scope:** Portfolio project with potential for real product
- **Developer:** Solo developer with AI coding support

## User Actors

### Host (Session Organizer)

- Rents courts (fixed or per-session)
- Needs to recruit players to share court costs
- Pain: manual posting to multiple groups, slot management chaos

### Walk-in Player (Vãng lai)

- Wants to play badminton without a fixed group
- Filters by: area, time, skill level, price, shuttle type
- Pain: scattered info, no formal booking mechanism

> **Note:** One account can be both host and walk-in depending on context. Role is determined per session, not per account.

## MVP Feature Set (Phase 1)

| ID | Feature | Description |
|----|---------|-------------|
| F01 | Authentication | Google OAuth + phone number registration |
| F02 | Profile & Skill | Self-declared skill level + host confirmation post-session |
| F03 | Session Posting | Single session: date, time, court, slots, price, shuttle type |
| F04 | Weekly Schedule | Recurring sessions via RRULE |
| F05 | Session Management | Approve, cancel, update session info |
| F06 | Search & Filter | By area, time, skill, price, shuttle type, singles/doubles |
| F07 | Booking | 1-tap registration with auto/manual approval |
| F08 | Payment Deposit | VNPay/MoMo, temporary hold, auto-refund on rejection |
| F09 | Real-time Notifications | Push + Zalo OA on booking events |

## Phase 2 Features (Mobile + Advanced)

| ID | Feature | Description |
|----|---------|-------------|
| F10 | Flutter Mobile App | Full MVP flow on iOS & Android |
| F11 | In-app Chat | WebSocket messaging between host and walk-ins |
| F12 | Rating & ELO | Post-session ratings with cumulative ELO score |
| F13 | Nearby Map | GPS-based court discovery |

## Phase 3 Features (Scale)

- F14: Opponent/partner matching (1-on-1 connection)
- F15: Community mini tournaments
- F16: Integrated court booking
- F17: Host analytics dashboard

## Key Business Rules

1. **Slot locking:** Redis atomic lock prevents overbooking
2. **Deposit flow:** Payment → temporary hold → host approve/reject → confirm/refund
3. **Auto-close:** Session auto-closes when all slots are filled
4. **Ghost prevention:** Mandatory deposit + conditional refund policy
5. **Skill verification:** Host confirms player skill after session (affects ELO)

## Core Workflows

### Host Posts a Session

```
Host fills info → Single/Recurring → Save to DB → System notifies matched users
→ Walk-in registers → Auto/Manual approval → Slot decremented → Auto-close when full
```

### Walk-in Finds & Joins

```
Open app → Apply filters → View matching sessions → Select session
→ Check availability → Pay deposit (VNPay/MoMo) → Auto/Manual approval
→ If approved: confirm → Reminder 1h before
→ If rejected: auto-refund
```

## Success Criteria

| Metric | Target |
|--------|--------|
| Core booking flow | End-to-end functional |
| Search response time | < 500ms with PostGIS |
| Mobile experience | Identical flow to web |
| Payment | Mock flow in MVP, real VNPay in v2 |
| Portfolio presentation | Professional README + case study + demo video |

## Database Overview

9 core tables: `users`, `courts`, `sessions`, `bookings`, `payments`, `payment_logs`, `ratings`, `skill_confirmations`, `notifications`, `messages`

Key indices: GiST index on court location, composite on session time+status, partial on unread notifications.

## API Modules

| Module | Endpoints |
|--------|-----------|
| Auth | register, login, google, refresh, logout |
| Users | profile CRUD, session history |
| Courts | list, create, detail |
| Sessions | feed, CRUD, nearby |
| Bookings | register, my list, approve/reject, cancel |
| Payments | initiate, webhook, detail, refund |
| Notifications | list, mark read |
| Ratings | submit, list by session |

## Timeline

| Phase | Estimated Hours | Duration |
|-------|----------------|----------|
| Phase 1 — Web MVP | 202h | 20 weeks |
| Phase 2 — Mobile | 108h | 10 weeks |
| Phase 3 — Launch | 24h | 4 weeks |
| **Total** | **334h** | **~34 weeks** |

> 20% buffer included. Based on 1–2 hours/day (evenings).
