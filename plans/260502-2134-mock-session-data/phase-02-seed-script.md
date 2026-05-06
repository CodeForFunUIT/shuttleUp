# Phase 2: Develop Seed Script

## Overview
Create the main execution script using Prisma Client and Faker to populate the PostgreSQL DB with relational mock data.

## Related Code Files
- `shuttleup-api/scripts/seed-mock.ts` (new)

## Implementation Steps
- [ ] Create `scripts/seed-mock.ts`.
- [ ] Setup `faker.vi` for Vietnamese localization.
- [ ] Instantiate `PrismaClient`.
- [ ] **Data Generation Flow:**
    1. Query existing `Court` count. Abort or warn if 0 courts exist.
    2. Query existing `User` count. If `< 50`, use `faker` to generate and insert `50` new mock users (with randomized `eloScore`, `skillLevel`).
    3. Retrieve all `User` ids and `Court` ids to memory arrays.
    4. Generate ~1000 `CourtSession` mock records.
        - Loop 1000 times.
        - Pick random `hostId` and random `courtId`.
        - Pick a `startTime` between now and 30 days into the future.
        - Set `endTime` = `startTime` + (1 to 3 hours).
        - Set `pricePerSlot` between 50,000 and 150,000.
        - Set `totalSlots` (e.g. 4, 6, 8) and randomized `availableSlots`.
        - Set `status`: if `availableSlots == 0` -> "FULL", else "OPEN".
    5. Batch insert sessions via `prisma.courtSession.createMany()`.
    6. Optional: To ensure absolute UI perfection, loop over newly created sessions where `availableSlots < totalSlots`, and generate dummy `Booking` records to account for the occupied slots.

## Success Criteria
- Script executes sequentially matching parent/child referential integrity constraints.
- Script outputs clear logging on the progress of generation.
