---
title: CI/CD Strategy for ShuttleUp Platform
description: Brainstorm CI/CD pipeline for web (Next.js) + API (NestJS) monorepo
status: draft
priority: high
tags: [ci-cd, devops, github-actions, deployment]
created: 2026-04-21
---

# CI/CD Strategy — ShuttleUp Platform

## Problem Statement

ShuttleUp monorepo has 3 basic CI workflows (lint + build only). No tests in pipeline, no deployment, no Dockerfiles, no staging environment. Need full CI/CD covering web + API with automated deploy.

## Current State

| Aspect | Status |
|---|---|
| **Repo** | `CodeForFunUIT/shuttleUp` (GitHub, `main` branch) |
| **Web** | Next.js 16 — vitest + playwright configured but not in CI |
| **API** | NestJS 11 + Prisma 7 + BullMQ + Redis — jest configured but not in CI |
| **Infra** | docker-compose (Postgres PostGIS + Redis) — local dev only |
| **CI** | 3 basic workflows: `npm ci → lint → build` — no test, no deploy |
| **CD** | ❌ None |
| **Dockerfiles** | ❌ None |
| **Env strategy** | ❌ Single env (local) |

## Constraints

- Portfolio project → prefer **free tiers**
- Solo developer → simple maintenance
- Monorepo → path-filtered workflows
- API needs PostgreSQL (PostGIS) + Redis at runtime

---

## Evaluated Approaches

### Option A — Vercel (Web) + Railway (API) ⭐ RECOMMENDED

| Component | Platform | Free Tier | Notes |
|---|---|---|---|
| **Web** | Vercel | ✅ Generous | Next.js native, auto-deploy on push, preview deploys on PR |
| **API** | Railway | ✅ $5 credit/mo | Docker deploy, managed PostgreSQL + Redis addons |
| **DB** | Railway PostgreSQL | Included | PostGIS extension available |
| **Redis** | Railway Redis | Included | Same project, internal networking |
| **CI** | GitHub Actions | ✅ 2000 min/mo free | Lint + test + build gate before deploy |

**Pros:**
- Zero Docker knowledge needed for web (Vercel handles it)
- Railway auto-deploys from GitHub, Dockerfile-based for API
- Preview deploys on PRs (Vercel) — great for portfolio demos
- Internal networking = no public Redis/DB exposure
- Railway sleep on idle = saves free credits

**Cons:**
- Railway $5/mo credit may not cover heavy usage
- Two platforms to manage (Vercel + Railway)
- PostGIS on Railway requires custom Dockerfile init

### Option B — Fly.io (Both Web + API)

| Component | Platform |
|---|---|
| **Web** | Fly.io (Docker) |
| **API** | Fly.io (Docker) |
| **DB** | Fly.io Postgres |
| **Redis** | Upstash (serverless) |

**Pros:**
- Single platform, global edge deployment
- Free tier: 3 shared VMs, 3GB storage

**Cons:**
- Must write + maintain Dockerfiles for BOTH web and API
- Fly.io Postgres has no PostGIS by default (custom image needed)
- More DevOps overhead for a portfolio project
- No PR preview deploys without extra config

### Option C — Render (Both)

**Pros:** Simple GitHub integration, free tier, managed Postgres
**Cons:** Free tier sleeps after 15 min inactivity (30s cold start), no PostGIS addon, slow builds

### Option D — Full Docker Compose on VPS (DigitalOcean/Hetzner)

**Pros:** Full control, cheapest long-term ($4-6/mo), PostGIS native
**Cons:** Manual server management, SSL setup, monitoring, not suitable for portfolio showcase without significant DevOps investment

---

## Recommended Solution: Option A

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub (monorepo)                     │
│                                                         │
│  push to main ──┬──► Web CI ──► Vercel (auto-deploy)    │
│                 │                                       │
│                 └──► API CI ──► Railway (auto-deploy)    │
│                                                         │
│  PR created  ──┬──► Web CI ──► Vercel Preview URL       │
│                └──► API CI ──► (build gate only)         │
└─────────────────────────────────────────────────────────┘
```

### CI Pipeline Design

#### Web CI (`web-ci.yml`)
```
Trigger: push/PR to main, paths: shuttleup-web/**

Jobs:
1. lint      — eslint
2. typecheck — tsc --noEmit
3. test      — vitest run
4. build     — next build
5. deploy    — Vercel (main only, via Vercel GitHub integration)
```

#### API CI (`api-ci.yml`)
```
Trigger: push/PR to main, paths: shuttleup-api/**

Services: postgres:16, redis:7-alpine (GitHub Actions services)

Jobs:
1. lint       — eslint
2. typecheck  — tsc --noEmit (via nest build)
3. test       — jest (with real DB via services)
4. build      — nest build
5. deploy     — Railway (main only, via Railway GitHub integration)
```

### Environment Strategy

| Env | Web | API | Database |
|---|---|---|---|
| **Local** | `npm run dev` (3001) | `npm run start:dev` (3000) | docker-compose |
| **Preview** | Vercel Preview URL | — | — |
| **Production** | Vercel | Railway | Railway PostgreSQL |

### Secrets Required (GitHub)

```
# Web (handled by Vercel integration, no manual secrets needed)

# API (Railway)
DATABASE_URL          — Railway PostgreSQL connection string
REDIS_URL             — Railway Redis connection string
BETTER_AUTH_SECRET    — Auth secret
RESEND_API_KEY        — Email service
FIREBASE_*            — Push notifications
```

### Files to Create

```
shuttleup-api/
├── Dockerfile                 # Multi-stage Node.js build
├── .dockerignore              # Exclude node_modules, .git, etc.
└── .env.example               # (already exists)

shuttleup-web/
└── (no Dockerfile needed — Vercel handles)

.github/workflows/
├── api-ci.yml                 # Enhanced: lint → test → build (with DB service)
└── web-ci.yml                 # Enhanced: lint → typecheck → test → build
```

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Railway free tier exhausted | Medium | Monitor usage, sleep on idle, upgrade if needed ($5/mo) |
| PostGIS not available on Railway | Low | Use standard Postgres + manual geo queries, or custom Docker image |
| Vercel build timeout | Low | Next.js 16 builds are fast, standalone output |
| GitHub Actions minutes exhausted | Very Low | 2000 min/mo is plenty for solo dev |
| Secrets leak | Low | Use GitHub Secrets, never commit .env |

## Success Criteria

- [ ] Every push to `main` auto-deploys web + API
- [ ] PRs get Vercel preview URL
- [ ] CI blocks merge if lint/test/build fails
- [ ] API tests run against real PostgreSQL + Redis in CI
- [ ] Total deploy time < 5 minutes
- [ ] Zero manual intervention for standard deploys

## Next Steps

1. Create `Dockerfile` for `shuttleup-api`
2. Enhance `api-ci.yml` with PostgreSQL/Redis services + test step
3. Enhance `web-ci.yml` with typecheck + test steps
4. Connect repo to Vercel (web)
5. Connect repo to Railway (API + PostgreSQL + Redis)
6. Configure environment variables on both platforms
7. Test full pipeline end-to-end

---

> **Verdict:** Option A (Vercel + Railway) is the sweet spot for a portfolio project — minimal DevOps, generous free tiers, auto-deploy, preview URLs. Only 1 Dockerfile needed (API). Web is zero-config on Vercel.
