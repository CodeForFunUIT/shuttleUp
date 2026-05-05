# Phase 3: Response Standardization

## Priority: 🔴 High | Status: ⬜ Planned

## Overview
Tạo global interceptor wrap response + global exception filter. Mọi API sẽ trả format thống nhất:
```json
{ "success": true, "data": {...}, "meta": { "page": 1, "limit": 10 } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Session not found" } }
```

## Depends On
- Phase 1 (enums)

## Related Files

### [NEW] Tạo mới
- `src/common/interceptors/transform.interceptor.ts` — wrap response `{ success, data }`
- `src/common/filters/http-exception.filter.ts` — catch all exceptions, format error
- `src/common/filters/prisma-exception.filter.ts` — catch Prisma errors (unique constraint, not found)
- `src/common/dto/api-response.dto.ts` — TypeScript generic `ApiResponse<T>`

### [MODIFY] Cập nhật
- `src/main.ts` — register global interceptor + filter
- `src/bookings/bookings.service.ts` — remove manual `{ success, message }` returns (interceptor handles)

## Implementation Steps

### 1. Tạo `common/dto/api-response.dto.ts`
```typescript
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: Record<string, any>;
  error?: { code: string; message: string; details?: any };
}
```

### 2. Tạo `common/interceptors/transform.interceptor.ts`
```typescript
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({ success: true, data })),
    );
  }
}
```

### 3. Tạo `common/filters/http-exception.filter.ts`
- Catch `HttpException` → format `{ success: false, error: { code, message } }`
- Log error for non-4xx

### 4. Tạo `common/filters/prisma-exception.filter.ts`
- Catch `PrismaClientKnownRequestError`:
  - P2002 (unique constraint) → 409 Conflict
  - P2025 (record not found) → 404 Not Found

### 5. Register global trong `main.ts`
```typescript
app.useGlobalInterceptors(new TransformInterceptor());
app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
```

### 6. Cleanup services
- `bookings.service.ts` line 124: `return { success: true, message: '...' }` → chỉ cần return data, interceptor wrap

## Todo
- [ ] Tạo `src/common/dto/api-response.dto.ts`
- [ ] Tạo `src/common/interceptors/transform.interceptor.ts`
- [ ] Tạo `src/common/filters/http-exception.filter.ts`
- [ ] Tạo `src/common/filters/prisma-exception.filter.ts`
- [ ] Register globals trong `main.ts`
- [ ] Cleanup manual response wrapping trong services
- [ ] Build + manual test pass

## Success Criteria
- Mọi response trả đúng format `{ success, data }` hoặc `{ success, error }`
- Prisma errors (duplicate, not found) được catch và format đẹp
- `npm run build` pass
