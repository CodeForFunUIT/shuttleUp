---
title: Crawl Badminton Courts from Google Maps
description: Seed the courts table with real badminton courts in HCM City via Google Maps Places API
status: in-progress
priority: high
effort: 2-3h
branch: feature/seed-courts-data
tags: [data, seed, google-maps, courts]
created: 2026-05-02
---

# Crawl Badminton Courts — Implementation Plan

## Phase 1: Build Crawl Script
- [x] Create `scripts/crawl-courts.js` — standalone Node.js script
- [x] Use Google Maps Places API (New) Text Search
- [x] Search per HCM district: `"sân cầu lông Quận X"`
- [x] Paginate with `pageToken`
- [x] Deduplicate by `place_id`
- [x] Output `courts-data.json`

## Phase 2: Seed Database
- [ ] Create `prisma/seed-courts.js` to read JSON and insert into Postgres
- [ ] Handle duplicates (upsert by name+address or lat/lng proximity)

## Dependencies
- Google Maps API key (user confirmed ✅)
- Docker Postgres running (confirmed ✅)
- Node.js v22.11 (sufficient for script — no Prisma CLI needed)
