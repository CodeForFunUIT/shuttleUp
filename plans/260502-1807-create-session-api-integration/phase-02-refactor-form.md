# Phase 2: Refactor Form with React Hook Form + API

## Overview
- **Priority:** High — core deliverable
- **Status:** ⬜ Not started
- **Depends on:** Phase 1

## Context Links
- [Current form](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-web/src/app/dashboard/sessions/new/page.tsx)
- [shadcn Select](file:///Users/macbook/Desktop/portfolio/shuttleUp/shuttleup-web/src/components/ui/select.tsx)

## Key Insights
- Current form: 107 lines, uncontrolled inputs, mock submit
- Need to wrap with `useForm` + `zodResolver`
- Court field: replace text Input with searchable Combobox/Select grouped by district
- Add "Duration" select (1h, 1.5h, 2h, 3h) — calculates `endTime` automatically
- Add "Game Type" select (singles, doubles, mixed)
- Auth cookie sent automatically via `withCredentials: true`

## Related Code Files

### Modify
| File | Changes |
|---|---|
| `src/app/dashboard/sessions/new/page.tsx` | Full refactor — RHF + Zod + mutations |

### Create
| File | Purpose |
|---|---|
| `src/components/court-select.tsx` | Searchable court picker component |

## Implementation Steps

### Step 1: Create Court Select Component
**File:** `shuttleup-web/src/components/court-select.tsx`

Searchable dropdown with:
- Text filter input at top
- Courts grouped by district
- Shows court name + address
- On select → sets `courtId` via RHF `setValue`
- Uses Popover + Command pattern (shadcn Combobox)

**If Combobox not installed:** Fall back to Select with `onValueChange` + filter state, or build lightweight with Popover + input + filtered list.

### Step 2: Refactor `page.tsx`

Replace the entire form with:

```
1. Import useForm, zodResolver, schema, hooks
2. const form = useForm({ resolver: zodResolver(createSessionFormSchema), defaultValues })
3. const { data: courts } = useCourts()
4. const createSession = useCreateSession()
5. const onSubmit = (values) => {
     const payload = toCreateSessionPayload(values)
     createSession.mutate(payload, {
       onSuccess: () => { toast.success(...); router.push("/dashboard") },
       onError: (err) => { toast.error(...) }
     })
   }
6. <form onSubmit={form.handleSubmit(onSubmit)}>
7. Each field wrapped with form.register() or Controller
8. Error messages from form.formState.errors
```

### Step 3: Form Fields Layout

```
┌─────────────────────────────────────┐
│ Session Title          [text input] │
│ Description (optional) [textarea]   │
├─────────────┬───────────────────────┤
│ Date [date] │ Start Time [time]     │
├─────────────┼───────────────────────┤
│ Duration    │ Game Type             │
│ [1h/1.5h/  │ [Singles/Doubles/     │
│  2h/3h]    │  Mixed]               │
├─────────────┴───────────────────────┤
│ Court    [searchable select ▼]      │
│          shows name + district      │
├─────────────┬───────────────────────┤
│ Total Slots │ Price/Slot (VND)      │
│ [number]    │ [number]              │
├─────────────┴───────────────────────┤
│ Skill Level [All/Beginner/Inter/Adv]│
├─────────────────────────────────────┤
│              [Cancel] [Create ▶]    │
└─────────────────────────────────────┘
```

### Step 4: Wire Error Display
- Each field shows red error text below when invalid
- Submit button shows spinner during mutation
- On error → toast with API error message

## Todo
- [ ] Create `src/components/court-select.tsx` with search/filter
- [ ] Refactor `page.tsx` — useForm + zodResolver + field wiring
- [ ] Add Duration select field (new)
- [ ] Add Game Type select field (new)
- [ ] Add Description textarea field (new)
- [ ] Wire handleSubmit → useCreateSession mutation
- [ ] Display inline validation errors
- [ ] Loading state on submit button

## Success Criteria
- Form validates before submission (no invalid API calls)
- Court selected by name → `courtId` sent to API
- `endTime` auto-calculated from date + time + duration
- Session persists in DB (visible via GET /api/sessions)
- Redirects to /dashboard on success
- Toast on success and error
