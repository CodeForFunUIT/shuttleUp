# Phase 2: Config Layer

## Priority: 🟡 Medium | Status: ⬜ Planned

## Overview
Thay thế `process.env` hardcode trong `app.module.ts` và `main.ts` bằng typed config với `registerAs()`. Giúp type-safe, dễ validate, dễ test.

## Related Files

### [NEW] Tạo mới
- `src/config/app.config.ts` — PORT, NODE_ENV, API_PREFIX
- `src/config/database.config.ts` — DATABASE_URL
- `src/config/redis.config.ts` — REDIS_HOST, REDIS_PORT
- `src/config/auth.config.ts` — BETTER_AUTH_SECRET, BETTER_AUTH_URL

### [MODIFY] Cập nhật
- `src/app.module.ts` — load configs via `ConfigModule.forRoot({ load: [...] })`
- `src/main.ts` — inject `ConfigService` cho PORT, GlobalPrefix, CORS

## Implementation Steps

### 1. Tạo `config/app.config.ts`
```typescript
import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
}));
```

### 2. Tạo `config/redis.config.ts`
```typescript
import { registerAs } from '@nestjs/config';
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
}));
```

### 3. Tạo `config/database.config.ts` & `config/auth.config.ts`
- Tương tự pattern `registerAs()`

### 4. Update `app.module.ts`
- Import all configs trong `ConfigModule.forRoot({ load: [appConfig, redisConfig, ...] })`
- BullModule dùng `ConfigService` inject thay hardcode

### 5. Update `main.ts`
```typescript
const configService = app.get(ConfigService);
const port = configService.get<number>('app.port');
app.setGlobalPrefix(configService.get<string>('app.apiPrefix'));
app.enableCors({ origin: configService.get<string>('app.corsOrigin') });
await app.listen(port);
```

## Todo
- [ ] Tạo `src/config/app.config.ts`
- [ ] Tạo `src/config/redis.config.ts`
- [ ] Tạo `src/config/database.config.ts`
- [ ] Tạo `src/config/auth.config.ts`
- [ ] Update `app.module.ts` dùng typed configs
- [ ] Update `main.ts` dùng ConfigService
- [ ] Build test pass

## Success Criteria
- Không còn `process.env` trực tiếp ngoài file `config/*.ts`
- `npm run build` pass
- App khởi động bình thường với config mới
