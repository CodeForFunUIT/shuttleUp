# Phase 5: Decouple & Cleanup

## Priority: 🟡 Medium | Status: ⬜ Planned

## Overview
Giải quyết tight coupling giữa modules (BookingsService inject thẳng NotificationsService) bằng NestJS EventEmitter. Cleanup main.ts bootstrap, thêm global ValidationPipe.

## Depends On
- Phase 1 (guards relocated)
- Phase 2 (configs ready)
- Phase 3 (interceptors/filters registered)

## Related Files

### [NEW] Tạo mới
- `src/common/events/booking.events.ts` — event classes: `BookingCreatedEvent`, `BookingCancelledEvent`

### [MODIFY] Cập nhật
- `package.json` — thêm `@nestjs/event-emitter`
- `src/app.module.ts` — import `EventEmitterModule.forRoot()`
- `src/bookings/bookings.module.ts` — remove `NotificationsModule` import
- `src/bookings/bookings.service.ts` — inject `EventEmitter2` thay `NotificationsService`
- `src/notifications/notifications.service.ts` — thêm `@OnEvent()` listeners
- `src/main.ts` — consolidated bootstrap (ValidationPipe, prefix, CORS, Swagger, filters, interceptors)

### [DELETE] Xóa
- `src/auth/guards/` — folder (đã chuyển ở Phase 1, cleanup nếu còn sót)

## Implementation Steps

### 1. Install EventEmitter
```bash
npm install @nestjs/event-emitter
```

### 2. Tạo event classes
```typescript
// src/common/events/booking.events.ts
export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly hostId: string,
  ) {}
}
export class BookingCancelledEvent { ... }
```

### 3. Update `bookings.service.ts`
```typescript
// BEFORE (tight coupling)
constructor(private notifications: NotificationsService) {}
this.notifications.dispatch('booking.created', payload);

// AFTER (event-driven)
constructor(private eventEmitter: EventEmitter2) {}
this.eventEmitter.emit('booking.created', new BookingCreatedEvent(booking.id, session.id, session.hostId));
```

### 4. Update `notifications.service.ts` — thêm event listener
```typescript
@OnEvent('booking.created')
async handleBookingCreated(event: BookingCreatedEvent) {
  await this.notificationsQueue.add('booking.created', {
    bookingId: event.bookingId,
    sessionId: event.sessionId,
    hostId: event.hostId,
  });
}
```

### 5. Update `bookings.module.ts`
- Remove `NotificationsModule` from imports (no longer needed)

### 6. Consolidated `main.ts`
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global interceptors & filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // API prefix & CORS
  app.setGlobalPrefix(config.get('app.apiPrefix'));
  app.enableCors({ origin: config.get('app.corsOrigin') });

  // Swagger (Phase 4)
  // ... swagger setup ...

  await app.listen(config.get('app.port'));
}
```

## Todo
- [ ] `npm install @nestjs/event-emitter`
- [ ] Import `EventEmitterModule.forRoot()` trong `app.module.ts`
- [ ] Tạo `src/common/events/booking.events.ts`
- [ ] Refactor `bookings.service.ts` → `EventEmitter2`
- [ ] Thêm `@OnEvent()` listeners trong `notifications.service.ts`
- [ ] Remove `NotificationsModule` từ `bookings.module.ts` imports
- [ ] Consolidate `main.ts` bootstrap
- [ ] Build + test pass
- [ ] Verify full booking flow vẫn hoạt động (create → notification dispatched)

## Success Criteria
- `BookingsModule` không import `NotificationsModule`
- `BookingsService` không inject `NotificationsService`
- Event-driven: booking.created → notification queue vẫn hoạt động
- `main.ts` gọn, dùng ConfigService, có global pipes/filters/interceptors
- `npm run build` + `npm run test` pass

## Risk Assessment
- **Event listener không fire**: Kiểm tra `EventEmitterModule.forRoot()` đã import
- **Notification bị mất**: Event listeners mặc định synchronous — BullMQ vẫn xử lý async retry
