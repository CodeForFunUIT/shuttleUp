# ShuttleUp — Agent Instructions

## Context

ShuttleUp is a badminton partner-finding platform (portfolio project). Three sub-projects:
- **shuttleup-api** — NestJS 11 modular monolith
- **shuttleup-web** — Next.js 16 + React 19 + Tailwind v4 + shadcn/ui
- **shuttleup-mobile** — Flutter 3.10 + Bloc + GetIt + Dio

## Documentation

Always read relevant docs before implementing:
- `./docs/code-standards.md` — Architecture patterns and conventions
- `./docs/system-architecture.md` — Module dependencies and data flow
- `./docs/project-roadmap.md` — Current phase and milestones
- `./docs/design-guidelines.md` — UI/UX standards
- `./docs/deployment-guide.md` — Dev environment setup

## Key Technical Decisions

| Area | Decision |
|------|----------|
| Auth | Better Auth (email + OAuth + anonymous) |
| Database | PostgreSQL 16 + PostGIS via Prisma 7 |
| State (Web) | React Server Components + client state as needed |
| State (Mobile) | Bloc pattern with GetIt DI |
| Styling | Tailwind v4 + shadcn/ui (base-nova) |
| Queue | Bull Queue via Redis for async notifications |
| Geo-search | PostGIS with GiST indexes |

## Commands

```bash
# API
cd shuttleup-api && npm run start:dev    # Dev server (port 3000)
cd shuttleup-api && npm run lint         # Lint
cd shuttleup-api && npm test             # Tests

# Web
cd shuttleup-web && npm run dev          # Dev server (port 3001)
cd shuttleup-web && npm run lint         # Lint
cd shuttleup-web && npm run build        # Build check

# Mobile
cd shuttleup-mobile && flutter run       # Run app
cd shuttleup-mobile && flutter analyze   # Lint
cd shuttleup-mobile && flutter test      # Tests

# Infra
docker compose up -d                     # Start PostgreSQL + Redis
docker compose down                      # Stop containers
```

## Git Convention

```
<type>(<scope>): <description>
Types: feat, fix, docs, refactor, test, chore, style, perf, ci, build
Scopes: api, web, mobile, infra, docs
```
