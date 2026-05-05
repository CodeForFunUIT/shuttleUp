---
title: "ELO Guest Block — Phương án C"
description: Chặn guest chưa đăng ký khỏi ELO session. Validate booking level khi tạo chỗ + validate player level khi submit kết quả.
status: complete
priority: high
effort: 0.5d
branch: feat/elo-guest-block
tags: [elo, validation, guest, booking]
created: 2026-04-29
---

# ELO Guest Block

## Problem

`Booking.userId` là nullable (guest có `guestName` nhưng không có `userId`).
Khi host submit ELO với playerIds trong DTO → player IDs phải là registered `userId`.
Nếu guest vào session ELO → không có `UserEloRating` → crash hoặc sai dữ liệu.

## Solution — Option C

Hai lớp validation:

1. **Booking level:** Nếu session là ELO (`gameType != null`), **không cho phép guest booking**
2. **Submit level:** Trước khi tính ELO, verify tất cả playerIds trong DTO đều là registered users tồn tại trong DB

## Phases

| Phase | File | Status | Effort |
|-------|------|--------|--------|
| 1 — Booking validation | [phase-01-booking-validation.md](./phase-01-booking-validation.md) | complete | 2h |
| 2 — Submit validation | [phase-02-submit-validation.md](./phase-02-submit-validation.md) | complete | 1h |
| 3 — Tests | [phase-03-tests.md](./phase-03-tests.md) | complete | 1h |

## Key Dependencies

- `BookingsService.create()` — thêm ELO session guest-block check
- `EloMatchService.submitMatch()` — thêm player existence check
- Không cần schema change
