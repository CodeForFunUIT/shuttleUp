# Phase 0 — Project Setup & Infrastructure

## Priority: 🔴 Critical (blocks everything)

## Overview

Initialize all 3 project repos, set up local dev environment with Docker, configure Supabase, and establish CI/CD pipelines.

## Architecture

```
d:\portfolio\
├── shuttleUp/           ← Current: docs + plans (parent directory)
│   ├── plans/
│   ├── docs/
│   └── ShuttleUp_PRD.md
│
├── shuttleup-web/       ← New: Next.js 15 frontend
│   ├── src/app/
│   ├── src/components/
│   └── ...
│
├── shuttleup-api/       ← New: NestJS backend
│   ├── src/modules/
│   ├── prisma/
│   └── ...
│
└── shuttleup-mobile/    ← New: Flutter app
    ├── lib/
    └── ...
```

## Implementation Steps

### 1. Docker Compose for local dev
```yaml
# docker-compose.yml (in shuttleUp root)
services:
  postgres:
    image: postgis/postgis:16-3.4
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: shuttleup
      POSTGRES_USER: shuttleup
      POSTGRES_PASSWORD: shuttleup_dev
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

### 2. Scaffold Next.js 15 frontend
```bash
cd d:\portfolio
npx create-next-app@latest shuttleup-web --typescript --tailwind --eslint --app --src-dir --yes
cd shuttleup-web
pnpm add better-auth @better-auth/client
pnpm add -D @shadcn/ui
```

### 3. Scaffold NestJS backend
```bash
cd d:\portfolio
npx @nestjs/cli new shuttleup-api --package-manager pnpm
cd shuttleup-api
pnpm add @prisma/client better-auth bullmq ioredis
pnpm add -D prisma
```

### 4. Scaffold Flutter mobile
```bash
cd d:\portfolio
flutter create shuttleup_mobile --org com.shuttleup --platforms android,ios
cd shuttleup_mobile
flutter pub add flutter_bloc get_it dio injectable
```

### 5. Supabase setup
- Create Supabase project → get connection string
- Enable PostGIS extension
- Configure Storage bucket for avatars/court images
- Save credentials in `.env` files

### 6. GitHub Actions CI/CD
- `shuttleup-web`: lint → build → deploy to Vercel
- `shuttleup-api`: lint → test → build → deploy to Railway
- `shuttleup-mobile`: lint → build APK

### 7. Better Auth configuration
- Server: email/password for hosts + anonymous plugin for guests
- Client: authClient with session management
- Middleware: protect host-only routes

## Todo

- [ ] Create Docker Compose file
- [ ] Start PostgreSQL + Redis containers
- [ ] Create Supabase project
- [ ] Scaffold Next.js 15 project
- [ ] Scaffold NestJS project
- [ ] Scaffold Flutter project
- [ ] Setup Better Auth (server + client)
- [ ] Create `.env.example` files
- [ ] Setup GitHub Actions workflows
- [ ] Init git for each repo
- [ ] Create initial README for each repo

## Success Criteria

- All 3 projects scaffolded and running locally
- Docker containers running PostgreSQL + Redis
- Better Auth login working (host email)
- Guest anonymous session working
- CI/CD green on all repos
