# Phase 2 — Search & Booking Flow

## Priority: 🟡 High

## Overview

Implement geo-based search using PostGIS, advanced filtering, and the complete booking flow with mock payment.

## Key Insights

- PostGIS `ST_DWithin` for "sessions near me" queries
- Filter by: district, time range, skill level, price range, shuttle type, play type
- Mock payment = simulated success/failure with delay, no real gateway
- Guest booking: collect name + phone → create booking → no payment for now

## Implementation Steps

1. Enable PostGIS extension on Supabase
2. Create geo indexes on `courts` table
3. Implement `/sessions/nearby` endpoint with PostGIS
4. Implement advanced filter query builder
5. Build mock payment service (simulate VNPay flow)
6. Implement booking cancellation logic
7. Add slot locking with Redis (prevent overbooking)

## Search API

```
GET /sessions?lat=10.78&lng=106.70&radius=5km
    &district=quan-2
    &date=2026-04-20
    &timeFrom=18:00&timeTo=21:00
    &skillMin=800&skillMax=1200
    &priceMax=80000
    &shuttleType=feather
    &playType=doubles
    &sortBy=distance|time|price
```

## Mock Payment Flow

```
1. User clicks "Book" → POST /bookings
2. If session has mock payment enabled:
   → POST /payments/initiate → returns mock redirect URL
   → Simulate 3s delay → webhook callback with success
3. Booking status → confirmed
4. No real money involved, UI shows "Demo Payment"
```

## Todo

- [ ] Enable PostGIS on Supabase
- [ ] Geo search endpoint
- [ ] Advanced filter query builder
- [ ] Mock payment service
- [ ] Booking cancellation + refund logic
- [ ] Redis atomic slot lock
- [ ] Search results pagination

## Success Criteria

- Search by location returns sorted results
- All filters work correctly
- Mock payment completes booking flow
- No overbooking possible under concurrent requests
