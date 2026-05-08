---
title: "Migrate to go_router_builder (Type-Safe Routes)"
description: Replace manual GoRoute/state.extra casts in shuttleup-mobile with generated GoRouteData classes via go_router_builder
status: planned
priority: medium
effort: small (~30min impl)
branch: feat/go-router-builder
tags: [flutter, routing, go_router, codegen, mobile]
created: 2026-05-08
---

# Plan: go_router_builder Migration

## Problem
`lib/app/routes.dart` uses unsafe `state.extra as SessionModel` runtime casts — crash risk, no IDE support.

## Solution
Adopt `go_router_builder` to generate type-safe route classes from `GoRouteData` annotations.

## Phases

| # | Phase | Status | File |
|---|-------|--------|------|
| 1 | Dependency & codegen setup | ⬜ todo | [phase-01-dependency-setup.md](./phase-01-dependency-setup.md) |
| 2 | Rewrite routes.dart with GoRouteData | ⬜ todo | [phase-02-routes-rewrite.md](./phase-02-routes-rewrite.md) |
| 3 | Update navigation call sites | ⬜ todo | [phase-03-update-callsites.md](./phase-03-update-callsites.md) |
| 4 | Verify & update docs | ⬜ todo | [phase-04-verify-docs.md](./phase-04-verify-docs.md) |

## Key Dependencies
- `go_router: ^17.2.1` (already installed)
- `build_runner: ^2.13.1` (already installed)
- `go_router_builder: ^2.7.1` (to add)

## Callsites to Update (6 nav calls across 4 files)
- `session_card.dart:21` — `context.push('/sessions/$id', extra: session)`
- `session_detail_page.dart:98` — `context.push('/sessions/$id/book', extra: session)`
- `dashboard_page.dart:15` — `context.push('/profile')`
- `dashboard_page.dart:19` — `context.go('/')`
- `guest_booking_page.dart:47` — `context.go('/')`
- `auth_page.dart:23` — `context.go('/dashboard')`

## Success Criteria
- [ ] `flutter analyze` — zero errors
- [ ] All 6 routes use generated type-safe classes
- [ ] No `state.extra as X` casts remain
- [ ] Navigation uses `XxxRoute(...).push/go(context)` everywhere
