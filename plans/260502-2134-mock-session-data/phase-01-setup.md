# Phase 1: Setup Dependencies

## Overview
Install `@faker-js/faker` to allow programmatic generation of realistic Vietnamese names, descriptions, dates, and localized string data for our database seed script.

## Implementation Steps
- [ ] In `shuttleup-api`, install `@faker-js/faker` as a development dependency.
- [ ] Add `"seed:mock": "ts-node scripts/seed-mock.ts"` into `package.json` scripts inside the `shuttleup-api` folder.

## Success Criteria
- Dependency successfully installed.
- Script command works correctly without module resolution errors (even if the script is initially empty).
