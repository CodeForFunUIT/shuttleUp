---
title: "ShuttleUp API — Cấu trúc dự án A+ Refactor"
description: "Thêm common/, config/, standardize response, Swagger, decouple cross-module, enums"
status: completed
priority: high
effort: medium (~4-6h)
branch: refactor/api-structure-aplus
tags: [nestjs, architecture, refactor, api]
created: 2026-04-20
---

# ShuttleUp API — Cấu Trúc A+ Refactor

## Context
- Brainstorm report: [brainstormer-260420-1131](../reports/brainstormer-260420-1131-api-project-structure.md)
- Chọn **Phương Án A+**: Module cải tiến, không refactor kiến trúc lớn

## Phases

| # | Phase | Mô tả | Status |
|---|-------|-------|:------:|
| 1 | [Common Layer](./phase-01-common-layer.md) | Decorators, filters, interceptors, pipes, enums | ✅ |
| 2 | [Config Layer](./phase-02-config-layer.md) | Typed configs, env validation | ✅ |
| 3 | [Response Standardization](./phase-03-response-standardization.md) | Uniform API response + global error handling | ✅ |
| 4 | [Swagger Integration](./phase-04-swagger-integration.md) | Auto-generated API docs from DTOs | ✅ |
| 5 | [Decouple & Cleanup](./phase-05-decouple-cleanup.md) | EventEmitter, guard relocation, main.ts bootstrap | ✅ |

## Dependencies
- Phase 1 → Phase 3 (interceptor cần enums)
- Phase 2 → Phase 5 (config cần xong trước cleanup app.module)
- Phase 4 độc lập, có thể song song

## Key Decisions
- Giữ nguyên module-per-feature (không chuyển DDD)
- Dùng `@nestjs/swagger` plugin mode (auto-infer từ DTO)
- Dùng NestJS `EventEmitter2` thay inject trực tiếp cross-module
