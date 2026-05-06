# Brainstorm: Generating Realistic Mock Data for Sessions

## Problem Statement & Requirements
The application needs a large volume of mock `CourtSession` data (and related entities like `User`, `Court`, and `Booking`) to simulate a production-like environment. This is essential for load testing, UI testing (e.g., pagination, map performance, infinite scroll), and demonstrating the app's capabilities. 

**Data Requirements (`CourtSession`):**
- Must link to existing `Court` records (we currently have ~373 seeded courts).
- Must have a `host` (`User` entity). We need to generate realistic mock users if enough don't exist.
- Must have realistic dates (`startTime`, `endTime`) distributed over the past week and the upcoming month.
- Needs varying states: `status` (OPEN, FULL, COMPLETED, CANCELLED).
- Needs varying configurations: `skillRequired`, `gameType`, `pricePerSlot`, `totalSlots`, and `availableSlots`.
- Ideally, some sessions should have mock `Booking` records to reflect real-world occupancy.

## Evaluated Approaches

### Approach A: Prisma Seed Script with Faker.js (Standard DX)
Create a dedicated `seed-sessions.ts` script in the backend that uses Prisma Client and `@faker-js/faker` to programmatically generate and insert records into the database.

*   **Pros:** 
    *   Highly customizable and relational (can easily attach random existing courts to new sessions).
    *   Reproducible. Any developer can run `npm run seed:sessions` to populate their local DB.
    *   Type-safe through Prisma.
*   **Cons:** 
    *   Can be slow if inserting 10,000+ records sequentially (requires using `createMany` or chunking for efficiency).

### Approach B: Admin API Seeding Endpoint
Create a secure backend endpoint (e.g., `POST /api/admin/seed?count=1000`) inside the NestJS app that triggers a service to generate mock data on demand.

*   **Pros:**
    *   Can trigger data generation via Postman or the frontend without touching the terminal.
    *   Easier to seed a staging database without needing SSH access to run scripts.
*   **Cons:**
    *   Leaves testing code in the production codebase (must be strictly guarded by admin roles/environment variables).
    *   Large generations might hit HTTP timeout limits.

### Approach C: External Data Generation (Mockaroo / CSV Import)
Use a tool like Mockaroo to design the schema, export a 10,000-row CSV or SQL file, and import it directly into PostgreSQL.

*   **Pros:**
    *   Instantaneous. Visual UI to define data rules.
    *   No application code needed.
*   **Cons:**
    *   Very hard to maintain relational integrity (e.g., matching the `hostId` to a valid `User` CUID, or `courtId` to the 373 existing courts).
    *   Manual process; hard to version control.

## Final Recommended Solution with Rationale

**Recommendation:** Go with **Approach A (Prisma Seed Script + Faker.js)**.

*Rationale:* Because the data is highly relational (`CourtSession` depends on `User` and `Court`, and `Booking` depends on `User` and `CourtSession`), programmatic generation using Prisma is the only way to ensure referential integrity without a headache. `@faker-js/faker` can generate highly realistic Vietnamese names, descriptions, and randomized dates. We can optimize it by using `prisma.courtSession.createMany()` in chunks of 1,000 to keep the seeding process under 10 seconds.

## Implementation Considerations & Risks
1.  **Dependency Tree:** A session needs a Host (`User`). The script must first query existing users, and if there aren't enough (e.g., < 50), it should generate a pool of fake users first.
2.  **Date Logic:** We need to ensure `endTime` is strictly greater than `startTime` (usually +1 to +3 hours).
3.  **Booking Integrity:** If `totalSlots` is 4, and `availableSlots` is 2, the script should optionally create 2 `Booking` records to match the math, ensuring the DB is in a valid state.
4.  **Performance:** Generating 10,000 records requires batching. Using `.createMany` avoids hitting connection pool limits or memory issues.

## Success Metrics & Validation Criteria
- The script executes successfully in under 30 seconds for 5,000 records.
- The `CourtSession` table populates with realistic, non-repeating data.
- The frontend Sessions feed accurately displays the new data without crashing.
- No foreign key constraint violations occur during seeding.

## Next Steps
Do you agree with using a Prisma seed script with Faker.js? If so, we can create an implementation plan to:
1. Install `@faker-js/faker` in `shuttleup-api`.
2. Write the generation logic for Users, Sessions, and Bookings.
3. Add a package.json script like `npm run seed:mock-data`. 

Should we go ahead and make a `@[/plan]` for this?
