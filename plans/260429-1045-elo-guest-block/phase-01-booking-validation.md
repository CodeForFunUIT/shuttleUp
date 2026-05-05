# Phase 01 — Booking Validation (Guest Block ở bước đặt chỗ)

## Context

- File: `src/bookings/bookings.service.ts` → method `create()`
- File: `src/bookings/dto/booking.dto.ts`
- Schema: `Booking.userId = String?`, `CourtSession.gameType = String?`

## Overview

**Priority:** High  
**Status:** Pending  
**Goal:** Không cho phép guest (không có `userId`) đặt chỗ vào session ELO

## Key Insight

Session là **ELO session** khi `CourtSession.gameType != null` (đã được set khi tạo session).  
`BookingsService.create()` hiện tại đã có điều kiện `if (!userId && (!guestName || !guestPhone))` — ta cần thêm 1 điều kiện nữa: nếu session là ELO session thì `userId` bắt buộc.

## Requirements

- **Functional:** Guest (`userId = null`) không thể book ELO session
- **Non-functional:** Error message rõ ràng, không làm hỏng luồng booking thường

## Architecture

```
BookingsService.create()
  → Query session (đã có)
  → [NEW] Check: if session.gameType != null AND !userId → throw BadRequestException
  → Continue normal booking flow
```

## Related Code Files

- **Modify:** `src/bookings/bookings.service.ts`
  - Method: `create()` — thêm check sau khi load session
- **No change:** `booking.dto.ts`, schema

## Implementation Steps

1. Trong `BookingsService.create()`, sau đoạn `if (!session) throw ...`, thêm:

```typescript
// ELO sessions require registered users (guests cannot participate in ranked matches)
if (session.gameType && !userId) {
  throw new BadRequestException(
    'ELO sessions require a registered account. Please sign up to join this session.',
  );
}
```

2. `session` phải include `gameType` → check query hiện tại:

```typescript
const session = await this.prisma.courtSession.findUnique({
  where: { id: sessionId },
  // gameType đã có sẵn trong CourtSession — không cần thêm select
});
```

## Todo List

- [ ] Thêm ELO guest-block check vào `BookingsService.create()`
- [ ] Verify `session.gameType` được trả về (không bị select filter)

## Success Criteria

- Guest booking vào ELO session → 400 BadRequest với message rõ ràng
- Guest booking vào non-ELO session (gameType = null) → vẫn hoạt động bình thường
- Registered user booking vào ELO session → vẫn hoạt động bình thường

## Risk Assessment

- **Low risk:** Chỉ thêm 1 điều kiện, không thay đổi luồng hiện tại
- **Edge case:** Session được tạo trước khi có ELO feature (gameType = null) → không bị chặn (OK)
