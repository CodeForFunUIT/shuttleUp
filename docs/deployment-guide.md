# ShuttleUp — Deployment Guide

> **Last Updated:** April 16, 2026 | **Status:** Local dev only

## Local Development

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 22.x | API + Web runtime |
| npm | 10.x | Package manager |
| Flutter | 3.10+ | Mobile app |
| Docker | Latest | PostgreSQL + Redis containers |
| Git | Latest | Version control |

### 1. Start Infrastructure

```bash
# From project root
docker compose up -d

# Verify containers
docker compose ps
# Expected: shuttleup_postgres (5432), shuttleup_redis (6379)
```

### 2. Start API Server

```bash
cd shuttleup-api
cp .env.example .env     # First time only - edit as needed
npm install
npm run start:dev        # Hot-reload on http://localhost:3000
```

### 3. Start Web Frontend

```bash
cd shuttleup-web
cp .env.example .env     # First time only
npm install
npm run dev              # Hot-reload on http://localhost:3001
```

### 4. Start Mobile App

```bash
cd shuttleup-mobile
flutter pub get
flutter run              # Select device/emulator
```

### Stopping Services

```bash
# Stop Docker containers
docker compose down

# Stop with data cleanup
docker compose down -v   # ⚠️ Deletes database volume
```

## Environment Variables

### API (.env)

```bash
# Database (matches docker-compose.yml)
DATABASE_URL="postgresql://shuttleup:shuttleup_dev@localhost:5432/shuttleup?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
BETTER_AUTH_SECRET=your_super_secret_string
BETTER_AUTH_URL=http://localhost:3000

# External services (add when needed)
RESEND_API_KEY=
FCM_SERVER_KEY=
```

### Web (.env)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## CI/CD — GitHub Actions

Three path-scoped workflows trigger on push/PR to `main`:

| Workflow | File | Scope | Steps |
|----------|------|-------|-------|
| API CI | `.github/workflows/api-ci.yml` | `shuttleup-api/**` | npm ci → lint → build |
| Web CI | `.github/workflows/web-ci.yml` | `shuttleup-web/**` | npm ci → lint → build |
| Mobile CI | `.github/workflows/mobile-ci.yml` | `shuttleup-mobile/**` | pub get → analyze → test |

## Production Deployment (Planned)

### API → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

**Required Railway services:**
- PostgreSQL (with PostGIS extension)
- Redis
- NestJS app (Node.js 22)

### Web → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from shuttleup-web/
cd shuttleup-web
vercel
```

**Vercel configuration:**
- Framework: Next.js (auto-detected)
- Root directory: `shuttleup-web`
- Environment variables: Set in Vercel dashboard

### Mobile → App Stores

**Android (Play Store):**
```bash
cd shuttleup-mobile
flutter build appbundle --release
# Upload .aab to Google Play Console
```

**iOS (App Store):**
```bash
cd shuttleup-mobile
flutter build ipa --release
# Upload via Xcode or Transporter
```

## Docker Reference

### docker-compose.yml Services

| Service | Image | Port | Credentials |
|---------|-------|------|-------------|
| PostgreSQL | `postgis/postgis:16-3.4` | 5432 | user: `shuttleup`, pass: `shuttleup_dev`, db: `shuttleup` |
| Redis | `redis:7-alpine` | 6379 | No auth (dev only) |

### Useful Docker Commands

```bash
# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Connect to PostgreSQL
docker exec -it shuttleup_postgres psql -U shuttleup

# Connect to Redis
docker exec -it shuttleup_redis redis-cli

# Reset database
docker compose down -v && docker compose up -d
```

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Port 5432 in use | Stop local PostgreSQL or change port in docker-compose.yml |
| Port 3000 in use | Change `PORT` env var in API |
| Prisma migration fails | Check `DATABASE_URL`, ensure PostgreSQL is running |
| Flutter build fails | Run `flutter doctor` to check SDK setup |
| npm ci fails | Delete `node_modules` + `package-lock.json`, re-install |
