# Brainstorm: Real API Integration for Create Session

## Problem Statement & Requirements
The frontend (`shuttleup-web`) currently has a mock `handleSubmit` function in the "Create Session" form. It needs to be integrated with the real NestJS API endpoint `POST /sessions` in `shuttleup-api`.

**Backend Requirements (`CreateSessionDto`):**
- `courtId`: string
- `title`: string
- `description`: string (optional)
- `startTime`: ISO Date String
- `endTime`: ISO Date String
- `totalSlots`: number (min 1)
- `pricePerSlot`: number (min 0)
- `skillRequired`: enum ('ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED') (optional)
- `gameType`: enum (optional)

**Current Frontend Form Constraints:**
- Uncontrolled inputs (no `useState` or `react-hook-form` yet)
- Only captures `Date` and `Time` (does not capture duration/`endTime`)
- Does not capture `courtId` properly (just a text input for court name)

## Evaluated Approaches

### Approach A: Native FormData (KISS Pattern)
Use the native `FormData` API to extract values directly from the form submission without changing the current component structure significantly.

*   **Pros:** 
    *   YAGNI principle: Very fast to implement with minimal code.
    *   No external libraries required.
    *   Keeps the component lightweight.
*   **Cons:** 
    *   Manual type casting and validation (e.g., converting strings to numbers).
    *   Harder to show inline field errors.
    *   Constructing `startTime` and `endTime` requires manual date-math before sending.

### Approach B: React Hook Form + Zod (Modern Stack)
Since `react-hook-form` and `zod` are already in `package.json`, we can wrap the form using these libraries.

*   **Pros:**
    *   Type safety from form input all the way to the API request.
    *   Excellent error handling and UX (inline validation messages).
    *   Matches the modern Next.js ecosystem stack you already have.
*   **Cons:**
    *   Requires refactoring the existing UI components to use `Controller` or register them properly.
    *   Slightly more boilerplate.

## Missing Data Considerations (Critical)
Regardless of the approach, the frontend form is currently missing two things required by the backend:
1.  **`endTime`:** The form only asks for a Start Time. We either need to add an "End Time" or "Duration" field, or auto-calculate `endTime` as `startTime + 2 hours` on the frontend before sending.
2.  **`courtId`:** The form asks for a "Court Name" string. If the backend strictly expects a `courtId` (UUID/CUID), we either need a dropdown of courts fetched from the API, or update the backend to accept a plain string name.

## Final Recommended Solution with Rationale

**Recommendation:** Go with **Approach B (React Hook Form + Zod)** + **React Query (Mutation)**.

*Rationale:* You already have `@tanstack/react-query`, `zod`, and `react-hook-form` installed. It's best to set up the pattern correctly now so that forms are robust and type-safe across the app. We should also add a "Duration" dropdown to calculate `endTime`, and either use a dummy `courtId` for now or add a proper select dropdown for it.

### Implementation Steps & Risks
1.  **Define Zod Schema:** Map the `CreateSessionDto` requirements to a Zod schema.
2.  **Update Form Fields:** Add a "Duration" select (1hr, 2hr) to calculate `endTime`.
3.  **Auth Token:** Ensure the `api.post('/sessions')` uses the Better Auth token. Currently, `api.ts` uses `withCredentials: true`, but if NestJS requires a Bearer token, we might need to inject it using `api.interceptors`.
4.  **Mutate & Redirect:** Use React Query's `useMutation` to handle loading states and API calls, then redirect.

## Success Metrics & Validation
- Form cannot be submitted with invalid data (e.g. negative slots).
- Correct ISO date strings are generated for both `startTime` and `endTime`.
- The session successfully persists in the database.
- Redirects to `/dashboard` upon success.

## Next Steps
Do you want me to proceed with creating an implementation plan (`/plan`) based on **React Hook Form + Zod**, and how would you like to handle the missing `endTime` (Duration field or hardcode 2 hours)?
