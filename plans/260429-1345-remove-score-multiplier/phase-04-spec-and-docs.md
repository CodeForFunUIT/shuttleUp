# Phase 4: Spec & Documentation Update

## Context

- [Plan Overview](plan.md)
- **Depends on**: Phase 1-3 (do last after all code changes)
- Files: `belo-badminton-ranking-spec.md`, project docs

## Overview

- **Priority**: 🟢 Low
- **Status**: ⬜ Not started

## Changes

### 4.1 `plans/.../belo-badminton-ranking-spec.md`

**§2.2 — Simplify ELO update formula:**

```diff
-R'(A) = R(A) + K × (S(A) - E(A)) × score_multiplier
+R'(A) = R(A) + K × (S(A) - E(A))
```

**§7 — Replace Score Multiplier section:**

Replace entire section with a note explaining removal:

```markdown
## 7. Score Multiplier — ĐÃ LOẠI BỎ (v1.1)

> **Lý do:** Score Multiplier dựa trên format best-of-3 sets (2-0 / 2-1).
> Trong pick-up badminton (đánh vãng lai), mỗi trận chỉ đánh 1 set → multiplier không áp dụng.
> Công thức ELO sử dụng K-factor, Carry Weight, và Synergy là đủ.
> Có thể bổ sung lại ở v2 với Score Gap Multiplier (dựa trên chênh lệch điểm) nếu cần.
```

**§12.1 — Remove `score` from required input:**

```diff
 | `winner` | player_id hoặc pair_id | |
 | `loser` | player_id hoặc pair_id | |
-| `score` | `"2-0"` hoặc `"2-1"` | Tùy chọn, mặc định `"2-1"` |
 | `played_at` | timestamp | |
```

**§13 — Update pseudocode:**
- Remove `score` param from `calculate_singles()`
- Remove `score_multiplier()` function
- Remove `m = score_multiplier(...)` usage

### 4.2 Project Documentation

Update changelog in `docs/project-changelog.md` with:
```
### v0.x.x — BELo Simplification
- Removed Score Multiplier (§7) from BELo spec — not applicable to pick-up games
- Simplified ELO formula: R' = R + K × (S - E)
- Removed `score` field from match submission DTO
```

## Todo

- [ ] Update §2.2 formula
- [ ] Rewrite §7 with removal note
- [ ] Update §3.3 formula (doubles)
- [ ] Remove `score` from §12.1 input table
- [ ] Update §12.3 processing order (remove step 8 multiplier)
- [ ] Update §13 pseudocode
- [ ] Add changelog entry
