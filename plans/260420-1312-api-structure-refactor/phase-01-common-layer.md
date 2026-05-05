# Phase 1: Common Layer

## Priority: 🔴 High | Status: ⬜ Planned

## Overview
Tạo folder `src/common/` chứa shared utilities dùng chung toàn bộ API. Giải quyết vấn đề: không có nơi đặt decorators, guards dùng chung bị nhốt trong `auth/`, thiếu enums cho string literals.

## Context Links
- [Brainstorm report](../../reports/brainstormer-260420-1131-api-project-structure.md)
- [auth.guard.ts](../../../shuttleup-api/src/auth/guards/auth.guard.ts)

## Related Files

### [NEW] Tạo mới
- `src/common/decorators/current-user.decorator.ts` — `@CurrentUser()` thay `@Req() req`
- `src/common/decorators/public.decorator.ts` — `@Public()` mark route không cần auth
- `src/common/guards/auth.guard.ts` — chuyển từ `auth/guards/`
- `src/common/pipes/validation.pipe.ts` — global validation config
- `src/common/constants/enums.ts` — `SessionStatus`, `SkillLevel`, `BookingStatus`, `PaymentStatus`, `UserRole`
- `src/common/dto/pagination.dto.ts` — shared pagination query DTO

### [MODIFY] Cập nhật
- `src/sessions/sessions.controller.ts` — import guard từ `common/`, dùng `@CurrentUser()`
- `src/bookings/bookings.controller.ts` — tương tự
- `src/users/users.controller.ts` — tương tự
- `src/payments/payments.controller.ts` — tương tự
- `src/sessions/sessions.service.ts` — thay string literal bằng enum
- `src/bookings/bookings.service.ts` — thay string literal bằng enum

### [DELETE] Xóa
- `src/auth/guards/auth.guard.ts` — đã chuyển sang `common/guards/`
- `src/auth/guards/` — folder rỗng

## Implementation Steps

### 1. Tạo `common/constants/enums.ts`
```typescript
export enum SessionStatus { OPEN = 'OPEN', FULL = 'FULL', CANCELLED = 'CANCELLED', COMPLETED = 'COMPLETED' }
export enum SkillLevel { ALL = 'ALL', BEGINNER = 'BEGINNER', INTERMEDIATE = 'INTERMEDIATE', ADVANCED = 'ADVANCED' }
export enum BookingStatus { PENDING_PAYMENT = 'PENDING_PAYMENT', CONFIRMED = 'CONFIRMED', CANCELLED = 'CANCELLED', ATTENDED = 'ATTENDED' }
export enum PaymentStatus { PENDING = 'PENDING', SUCCESS = 'SUCCESS', FAILED = 'FAILED', REFUNDED = 'REFUNDED' }
export enum UserRole { USER = 'USER', ADMIN = 'ADMIN' }
```

### 2. Tạo `common/decorators/current-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

### 3. Tạo `common/decorators/public.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### 4. Di chuyển `auth/guards/auth.guard.ts` → `common/guards/auth.guard.ts`
- Thêm logic check `IS_PUBLIC_KEY` metadata qua `Reflector`
- Xóa folder `auth/guards/` cũ

### 5. Tạo `common/dto/pagination.dto.ts`
```typescript
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 10;
}
```

### 6. Update tất cả controllers: `@Req() req` → `@CurrentUser()`
- `sessions.controller.ts`: `create(@CurrentUser('id') userId: string, ...)`
- `bookings.controller.ts`: `createAuth(@CurrentUser('id') userId: string, ...)`
- `users.controller.ts`: `getProfile(@CurrentUser() user)`
- Thay import guard path: `'../auth/guards/auth.guard'` → `'../common/guards/auth.guard'`

### 7. Update services: string literal → enum
- `sessions.service.ts`: `status: 'OPEN'` → `status: SessionStatus.OPEN`
- `bookings.service.ts`: `'PENDING_PAYMENT'` → `BookingStatus.PENDING_PAYMENT`, etc.

## Todo
- [ ] Tạo `src/common/constants/enums.ts`
- [ ] Tạo `src/common/decorators/current-user.decorator.ts`
- [ ] Tạo `src/common/decorators/public.decorator.ts`
- [ ] Chuyển & cải tiến `auth.guard.ts` → `common/guards/`
- [ ] Tạo `src/common/dto/pagination.dto.ts`
- [ ] Update 4 controllers dùng `@CurrentUser()` + import mới
- [ ] Update 2 services dùng enums
- [ ] Xóa `auth/guards/` folder cũ
- [ ] Build test pass

## Success Criteria
- `npm run build` pass
- Không còn `@Req() req` / `req.user` trong controllers
- Không còn string literal cho status/role trong services
- `auth/guards/` folder không còn tồn tại
