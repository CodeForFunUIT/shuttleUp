# Phase 3 — Platform Setup (Vercel CLI + Railway)

## Context

- [plan.md](./plan.md)
- Web → Vercel via `deploy-to-vercel` skill (CLI-based, no dashboard)
- API → Railway (Docker deploy from GitHub)

## Overview

- **Priority:** Medium — after CI pipeline works
- **Status:** ⬜ Todo
- **Effort:** 30 min

---

## Vercel Setup (Web) — via CLI Skill

Uses `deploy-to-vercel` skill. No dashboard needed.

### Pre-requisites

```bash
npm install -g vercel
vercel login
```

### Steps

```bash
# 1. Check current state
cd shuttleup-web
git remote get-url origin
vercel whoami
cat .vercel/project.json 2>/dev/null || cat .vercel/repo.json 2>/dev/null

# 2. Check teams
vercel teams list --format json

# 3. Link repo to Vercel (repo-based linking)
vercel link --repo --scope <team-slug>

# 4. Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-api.railway.app

# 5. Deploy via git push (Vercel auto-deploys)
git add .
git commit -m "deploy: initial vercel setup"
git push

# 6. Get preview URL
sleep 5
vercel ls --format json
```

### Post-deploy Verification

```bash
# Check deployment status
vercel inspect <deployment-url>
```

### Expected Result

- Production URL: `https://shuttleup-xxx.vercel.app`
- Every PR gets preview URL automatically
- Every push to `main` triggers production deploy

---

## Railway Setup (API)

### Steps

1. **Create account** at [railway.app](https://railway.app) (GitHub OAuth)
2. **Create new project** → "Deploy from GitHub Repo"
3. **Select repo:** `CodeForFunUIT/shuttleUp`
4. **Configure service:**
   - Root Directory = `shuttleup-api`
   - Railway auto-detects `Dockerfile`
   - Port = `3000`
5. **Add PostgreSQL:** Click "New" → "Database" → "PostgreSQL"
6. **Add Redis:** Click "New" → "Database" → "Redis"
7. **Environment variables (API service):**
   ```
   NODE_ENV              = production
   BETTER_AUTH_SECRET    = <generate-secure-random>
   BETTER_AUTH_URL       = https://your-api.railway.app
   RESEND_API_KEY        = <from-resend-dashboard>
   FIREBASE_PROJECT_ID   = <from-firebase-console>
   FIREBASE_PRIVATE_KEY  = <from-firebase-console>
   FIREBASE_CLIENT_EMAIL = <from-firebase-console>
   ```

### Database Migration

```bash
npm install -g @railway/cli
railway login
railway run npx prisma db push
```

---

## Post-Setup Checklist

- [ ] Vercel CLI installed + authenticated
- [ ] Repo linked to Vercel (`vercel link --repo`)
- [ ] Web deploys on push to `main`
- [ ] PRs get Vercel preview URLs
- [ ] Railway project created with Dockerfile
- [ ] PostgreSQL + Redis added on Railway
- [ ] All env vars configured
- [ ] `prisma db push` executed via Railway CLI
- [ ] CORS updated in `main.ts` with Vercel domain (see below)

### CORS Update Required

In `shuttleup-api/src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://shuttleup-xxx.vercel.app',  // Add production web URL
  ],
});
```

## Risk

| Risk | Mitigation |
|---|---|
| CORS blocks web → API | Add Vercel domain to CORS allowlist |
| Railway sleep on idle | Free tier sleeps after inactivity (~5s cold start) |
| Vercel CLI not authenticated | Run `vercel login` first |
