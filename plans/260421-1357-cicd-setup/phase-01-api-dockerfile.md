# Phase 1 — API Dockerfile & Docker Ignore

## Context

- [plan.md](./plan.md)
- API: NestJS 11, Prisma 7, Node 22
- Railway deploys from Dockerfile
- Need multi-stage build for small image size

## Overview

- **Priority:** High — blocker for Railway deploy
- **Status:** ⬜ Todo
- **Effort:** 30 min

## Key Insights

- Multi-stage build: `deps` → `build` → `production` keeps image ~200MB vs ~1GB
- Prisma needs `prisma generate` during build to create client
- PostGIS not needed in Dockerfile (it's a DB extension, not app dependency)
- `node:22-alpine` for smallest base image
- Railway injects env vars at runtime — no `.env` baked into image

## Related Code Files

- `shuttleup-api/package.json` — scripts, dependencies
- `shuttleup-api/prisma/schema.prisma` — Prisma schema (needs generate)
- `shuttleup-api/tsconfig.json` — TypeScript config
- `shuttleup-api/nest-cli.json` — NestJS build config

## Implementation Steps

### 1. Create `shuttleup-api/.dockerignore`

```
node_modules
dist
coverage
.env
.env.*
*.md
.git
.github
.vscode
```

### 2. Create `shuttleup-api/Dockerfile`

Multi-stage build:

```dockerfile
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**Key points:**
- Stage 1: prod deps only (smaller `node_modules`)
- Stage 2: all deps + build TypeScript + generate Prisma client
- Stage 3: copy only prod deps + built output + Prisma client

### 3. Verify build locally

```bash
cd shuttleup-api
docker build -t shuttleup-api .
docker run --rm -p 3000:3000 shuttleup-api
```

## Todo List

- [ ] Create `.dockerignore`
- [ ] Create `Dockerfile` (multi-stage)
- [ ] Test docker build locally
- [ ] Verify image size < 300MB

## Success Criteria

- `docker build` completes without errors
- Container starts and responds on port 3000
- Image size < 300MB

## Risk

| Risk | Mitigation |
|---|---|
| Prisma client not found at runtime | Copy `.prisma` from build stage |
| Native deps fail on Alpine | Use `node:22-alpine` (Prisma supports it) |
