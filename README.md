# ShuttleUp 🏸

> **Tìm bạn chơi cầu lông — nhanh, đúng trình, gần nhà**

ShuttleUp là nền tảng kết nối người chơi cầu lông tại Việt Nam. Host đăng buổi chơi, vãng lai tìm & đặt chỗ — tất cả trên một nền tảng duy nhất.

## Problem Statement

Cộng đồng cầu lông Việt Nam hiện tổ chức qua **Facebook Groups phân mảnh** theo quận/huyện, gây ra:

- **Host** mất thời gian đăng bài nhiều group, khó quản lý slot, dễ overbooking
- **Vãng lai** phải theo dõi nhiều group, thông tin không chuẩn hóa, không có cơ chế đặt chỗ chính thức

ShuttleUp giải quyết bằng nền tảng tập trung với tìm kiếm thông minh, quản lý slot, và thanh toán đặt cọc.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Web** | Next.js 16 + React 19 + Tailwind v4 + shadcn/ui | SSR, SEO, responsive UI |
| **API** | NestJS 11 + Prisma 7 + PostgreSQL (PostGIS) | Modular monolith backend |
| **Mobile** | Flutter 3.10 + Bloc + GetIt + Dio | Cross-platform iOS/Android |
| **Auth** | Better Auth | Email + OAuth + anonymous guests |
| **Infra** | Docker Compose (dev) + GitHub Actions CI | PostgreSQL + Redis containers |
| **Payments** | VNPay / MoMo (planned) | Deposit & refund flow |

## Project Structure

```
shuttleUp/
├── shuttleup-api/          # NestJS backend (port 3000)
│   ├── src/                # Source code (modular monolith)
│   ├── test/               # E2E tests
│   └── .env.example        # Environment template
├── shuttleup-web/          # Next.js frontend (port 3001)
│   ├── src/app/            # App Router pages
│   ├── src/components/     # React components + shadcn/ui
│   └── src/lib/            # Utilities
├── shuttleup-mobile/       # Flutter mobile app
│   ├── lib/                # Dart source code
│   ├── android/            # Android platform
│   └── ios/                # iOS platform
├── .github/workflows/      # CI pipelines (API, Web, Mobile)
├── docker-compose.yml      # PostgreSQL 16 + PostGIS + Redis 7
├── ShuttleUp_PRD.md        # Product Requirements Document
├── plans/                  # Implementation plans
└── docs/                   # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js** 22.x
- **Flutter** 3.10+
- **Docker** (for PostgreSQL + Redis)

### 1. Infrastructure

```bash
# Start PostgreSQL (PostGIS) + Redis
docker compose up -d
```

### 2. Backend (NestJS)

```bash
cd shuttleup-api
cp .env.example .env
npm install
npm run start:dev        # http://localhost:3000
```

### 3. Web Frontend (Next.js)

```bash
cd shuttleup-web
cp .env.example .env
npm install
npm run dev              # http://localhost:3001
```

### 4. Mobile (Flutter)

```bash
cd shuttleup-mobile
flutter pub get
flutter run
```

## Architecture Overview

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Next.js 16  │  │ Flutter 3.10│  │   Admin      │
│     Web      │  │   Mobile    │  │  Dashboard   │
└──────┬───────┘  └──────┬──────┘  └──────┬───────┘
       │         HTTPS/WS         │
       └─────────────┼────────────┘
                     ▼
        ┌────────────────────────┐
        │  NestJS API Gateway    │
        │  Auth · Rate Limit     │
        └────────────┬───────────┘
                     ▼
        ┌────────────────────────┐
        │  Modular Monolith      │
        │  Auth · Session · Book │
        │  Search · Chat · Notif │
        └────────────┬───────────┘
                     ▼
   ┌─────────┐ ┌─────────┐ ┌────────────┐
   │PostgreSQL│ │  Redis  │ │ Cloudinary │
   │ PostGIS  │ │ Cache   │ │  Storage   │
   └──────────┘ └─────────┘ └────────────┘
```

## Development Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Project Setup & Infra | ✅ Complete |
| Phase 1 | Backend Core (Auth, Users, Sessions) | ⬜ Not Started |
| Phase 2 | Search & Booking | ⬜ Not Started |
| Phase 3 | Notifications | ⬜ Not Started |
| Phase 4 | Web Frontend | ⬜ Not Started |
| Phase 5 | Mobile App | ⬜ Not Started |
| Phase 6 | Testing & Launch | ⬜ Not Started |

## CI/CD

GitHub Actions pipelines run on push/PR to `main`:

- **API CI**: Lint → Build (Node 22.x)
- **Web CI**: Lint → Build (Node 22.x)
- **Mobile CI**: Analyze → Test (Flutter 3.22)

## License

Private — Portfolio project.
