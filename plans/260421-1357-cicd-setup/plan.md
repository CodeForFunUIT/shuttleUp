---
title: CI/CD Pipeline Setup for ShuttleUp
description: Full CI/CD with GitHub Actions, Vercel (web), Railway (API), Docker
status: active
priority: high
effort: medium
branch: feat/cicd-pipeline
tags: [ci-cd, github-actions, docker, vercel, railway]
created: 2026-04-21
---

# CI/CD Pipeline — ShuttleUp

## Context

- [Brainstorm Report](../reports/brainstormer-260421-1353-cicd-strategy.md)
- Monorepo: `shuttleup-web` (Next.js 16) + `shuttleup-api` (NestJS 11)
- Current CI: basic lint+build only, no tests, no deploy
- Decision: **Vercel (web) + Railway (API)**

## Phases

| # | Phase | Status | Effort |
|---|---|---|---|
| 1 | [API Dockerfile & Docker Ignore](./phase-01-api-dockerfile.md) | ✅ Done | 30 min |
| 2 | [Enhanced GitHub Actions CI](./phase-02-github-actions-ci.md) | ✅ Done | 45 min |
| 3 | [Platform Setup (Vercel CLI + Railway)](./phase-03-platform-setup.md) | ⬜ Todo | 30 min |

## Key Dependencies

- GitHub repo: `CodeForFunUIT/shuttleUp`
- API needs: PostgreSQL (PostGIS) + Redis in CI services
- Web needs: Vercel account linked to GitHub
- API needs: Railway account linked to GitHub

## Files to Create/Modify

```
CREATE  shuttleup-api/Dockerfile
CREATE  shuttleup-api/.dockerignore
MODIFY  .github/workflows/api-ci.yml
MODIFY  .github/workflows/web-ci.yml
CREATE  shuttleup-web/.env.example  (if missing)
```

## Success Criteria

- [ ] `api-ci.yml` runs lint → test (with DB) → build on every PR
- [ ] `web-ci.yml` runs lint → typecheck → test → build on every PR
- [ ] API Dockerfile builds successfully
- [ ] CI blocks merge on failure

## Out of Scope (Phase 3 is docs only)

- Actual Vercel/Railway account creation (user does manually)
- Production environment variables configuration
- Custom domain setup
- SSL certificates
