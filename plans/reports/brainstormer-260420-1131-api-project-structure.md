# Brainstorm: ShuttleUp API — Cấu Trúc Dự Án Khi Scale

## Vấn Đề

Dự án `shuttleup-api` hiện dùng **module-per-feature** (flat), NestJS mặc định. Khi dự án phình to (thêm ELO engine, chat, recurring sessions, admin panel...), cấu trúc hiện tại sẽ gặp vấn đề gì? Best practice là gì?

---

## 1. Phân Tích Cấu Trúc Hiện Tại

### Cây thư mục hiện tại
```
src/
├── main.ts
├── app.module.ts / controller / service
├── auth/          → controller, service, guards/
├── users/         → controller, module, service
├── sessions/      → controller, module, service, dto/
├── courts/        → controller, module, service, dto/
├── bookings/      → controller, module, service, dto/
├── payments/      → controller, module, service
├── notifications/ → controller, module, service, processor, cron
├── prisma/        → module, service (shared)
├── redis/         → module, service (shared)
```

### Điểm Mạnh ✅
| # | Điểm | Giải thích |
|---|-------|------------|
| 1 | **Module-per-feature** | Đúng NestJS convention. Mỗi domain 1 folder |
| 2 | **Shared infra tách riêng** | `prisma/`, `redis/` là global modules |
| 3 | **DTO tách folder** | `sessions/dto/`, `courts/dto/` — tốt |
| 4 | **Guard tách riêng** | `auth/guards/` — clean |
| 5 | **File size nhỏ** | Không file nào >130 dòng |
| 6 | **BullMQ processor tách riêng** | `notifications.processor.ts` — đúng pattern |

### Điểm Yếu ⚠️
| # | Vấn đề | Mức Nghiêm Trọng | Ví dụ |
|---|--------|:-:|-------|
| 1 | **Không có `common/` hoặc `shared/`** | 🟡 | Custom decorators, pipes, interceptors, filters sẽ không biết để đâu |
| 2 | **Không có layer separation** | 🟡 | Controller gọi thẳng Service. Service chứa cả business logic + DB query. Thiếu Repository pattern |
| 3 | **Cross-module coupling** | 🔴 | `BookingsService` inject `NotificationsService` trực tiếp → tight coupling |
| 4 | **Không có Response/Error standardization** | 🟡 | Mỗi Service trả format khác nhau (`return booking` vs `return { success, message }`) |
| 5 | **Schema 1 file lớn** | 🟡 | `schema.prisma` 197 dòng, sẽ >500 khi thêm tính năng |
| 6 | **Config hardcode** | 🟡 | Redis config hardcode trong `app.module.ts` thay vì dùng `ConfigService` |
| 7 | **Thiếu API versioning** | 🟡 | Hiện tại dùng `/sessions`, khi cần v2 sẽ khó |
| 8 | **Không có Swagger/OpenAPI** | 🟡 | API documentation chỉ có Postman Collection thủ công |

---

## 2. Ba Phương Án Kiến Trúc

### Phương Án A: Module-per-Feature (Cải tiến — Recommended ⭐)

```
src/
├── main.ts
├── app.module.ts
│
├── common/                          ← THÊM MỚI
│   ├── decorators/                  # @CurrentUser, @Public, @Roles
│   ├── filters/                     # AllExceptionsFilter, PrismaExceptionFilter
│   ├── guards/                      # AuthGuard, RolesGuard (chuyển từ auth/)
│   ├── interceptors/                # TransformInterceptor, LoggingInterceptor
│   ├── pipes/                       # ValidationPipe config
│   ├── dto/                         # PaginationDto, ApiResponse<T>
│   └── constants/                   # enums, app constants
│
├── config/                          ← THÊM MỚI
│   ├── app.config.ts                # PORT, NODE_ENV
│   ├── database.config.ts           # DB_URL
│   ├── redis.config.ts              # REDIS_HOST, PORT
│   └── auth.config.ts               # JWT_SECRET, etc.
│
├── prisma/                          (giữ nguyên — shared infra)
├── redis/                           (giữ nguyên — shared infra)
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── strategies/                  # JwtStrategy, GoogleStrategy
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│
├── sessions/
│   ├── sessions.controller.ts
│   ├── sessions.service.ts
│   ├── sessions.module.ts
│   └── dto/
│
├── courts/        (tương tự)
├── bookings/      (tương tự)
├── payments/      (tương tự)
├── notifications/
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   ├── notifications.processor.ts
│   ├── notifications.cron.ts
│   ├── notifications.module.ts
│   └── templates/                   ← THÊM email/push templates
```

**Pros:** Quen thuộc NestJS, dễ onboard, thêm `common/` + `config/` giải quyết 80% vấn đề.
**Cons:** Khi >15 modules, folder `src/` vẫn dẹt (flat). Service vẫn fat.
**Khi nào dùng:** Dự án <15 modules, team <5 người. **Phù hợp ShuttleUp hiện tại nhất.**

---

### Phương Án B: Domain-Driven Design (DDD Layers)

