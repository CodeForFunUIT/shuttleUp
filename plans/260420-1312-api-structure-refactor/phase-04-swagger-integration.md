# Phase 4: Swagger Integration

## Priority: 🟡 Medium | Status: ⬜ Planned

## Overview
Cài `@nestjs/swagger` và auto-generate API documentation từ DTOs + controllers. Thay thế Postman Collection thủ công bằng OpenAPI spec tự động cập nhật.

## Parallel
- Có thể chạy song song với Phase 1-3

## Related Files

### [NEW] Tạo mới
- (không tạo file mới — chỉ cài package và config)

### [MODIFY] Cập nhật
- `package.json` — thêm `@nestjs/swagger`
- `src/main.ts` — setup `SwaggerModule`
- `src/sessions/dto/session.dto.ts` — thêm `@ApiProperty()` decorators
- `src/sessions/dto/search-session.dto.ts` — thêm `@ApiProperty()`
- `src/bookings/dto/booking.dto.ts` — thêm `@ApiProperty()`
- `src/users/dto/update-user.dto.ts` — thêm `@ApiProperty()`
- Tất cả controllers — thêm `@ApiTags()`, `@ApiBearerAuth()`, `@ApiOperation()`
- `nest-cli.json` — enable Swagger CLI plugin (auto-infer types)

## Implementation Steps

### 1. Install
```bash
npm install @nestjs/swagger
```

### 2. Enable CLI Plugin (recommended) trong `nest-cli.json`
```json
{
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```
Plugin mode tự động infer `@ApiProperty()` từ DTO types → ít boilerplate hơn.

### 3. Setup Swagger trong `main.ts`
```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('ShuttleUp API')
  .setDescription('Badminton session booking platform API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const doc = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, doc);
```

### 4. Annotate controllers
```typescript
@ApiTags('Sessions')
@Controller('sessions')

@ApiBearerAuth()
@ApiOperation({ summary: 'Create a new session' })
@Post()
```

### 5. Annotate DTOs (chỉ nếu CLI plugin không cover)
```typescript
@ApiProperty({ description: 'Court ID', example: 'clx123...' })
@IsString()
courtId: string;
```

## Todo
- [ ] `npm install @nestjs/swagger`
- [ ] Update `nest-cli.json` enable plugin
- [ ] Setup Swagger trong `main.ts`
- [ ] Annotate all controllers `@ApiTags` + `@ApiBearerAuth`
- [ ] Kiểm tra DTOs auto-infer qua plugin
- [ ] Verify docs tại `http://localhost:3000/docs`
- [ ] Build pass

## Success Criteria
- Truy cập `http://localhost:3000/docs` hiển thị full Swagger UI
- Tất cả endpoints xuất hiện đúng method + path + body schema
- Auth endpoints có khóa Bearer
