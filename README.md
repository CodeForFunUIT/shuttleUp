# 🏸 ShuttleUp: The Ultimate Badminton Session Platform

Welcome to **ShuttleUp**, a full-stack, cross-platform solution designed to connect badminton enthusiasts. Whether you are a solo player looking for a competitive match, or a court host organizing a weekly session, ShuttleUp bridges the gap with seamless booking, ELO skill tracking, and real-time push notifications.

![ShuttleUp Concept](https://via.placeholder.com/1000x400/047857/FFFFFF?text=ShuttleUp+-+More+smashes,+less+searching)

> "More smashes, less searching."

## 🌟 Key Features

- **For Guests (Players):**
  - **Quick Book:** No login required. Just drop your Name & Phone.
  - **Match by Skill:** Sessions indicate required ELO ratings ensuring fair and fun matches.
  - **Geo-Search:** Find local courts instantly.

- **For Hosts:**
  - **Dashboard:** Track revenues, manage session schedules, and view guest rosters.
  - **Recurring Sessions:** Set up weekly schedules powered by `RRULE`.
  - **Push Notifications:** Instant FCM notifications when a guest drops in.

## 🏗️ Architecture & Tech Stack

ShuttleUp is built as a cohesive **monorepo** dividing domains into optimized components:

### 1. `shuttleup-web` (Frontend - Next.js 15)
- **Framework:** Next.js 15 (App Router).
- **Styling:** Tailwind CSS v4 + `shadcn/ui`.
- **Auth:** Better Auth integration for robust host authentication.
- **Resilience:** PWA capable, Light/Dark Modes, fully responsive.

### 2. `shuttleup-api` (Backend - NestJS)
- **Framework:** NestJS (TypeScript).
- **Database:** Supabase PostgreSQL with PostGIS extensions.
- **ORM:** Prisma.
- **Queues:** BullMQ & Redis for async performance.
- **Testing:** Hand-crafted Unit Tests mapped with Jest & Supertest.

### 3. `shuttleup-mobile` (Mobile - Flutter)
- **Framework:** Flutter SDK.
- **State Management:** BLoC + GetIt for robust Dependency Injection.
- **Networking:** Dio + Interceptors.
- **Theming:** Material 3 synchronized flawlessly with the Web's Emerald palette.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+) & npm
- Flutter SDK (v3.24+)
- Docker (for PostgreSQL & Redis instances)

### Bootstrapping
1. **Database:** `docker-compose up -d`
2. **Setup API:** 
   ```bash
   cd shuttleup-api
   npx prisma db push
   npm run start:dev
   ```
3. **Web Frontend:**
   ```bash
   cd shuttleup-web
   npm run dev
   ```
4. **Mobile App:**
   ```bash
   cd shuttleup-mobile
   flutter run
   ```

## 🧪 Testing
Each ecosystem runs its own testing framework:
- Web: `npm run test` (Vitest for unit) / `npm run test:e2e` (Playwright)
- Backend: `npm run test` (Jest)
- Mobile: `flutter test`

## 🛡️ License
MIT License.
