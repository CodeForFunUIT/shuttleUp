# Phase 3: Test and Verification

## Overview
Execute the script and ensure the frontend UI and database remain intact and performant.

## Implementation Steps
- [ ] Run `npm run seed:mock` in `shuttleup-api`.
- [ ] Verify `CourtSession` table row count increases by ~1,000.
- [ ] Spin up the `shuttleup-web` dev server and open the `/sessions` feed.
- [ ] Validate that the frontend renders gracefully without UI locking or breaking when parsing 1000 items (or verifying pagination limits if set).
- [ ] Validate date rendering, localized currency, and map pins correctly load for these random sessions.

## Success Criteria
- Over 1,000 realistic sessions exist in the DB.
- Application handles the load properly.
- All foreign keys correctly point to real Users and Courts.
