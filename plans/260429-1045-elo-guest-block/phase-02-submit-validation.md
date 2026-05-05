# Phase 02 — Submit Validation (Player Existence Check)

## Context

- File: `src/elo/services/elo-match.service.ts` → `submitMatch()`
- Host submit playerIds trong DTO — cần verify tất cả đều là registered users tồn tại trong DB

## Overview

**Priority:** High  
**Status:** Pending  
**Goal:** Đảm bảo tất cả playerIds trong `teamA` và `teamB` là real, registered users

## Key Insight

Hiện tại `submitMatch()` step 4 gọi `loadOrInitEloRatings()` — nếu userId không tồn tại trong bảng `User`, Prisma sẽ throw FK violation khi upsert `UserEloRating`.  
Cần validate **trước** bước đó: query `User` table để confirm tất cả IDs tồn tại.

Lý do validate cả ở submit (không chỉ dựa vào booking validation):
- Host có thể submit playerIds bất kỳ (không nhất thiết là người đã book)
- Defense in depth — 2 lớp validation độc lập

## Architecture

```
EloMatchService.submitMatch()
  Step 1: validate session + host auth  (đã có)
  Step 2: prevent duplicate submission  (đã có)
  Step 3: validate team sizes          (đã có)
  [NEW] Step 3.5: validate all player IDs exist in User table
  Step 4: load/init ELO ratings         (đã có)
  ...
```

## Related Code Files

- **Modify:** `src/elo/services/elo-match.service.ts`
  - Thêm method `validatePlayersExist()`
  - Gọi sau `validateTeamSizes()` trong `submitMatch()`

## Implementation Steps

1. Thêm private method vào `EloMatchService`:

```typescript
/** Verify all submitted player IDs correspond to registered users in DB */
private async validatePlayersExist(playerIds: string[]): Promise<void> {
  const users = await this.prisma.user.findMany({
    where: { id: { in: playerIds } },
    select: { id: true },
  });

  if (users.length !== playerIds.length) {
    const foundIds = new Set(users.map((u) => u.id));
    const missing = playerIds.filter((id) => !foundIds.has(id));
    throw new BadRequestException(
      `The following player IDs are not registered users: ${missing.join(', ')}`,
    );
  }
}
```

2. Gọi method trong `submitMatch()` sau `validateTeamSizes()`:

```typescript
// 3. Validate team sizes and no duplicate player IDs
this.validateTeamSizes(dto);

// 3.5. Verify all players are registered users (block guest/phantom IDs)
const allPlayerIds = [...dto.teamA, ...dto.teamB];
await this.validatePlayersExist(allPlayerIds);

// 4. Load or initialize ELO ratings for all players
const ratings = await this.loadOrInitEloRatings(allPlayerIds, dto.gameType);
```

3. Xóa dòng `const allPlayerIds = [...dto.teamA, ...dto.teamB];` ở step 4 cũ (đã move lên)

## Todo List

- [ ] Thêm `validatePlayersExist()` vào `EloMatchService`
- [ ] Gọi method ở đúng vị trí trong `submitMatch()`
- [ ] Refactor `allPlayerIds` không bị khai báo 2 lần

## Success Criteria

- Submit với userId không tồn tại → 400 với danh sách ID bị thiếu
- Submit với userId hợp lệ → flow ELO tiếp tục bình thường
- Error message đủ thông tin để host biết ID nào bị sai

## Security Consideration

- Không expose thêm thông tin nhạy cảm — chỉ echo lại IDs mà host đã gửi lên
- Không cần thêm auth check (host đã được verify ở step 1)
