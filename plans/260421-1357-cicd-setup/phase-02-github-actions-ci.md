# Phase 2 — Enhanced GitHub Actions CI

## Context

- [plan.md](./plan.md)
- Current CI: lint + build only
- Need: lint → typecheck → test → build (with services for API)

## Overview

- **Priority:** High — core pipeline quality gate
- **Status:** ⬜ Todo
- **Effort:** 45 min

## Key Insights

- GitHub Actions services: spin up PostgreSQL + Redis containers alongside job
- API tests need `DATABASE_URL` and `REDIS_URL` pointing to service containers
- Prisma needs `prisma generate` + `prisma db push` before tests (schema sync)
- Web tests (vitest) don't need external services
- Use `npm ci` with cache for faster installs
- `paths` filter already in place — keeps workflows scoped

## Related Code Files

- `.github/workflows/api-ci.yml` — current API CI (lint + build)
- `.github/workflows/web-ci.yml` — current Web CI (lint + build)
- `shuttleup-api/package.json` — `test`, `lint`, `build` scripts
- `shuttleup-web/package.json` — `test`, `lint`, `build` scripts

## Implementation Steps

### 1. Update `.github/workflows/api-ci.yml`

```yaml
name: API CI

on:
  push:
    branches: [main]
    paths: ['shuttleup-api/**']
  pull_request:
    branches: [main]
    paths: ['shuttleup-api/**']

jobs:
  ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./shuttleup-api

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: shuttleup_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd="pg_isready"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
        options: >-
          --health-cmd="redis-cli ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/shuttleup_test
      REDIS_HOST: localhost
      REDIS_PORT: 6379
      BETTER_AUTH_SECRET: ci-test-secret
      BETTER_AUTH_URL: http://localhost:3000

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'
          cache: 'npm'
          cache-dependency-path: shuttleup-api/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Push schema to test DB
        run: npx prisma db push --skip-generate

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

**Key decisions:**
- `postgres:16` (not PostGIS — tests don't need geo queries in CI)
- `prisma db push` syncs schema without migrations (simpler for CI)
- Cache `npm` for faster subsequent runs
- All env vars set at job level

### 2. Update `.github/workflows/web-ci.yml`

```yaml
name: Web CI

on:
  push:
    branches: [main]
    paths: ['shuttleup-web/**']
  pull_request:
    branches: [main]
    paths: ['shuttleup-web/**']

jobs:
  ci:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./shuttleup-web

    env:
      NEXT_PUBLIC_API_URL: http://localhost:3000

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22.x'
          cache: 'npm'
          cache-dependency-path: shuttleup-web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

**Key decisions:**
- No external services needed (vitest = unit tests)
- Added `tsc --noEmit` step for type safety
- Playwright (e2e) skipped in CI for now — add later when needed

## Todo List

- [ ] Update `api-ci.yml` with services + test step
- [ ] Update `web-ci.yml` with typecheck + test step
- [ ] Push and verify both workflows pass on GitHub
- [ ] Confirm PR checks block merge on failure

## Success Criteria

- Both workflows pass on a clean push
- Test step actually runs tests (not silently skipped)
- Failed lint/test/build blocks PR merge
- Workflow runs < 5 min total

## Risk

| Risk | Mitigation |
|---|---|
| Tests fail in CI but pass locally | Use same Node version, explicit env vars |
| Service container not ready | Health checks with retries |
| Prisma schema out of sync | `prisma db push` on every run |
