# Brainstorm: Remove Score Multiplier from BELo System

## Problem Statement

`score_multiplier` trong BELo spec dựa trên tỉ số set (2-0 / 2-1) — format best-of-3.
Thực tế pick-up badminton: người chơi đánh 1 trận → nghỉ 1 trận → tiếp. Chỉ đánh 1 set (21 điểm).
→ Score multiplier **vô nghĩa** trong bối cảnh thực tế.

## Evaluated Approaches

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| A. Score Gap (21-15 etc) | Phản ánh sức mạnh thực | UX friction, phải nhập điểm | Tốt cho v2 |
| **B. Bỏ hoàn toàn** | **KISS, UX tốt nhất** | **Mất chi tiết** | **✅ Chọn** |
| C. Session Performance | Thưởng hiệu suất buổi | Phức tạp, mất real-time | Quá phức tạp |
| D. Hybrid (optional score) | Linh hoạt | Bất công nhẹ giữa trận | Tốt cho v2 |

## Decision: Phương án B — Bỏ Score Multiplier

**Lý do:**
- K-factor + Carry Weight + Synergy đã đủ phân biệt chất lượng
- Pick-up games chỉ đánh 1 set → không có concept "2-0" vs "2-1"
- Giảm input friction cho user (chỉ cần Win/Lose)
- Đúng KISS & YAGNI

## Impact Analysis

### Files cần sửa:

**Backend (shuttleup-api):**
1. `src/elo/types/elo-calculation.types.ts` — Xóa `score` param, xóa `scoreMultiplier` field
2. `src/elo/services/elo-calculation.service.ts` — Xóa `getScoreMultiplier()`, bỏ multiplier logic
3. `src/elo/services/elo-calculation.service.spec.ts` — Xóa tests cho `getScoreMultiplier`
4. `src/elo/services/elo-match.service.ts` — Bỏ `scoreMultiplier` khỏi `PlayerResult`
5. `src/elo/dto/submit-match.dto.ts` — Xóa field `score`

**Frontend (shuttleup-web):**
6. `src/components/belo/belo-simulator.tsx` — Xóa score selector, xóa multiplier logic
7. `src/components/belo/belo-how-it-works.tsx` — Xóa card Score Multiplier

**Spec:**
8. `plans/.../belo-badminton-ranking-spec.md` — Cập nhật §7, §2.2, §13

## Risk Assessment

- **Low risk**: Score multiplier chưa được dùng trong production
- **Breaking**: DTO `score` field bị xóa → API contract thay đổi
- **Migration**: Không cần DB migration (scoreMultiplier trong schema chưa deploy)

## Next Steps

Tạo implementation plan chi tiết → `/plan`
