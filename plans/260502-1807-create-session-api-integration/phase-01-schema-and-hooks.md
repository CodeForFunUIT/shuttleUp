# Phase 1: Zod Schema + Court Picker Hook

## Overview
- **Priority:** High — foundation for the form
- **Status:** ⬜ Not started

## Context Links
- [CreateSessionDto](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-api/src/sessions/dto/session.dto.ts)
- [Existing hooks](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-web/src/lib/hooks/use-sessions.ts)
- [Types](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-web/src/lib/types.ts)
- [Enums](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-api/src/common/constants/enums.ts)

## Key Insights
- Zod schema maps 1:1 to `CreateSessionDto` but form uses `date`, `time`, `duration` instead of `startTime`/`endTime`
- Schema needs a `formSchema` (what user inputs) and a `transform` to produce the API payload
- Court list is 373 items — fetched once, cached by React Query

## Related Code Files

### Create
| File | Purpose |
|---|---|
| `src/lib/schemas/create-session-schema.ts` | Zod form schema + API payload transform |
| `src/lib/hooks/use-courts.ts` | React Query hook for GET /api/courts |
| `src/lib/hooks/use-create-session.ts` | useMutation hook for POST /api/sessions |

## Implementation Steps

### Step 1: Create Zod Form Schema
**File:** `shuttleup-web/src/lib/schemas/create-session-schema.ts`

```typescript
import { z } from "zod";

export const createSessionFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  courtId: z.string().min(1, "Please select a court"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.coerce.number().min(30, "Min 30 minutes").max(480, "Max 8 hours"),
  totalSlots: z.coerce.number().int().min(1, "At least 1 slot").max(50),
  pricePerSlot: z.coerce.number().int().min(0, "Price cannot be negative"),
  skillRequired: z.enum(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("ALL"),
  gameType: z.enum(["singles", "doubles", "mixed"]).default("singles"),
  description: z.string().optional(),
});

export type CreateSessionFormValues = z.infer<typeof createSessionFormSchema>;

// Transform form values → API payload
export function toCreateSessionPayload(values: CreateSessionFormValues) {
  const startTime = new Date(`${values.date}T${values.time}`);
  const endTime = new Date(startTime.getTime() + values.duration * 60000);
  return {
    courtId: values.courtId,
    title: values.title,
    description: values.description,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    totalSlots: values.totalSlots,
    pricePerSlot: values.pricePerSlot,
    skillRequired: values.skillRequired,
    gameType: values.gameType,
  };
}
```

### Step 2: Create `useCourts` hook
**File:** `shuttleup-web/src/lib/hooks/use-courts.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Court } from "@/lib/types";

export function useCourts() {
  return useQuery<Court[]>({
    queryKey: ["courts"],
    queryFn: async () => {
      const res: any = await api.get("/api/courts");
      return (res?.data ?? res) as Court[];
    },
    staleTime: 5 * 60 * 1000, // 5 min — courts rarely change
  });
}
```

### Step 3: Create `useCreateSession` mutation hook
**File:** `shuttleup-web/src/lib/hooks/use-create-session.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface CreateSessionPayload {
  courtId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  totalSlots: number;
  pricePerSlot: number;
  skillRequired?: string;
  gameType?: string;
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionPayload) => api.post("/api/sessions", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
}
```

## Todo
- [ ] Create `src/lib/schemas/create-session-schema.ts`
- [ ] Create `src/lib/hooks/use-courts.ts`
- [ ] Create `src/lib/hooks/use-create-session.ts`
- [ ] Verify Zod v4 + @hookform/resolvers compatibility

## Success Criteria
- Schema validates all fields correctly
- `useCourts()` returns 373 courts from API
- `useCreateSession()` posts to `/api/sessions` and invalidates cache
