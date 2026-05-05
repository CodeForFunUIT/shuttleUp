# ShuttleUp — Codebase Summary

> **Last Updated:** April 16, 2026 | **Status:** Phase 0 (Scaffolding Complete)

## Repository Layout

```
shuttleUp/                          # Monorepo root
├── shuttleup-api/                  # NestJS 11 backend
├── shuttleup-web/                  # Next.js 16 frontend
├── shuttleup-mobile/               # Flutter 3.10 mobile app
├── .github/workflows/              # 3 CI pipelines
├── docker-compose.yml              # PostgreSQL 16 (PostGIS) + Redis 7
├── ShuttleUp_PRD.md                # Product Requirements Document (591 lines)
├── plans/                          # Implementation plans & research
└── docs/                           # Project documentation
```

## Sub-Project Details

### shuttleup-api (NestJS 11)

| Item | Detail |
|------|--------|
| Framework | NestJS 11.0.1 |
| Language | TypeScript 5.7 |
| ORM | Prisma 7.7 (dev dependency, schema not yet created) |
| Testing | Jest 30 + Supertest 7 |
| Linting | ESLint 9 + Prettier 3 |
| Node | 22.x |

**Source files:** 5 files, ~51 LOC total (boilerplate scaffold)

```
src/
├── main.ts                 # Bootstrap (port 3000)
├── app.module.ts           # Root module (empty)
├── app.controller.ts       # Health check endpoint
├── app.service.ts          # Hello world service
└── app.controller.spec.ts  # Unit test
```

**Key config:**
- `.env.example`: DATABASE_URL, REDIS_HOST/PORT, BETTER_AUTH_SECRET, RESEND_API_KEY, FCM_SERVER_KEY
- `nest-cli.json`: Standard compiler config
- `tsconfig.json`: ES2021 target, strict mode

### shuttleup-web (Next.js 16)

| Item | Detail |
|------|--------|
| Framework | Next.js 16.2.3 |
| React | 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui (base-nova style) |
| Auth | Better Auth (client) |
| Icons | Lucide React |
| Node | 22.x |

**Source files:** 5 files, ~277 LOC total (scaffold + 1 shadcn component)

```
src/
├── app/
│   ├── globals.css         # Tailwind config + CSS variables (125 LOC)
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Default Next.js landing page
│   └── favicon.ico
├── components/
│   └── ui/
│       └── button.tsx      # shadcn/ui button component
└── lib/
    └── utils.ts            # clsx + tailwind-merge utility
```

**Key config:**
- `components.json`: shadcn/ui config (base-nova style, RSC enabled)
- `.env.example`: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_URL
- `AGENTS.md`: Next.js agent rules warning

### shuttleup-mobile (Flutter 3.10)

| Item | Detail |
|------|--------|
| SDK | Dart 3.10.4 |
| State | flutter_bloc 9.1 |
| DI | get_it 9.2 + injectable 2.7 |
| HTTP | Dio 5.9 |

**Source files:** 1 file, ~111 LOC (default Flutter counter app)

```
lib/
└── main.dart               # Default counter app (not customized)
```

## Infrastructure

### Docker Compose

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| PostgreSQL | `postgis/postgis:16-3.4` | 5432 | Primary DB with spatial extensions |
| Redis | `redis:7-alpine` | 6379 | Cache + Bull Queue backend |

### CI/CD (GitHub Actions)

| Workflow | Trigger | Steps |
|----------|---------|-------|
| `api-ci.yml` | Push/PR to `main` (shuttleup-api/**) | Install → Lint → Build |
| `web-ci.yml` | Push/PR to `main` (shuttleup-web/**) | Install → Lint → Build |
| `mobile-ci.yml` | Push/PR to `main` (shuttleup-mobile/**) | Pub get → Analyze → Test |

All CI runs on `ubuntu-latest`. Path-scoped triggers prevent unnecessary builds.

## File Statistics

| Directory | File Types | Source LOC | State |
|-----------|-----------|------------|-------|
| shuttleup-api/src | 5 × .ts | ~51 | Scaffold |
| shuttleup-web/src | 3 × .tsx, 1 × .css, 1 × .ts | ~277 | Scaffold + 1 component |
| shuttleup-mobile/lib | 1 × .dart | ~111 | Default template |
| .github/workflows | 3 × .yml | ~87 | Complete |
| Root | docker-compose.yml, .gitignore | ~69 | Complete |

**Total custom source code:** ~595 LOC across 13 files

## Dependencies Summary

### Node.js (API + Web)

| Category | Key Packages |
|----------|-------------|
| Runtime (API) | @nestjs/common, @nestjs/core, rxjs |
| Runtime (Web) | next, react, react-dom, shadcn, better-auth, tailwind-merge |
| Dev | TypeScript, ESLint, Jest, Prettier, Prisma CLI |

### Flutter (Mobile)

| Category | Key Packages |
|----------|-------------|
| State | flutter_bloc |
| DI | get_it, injectable |
| HTTP | dio |
| Dev | flutter_test, flutter_lints |

## What's Not Yet Implemented

- [ ] Prisma schema & migrations
- [ ] Auth module (Better Auth integration)
- [ ] User, Court, Session, Booking modules
- [ ] API route handlers beyond health check
- [ ] Web pages (search, session detail, booking, profile)
- [ ] Mobile screens and navigation
- [ ] Payment integration
- [ ] Notification system (Bull Queue + FCM)
- [ ] WebSocket/chat module
- [ ] Rating/ELO system