```
src/
├── main.ts
├── app.module.ts
│
├── common/                          # Shared utilities
├── config/                          # Typed configs
│
├── domain/                          ← Business logic THUẦN
│   ├── session/
│   │   ├── session.entity.ts        # Plain class, no DB dependency
│   │   ├── session.repository.ts    # Interface (Port)
│   │   └── session.service.ts       # Pure business rules
│   ├── booking/
│   └── user/
│
├── infrastructure/                  ← Implementations
│   ├── database/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts
│   │   └── repositories/           # Concrete implementations
│   │       ├── prisma-session.repository.ts
│   │       └── prisma-booking.repository.ts
│   ├── queue/
│   │   ├── bull.module.ts
│   │   └── processors/
│   └── cache/
│       └── redis.service.ts
│
├── application/                     ← Use Cases / Orchestration
│   ├── session/
│   │   ├── create-session.use-case.ts
│   │   ├── search-nearby.use-case.ts
│   │   └── dto/
│   └── booking/
│       ├── create-booking.use-case.ts
│       └── cancel-booking.use-case.ts
│
├── presentation/                    ← HTTP Controllers only
│   ├── session/
│   │   └── session.controller.ts
│   ├── booking/
│   │   └── booking.controller.ts
│   └── filters/
```

**Pros:** Testability tuyệt vời, domain logic không phụ thuộc framework, dễ swap DB.
**Cons:** Boilerplate nhiều x3, team cần hiểu DDD, overkill cho dự án MVP/portfolio.
**Khi nào dùng:** Dự án enterprise >20 modules, domain phức tạp, team >8 người.

---

### Phương Án C: Feature Grouping (Hybrid)

```
src/
├── common/
├── config/
│
├── features/                        ← Nhóm lại
│   ├── session-management/          # Sessions + Courts (cùng domain)
│   │   ├── sessions/
│   │   ├── courts/
│   │   └── session-management.module.ts
│   ├── booking-flow/                # Bookings + Payments (cùng flow)
│   │   ├── bookings/
│   │   ├── payments/
│   │   └── booking-flow.module.ts
│   ├── user-management/             # Users + Auth
│   │   ├── auth/
│   │   ├── users/
│   │   └── user-management.module.ts
│   └── notifications/
│
├── infrastructure/
│   ├── prisma/
│   └── redis/
```

**Pros:** Nhóm module theo nghiệp vụ, `src/` gọn hơn, dễ hiểu flow.
**Cons:** Quyết định nhóm nào với nhóm nào đôi khi chủ quan. Thêm 1 layer folder.
**Khi nào dùng:** Dự án 10-20 modules, muốn gọn hơn A nhưng không nặng như B.

---

## 3. So Sánh Tổng Quan

| Tiêu chí | A: Module cải tiến | B: DDD | C: Feature Group |
|----------|:---:|:---:|:---:|
| Dễ onboard | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| Scalability | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Testability | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Boilerplate | Ít | Rất nhiều | Trung bình |
| NestJS convention | ✅ Native | ❌ Custom | 🟡 Gần native |
| Phù hợp ShuttleUp | ⭐⭐⭐ | ⭐ | ⭐⭐ |

---

## 4. Khuyến Nghị: Phương Án A+ (Module cải tiến)

Lý do: ShuttleUp là dự án portfolio, hiện có 7 business modules — chưa đủ lớn để cần DDD. Phương án A+ (thêm `common/` + `config/` + vài best practices) **giải quyết 90% pain points** mà **không phải refactor toàn bộ**.

### Checklist Cải Tiến Cụ Thể

#### Ưu tiên cao (nên làm ngay)
- [ ] Tạo `common/decorators/current-user.decorator.ts` → thay `@Req() req`
- [ ] Tạo `common/filters/http-exception.filter.ts` → response format thống nhất
- [ ] Tạo `common/interceptors/transform.interceptor.ts` → wrap `{ data, meta }`
- [ ] Tạo `common/dto/pagination.dto.ts` → reuse across modules
- [ ] Chuyển `auth/guards/` → `common/guards/` (vì nhiều module cần dùng)
- [ ] Tạo `config/` folder → dùng `registerAs()` typed config thay hardcode
- [ ] Thêm `@nestjs/swagger` → auto-gen API docs từ DTOs

#### Ưu tiên trung bình (khi thêm tính năng)
- [ ] Tách `BookingsService.notifications.dispatch()` → dùng NestJS EventEmitter thay inject trực tiếp
- [ ] Thêm `common/constants/enums.ts` → thay string literal `'OPEN'`, `'ALL'`
- [ ] Prisma multi-file schema (Prisma 6.x hỗ trợ `prismaSchemaFolder`)

#### Ưu tiên thấp (khi team >3)
- [ ] API versioning (`/api/v1/sessions`)
- [ ] Rate limiting (ThrottleGuard)
- [ ] Health check endpoint (`@nestjs/terminus`)

---

## 5. Anti-Patterns Cần Tránh

| Anti-pattern | Giải thích | Hiện tại? |
|-------------|------------|:---------:|
| **God Service** | 1 service >300 dòng, chứa mọi thứ | ❌ Chưa bị |
| **Circular dependency** | A inject B, B inject A | ❌ Chưa bị |
| **Controller chứa logic** | Validate, transform trong controller | ❌ Sạch |
| **Direct cross-module import** | Import service thay vì module | 🟡 `BookingsService` inject `NotificationsService` |
| **Config hardcode** | `process.env.REDIS_HOST` inline | 🟡 Có trong `app.module.ts` |
| **Inconsistent response** | Trả `entity` vs `{ success, data }` | 🟡 Đang bị |

---

## 6. Kết Luận

> Cấu trúc hiện tại **ổn cho giai đoạn bootstrap**. Không cần DDD hay refactor lớn.
> Chỉ cần bổ sung `common/` + `config/` + standardize response format là dự án sẵn sàng scale lên 15+ modules.

### Next Steps
1. User quyết định có muốn implement Phương Án A+ không
2. Nếu có → tạo implementation plan chi tiết (`/plan`)
3. Nếu chưa → park lại, ưu tiên features khác trước
