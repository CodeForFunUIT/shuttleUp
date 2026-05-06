# Scout: Create Session API Integration

## Backend (shuttleup-api)

### Endpoint
- `POST /api/sessions` — AuthGuard protected, extracts `userId` from Better Auth session cookie
- Auth uses **Better Auth cookie-based sessions** (not JWT Bearer token)
- `withCredentials: true` on axios is sufficient — no manual token injection needed

### CreateSessionDto (`src/sessions/dto/session.dto.ts`)
| Field | Type | Required | Validation |
|---|---|---|---|
| courtId | string | ✅ | @IsString |
| title | string | ✅ | @IsString |
| description | string | ❌ | @IsOptional |
| startTime | string | ✅ | @IsDateString (ISO) |
| endTime | string | ✅ | @IsDateString (ISO) |
| totalSlots | number | ✅ | @IsInt @Min(1) |
| pricePerSlot | number | ✅ | @IsInt @Min(0) |
| skillRequired | enum | ❌ | ALL/BEGINNER/INTERMEDIATE/ADVANCED |
| gameType | enum | ❌ | singles/doubles/mixed |

### Courts API
- `GET /api/courts` — returns all 373 courts (no auth required)
- Each court has: `id`, `name`, `address`, `district`
- Court selection = searchable dropdown → sends `courtId` to backend

## Frontend (shuttleup-web)

### Existing Libraries (already installed)
- `react-hook-form@7.72.1`
- `@hookform/resolvers@5.2.2`
- `zod@4.3.6`
- `@tanstack/react-query@5.99.0`
- `axios` — `api.ts` already configured with `withCredentials: true`
- `sonner` — toast notifications
- shadcn/ui: Input, Select, Button, Card, Label

### Existing Patterns
- `use-sessions.ts` — useQuery for GET /api/sessions
- `use-user.ts` — useQuery for GET /api/users/me
- Types in `src/lib/types.ts` — Court, CourtSession interfaces

### Current Form (`sessions/new/page.tsx`)
- **Mock** handleSubmit (setTimeout + toast)
- No form state management
- Missing fields: endTime/duration, courtId (text input instead of select)
- Select for skillRequired exists but uncontrolled

## Key Findings
1. Auth is cookie-based (Better Auth) — axios `withCredentials: true` handles it
2. All libs for RHF+Zod already installed — zero npm installs needed
3. 373 courts available via `GET /api/courts` — need searchable court picker
4. No combobox component exists yet — need shadcn Combobox or filtered Select
5. Missing `gameType` field on form — optional but good to add
6. Form missing `endTime` — need duration field to calculate
