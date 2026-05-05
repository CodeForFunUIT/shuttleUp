# Phase 03 — Unit Tests

## Context

- File: `src/bookings/bookings.service.spec.ts` (tạo mới nếu chưa có)
- File: `src/elo/services/elo-match.service.spec.ts` (đã có — thêm test case)

## Overview

**Priority:** Medium  
**Status:** Pending  
**Goal:** Cover các trường hợp mới cho 2 validations

## Test Cases cần thêm

### BookingsService (nếu có spec file)

```
describe('create — ELO session guest block')
  ✓ throws BadRequestException when guest tries to book ELO session
  ✓ allows guest to book non-ELO session (gameType = null)
  ✓ allows registered user to book ELO session
```

### EloMatchService (thêm vào elo-match.service.spec.ts)

```
describe('submitMatch — player existence validation')
  ✓ throws BadRequestException when teamA contains non-existent userId
  ✓ throws BadRequestException when teamB contains non-existent userId
  ✓ error message contains the missing player IDs
  ✓ passes when all player IDs exist in DB
```

## Mock Setup cần thêm

Trong `makePrismaMock()` — thêm `user.findMany`:

```typescript
user: {
  findMany: jest.fn().mockResolvedValue([
    { id: PLAYER_A },
    { id: PLAYER_B },
  ]),
},
```

## Todo List

- [ ] Thêm `user.findMany` vào `makePrismaMock()`
- [ ] Thêm test cases cho `validatePlayersExist()` trong `elo-match.service.spec.ts`
- [ ] Verify test cases cho booking (nếu spec file tồn tại)
- [ ] Chạy `npx jest src/elo` — pass 100%

## Success Criteria

- Tất cả test mới pass
- Không có test cũ bị break
- Coverage `EloMatchService` tăng thêm cho nhánh mới
