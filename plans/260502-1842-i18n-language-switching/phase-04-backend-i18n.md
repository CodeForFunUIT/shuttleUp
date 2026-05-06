# Phase 4: Backend I18nService + API Translations

## Context Links
- [Plan Overview](./plan.md)
- [http-exception.filter.ts](../../shuttleup-api/src/common/filters/http-exception.filter.ts)
- API services with throw statements: bookings, elo, payments, sessions, users

## Overview
- **Priority:** Medium
- **Status:** ⬜ Not started
- Create a lightweight `I18nService` that reads `Accept-Language` header and returns translated messages
- No external deps — just JSON files + a service

## Architecture

```
shuttleup-api/src/i18n/
├── en.json          # { "SESSION_NOT_FOUND": "Session not found", ... }
├── vi.json          # { "SESSION_NOT_FOUND": "Không tìm thấy phiên đánh", ... }
├── i18n.service.ts  # Injectable service with t(key, locale) method
└── i18n.module.ts   # Global module
```

## Implementation Steps

### Step 1: Create API message files

```json
// src/i18n/en.json
{
  "SESSION_NOT_FOUND": "Session not found",
  "SESSION_FULL": "This session is already full",
  "COURT_NOT_FOUND": "Court not found",
  "BOOKING_NOT_FOUND": "Booking not found",
  "BOOKING_ALREADY_CANCELLED": "This booking is already cancelled",
  "BOOKING_ALREADY_EXISTS": "You have already booked this session",
  "UNAUTHORIZED": "Please log in to continue",
  "FORBIDDEN": "You do not have permission to perform this action",
  "INVALID_CREDENTIALS": "Invalid email or password",
  "EMAIL_ALREADY_EXISTS": "An account with this email already exists",
  "VALIDATION_FAILED": "Validation failed",
  "INTERNAL_ERROR": "An unexpected error occurred",
  "PAYMENT_FAILED": "Payment processing failed",
  "USER_NOT_FOUND": "User not found"
}
```

```json
// src/i18n/vi.json
{
  "SESSION_NOT_FOUND": "Không tìm thấy phiên đánh",
  "SESSION_FULL": "Phiên đánh đã đầy",
  "COURT_NOT_FOUND": "Không tìm thấy sân",
  "BOOKING_NOT_FOUND": "Không tìm thấy đặt chỗ",
  "BOOKING_ALREADY_CANCELLED": "Đặt chỗ này đã bị hủy",
  "BOOKING_ALREADY_EXISTS": "Bạn đã đặt phiên này rồi",
  "UNAUTHORIZED": "Vui lòng đăng nhập để tiếp tục",
  "FORBIDDEN": "Bạn không có quyền thực hiện hành động này",
  "INVALID_CREDENTIALS": "Email hoặc mật khẩu không đúng",
  "EMAIL_ALREADY_EXISTS": "Email này đã được sử dụng",
  "VALIDATION_FAILED": "Dữ liệu không hợp lệ",
  "INTERNAL_ERROR": "Đã xảy ra lỗi không mong muốn",
  "PAYMENT_FAILED": "Xử lý thanh toán thất bại",
  "USER_NOT_FOUND": "Không tìm thấy người dùng"
}
```

### Step 2: Create I18nService

```ts
// src/i18n/i18n.service.ts
import { Injectable } from '@nestjs/common';
import * as en from './en.json';
import * as vi from './vi.json';

const messages: Record<string, Record<string, string>> = { en, vi };

@Injectable()
export class I18nService {
  private readonly supportedLocales = ['en', 'vi'];
  private readonly defaultLocale = 'en';

  /** Translate a message key for the given locale */
  t(key: string, locale?: string): string {
    const lang = this.supportedLocales.includes(locale ?? '')
      ? locale!
      : this.defaultLocale;
    return messages[lang]?.[key] ?? messages[this.defaultLocale]?.[key] ?? key;
  }

  /** Extract locale from Accept-Language header */
  extractLocale(acceptLanguage?: string): string {
    if (!acceptLanguage) return this.defaultLocale;
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.trim().toLowerCase();
    return this.supportedLocales.includes(preferred) ? preferred : this.defaultLocale;
  }
}
```

### Step 3: Create I18nModule (Global)

```ts
// src/i18n/i18n.module.ts
import { Global, Module } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Global()
@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
```

### Step 4: Register in AppModule

Add `I18nModule` to `imports` in `app.module.ts`.

### Step 5: Update HttpExceptionFilter

Inject `I18nService`, extract locale from request header, translate error messages:

```ts
catch(exception: HttpException, host: ArgumentsHost) {
  const request = ctx.getRequest<Request>();
  const locale = this.i18nService.extractLocale(request.headers['accept-language']);
  // ... translate message using this.i18nService.t(messageKey, locale)
}
```

### Step 6: Update service throw statements

Replace hardcoded strings in services with message keys:

```ts
// Before
throw new NotFoundException('Session not found');

// After
throw new NotFoundException('SESSION_NOT_FOUND');
```

Services to update:
- `sessions.service.ts`
- `bookings.service.ts`
- `users.service.ts`
- `payments.service.ts`
- `elo/services/elo-match.service.ts`
- `elo/services/elo-leaderboard.service.ts`

### Step 7: Enable `resolveJsonModule` in tsconfig

Ensure `shuttleup-api/tsconfig.json` has:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

## Todo List
- [ ] Create `src/i18n/en.json` with all API message keys
- [ ] Create `src/i18n/vi.json` with Vietnamese translations
- [ ] Create `src/i18n/i18n.service.ts`
- [ ] Create `src/i18n/i18n.module.ts` (Global)
- [ ] Register `I18nModule` in `AppModule`
- [ ] Update `HttpExceptionFilter` to use `I18nService`
- [ ] Replace hardcoded error strings in 6 service files with message keys
- [ ] Verify `resolveJsonModule` enabled
- [ ] Build passes

## Success Criteria
- API returns translated error messages based on `Accept-Language` header
- `curl -H "Accept-Language: vi" /api/sessions/nonexistent` → `"Không tìm thấy phiên đánh"`
- `curl -H "Accept-Language: en" /api/sessions/nonexistent` → `"Session not found"`
- Falls back to EN for unknown locales
- Build passes
