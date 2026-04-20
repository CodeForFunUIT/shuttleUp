# 📑 Case Study: Architecting ShuttleUp

## The Problem
Badminton is extremely popular and highly accessible, yet organizing casual "drop-in" sessions remains highly disconnected. Currently, community organization relies on cluttered social media groups structure. Hosts struggle with tracking payments and preventing no-shows, while solo players struggle to find matches compatible with their genuine skill level.

## The Objective
To create a unified platform empowering **Hosts** to create courts effortlessly, while dramatically lowering the barrier to entry for **Guests** to discover and book slots securely.

## Engineering Challenges & Solutions

### 1. Zero-Friction Guest Booking
*Challenge:* Traditional apps demand sign-ups before allowing a user to do anything, leading to a massive drop-off rate for an action as simple as joining a 2-hour badminton session.
*Solution:* Implemented an **Anonymous Booking model**. Guests only provide their Name and Phone number. We use session-cookies combined with Redis rate-limiting to temporarily map their localized identity to their booked slots without registration friction.

### 2. PostGIS Geo-Filtering for Discovery
*Challenge:* Badminton players generally only care about courts within 5-10km of their current location. Doing haversine distance calculations entirely in-app or via basic math fetches is extremely inefficient at scale.
*Solution:* Leveraged PostgreSQL with **PostGIS**. Implemented geospatial indexing and handled radius queries (`ST_DWithin` functions) via Prisma `$queryRaw` to bring real-time geographical search latencies down to <50ms.

### 3. Monorepo State Synchronization (Web ↔ Mobile)
*Challenge:* Maintaining unified design principles, dual UI/UX paradigms, and seamless API contracts between a Next.js 15 frontend and a separate Flutter Native Application.
*Solution:* Created an absolute single-source-of-truth API design with NestJS acting as the authoritative engine. Migrated matching UI tokens (Emerald scale) to Flutter's `app_theme.dart` and implemented rigorous **BLoC + GetIt** dependency injection logic to enforce separation of presentation components from Data/Domain repositories.

## The Results
The ShuttleUp MVP successfully demonstrates a complete, highly-scalable, end-to-end booking lifecycle deployed across Web, Backend servers, and Mobile. From bootstrap to launch, it emphasizes clean separation of concerns, test-driven methodologies, and modern, accessible UX.
