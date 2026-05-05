---
title: Remove Score Multiplier from BELo System
description: Loại bỏ score_multiplier (tỉ số set 2-0/2-1) khỏi hệ thống BELo vì không phù hợp với bối cảnh đánh cầu lông vãng lai (pick-up games)
status: ready
priority: high
effort: small
branch: feat/remove-score-multiplier
tags: [belo, elo, refactor, simplification]
created: 2026-04-29T13:45:00+07:00
---

# Plan: Remove Score Multiplier from BELo

## Context

- [Brainstorm Report](../reports/brainstormer-260429-1344-remove-score-multiplier.md)
- [BELo Spec](../260415-1127-shuttleup-bootstrap/research/belo-badminton-ranking-spec.md)

## Problem

Score Multiplier (§7) yêu cầu format best-of-3 sets (2-0 / 2-1). Pick-up games chỉ đánh 1 set → multiplier vô nghĩa.

## Solution

Bỏ hoàn toàn `scoreMultiplier`. Công thức ELO rút gọn:

```
R'(A) = R(A) + K × (S(A) - E(A))
```

## Phases

| # | Phase | Status | Files |
|---|-------|--------|-------|
| 1 | [Backend: Types & Calculation Service](phase-01-backend-types-and-calc.md) | ✅ | 3 files |
| 2 | [Backend: Match Service & DTO](phase-02-backend-match-service-dto.md) | ✅ | 2 files |
| 3 | [Frontend: Simulator & How-It-Works](phase-03-frontend-components.md) | ✅ | 2 files |
| 4 | [Spec & Documentation](phase-04-spec-and-docs.md) | ✅ | 2 files |

## Dependencies

- Phase 1 → Phase 2 (types must change before match service)
- Phase 3 independent of Phase 1-2
- Phase 4 last (after all code changes)

## Success Criteria

- [x] `npm run lint` passes for both API and Web
- [x] `npm run test` passes for API (updated tests)
- [x] No references to `scoreMultiplier` or `getScoreMultiplier` in codebase
- [x] `score` field removed from `SubmitMatchDto`
- [x] Spec §7 updated to reflect removal
