# Brainstorm: Crawl Badminton Courts in HCM City

## Problem Statement
ShuttleUp needs a fully populated `courts` table so hosts can select a real court when creating a session, and players can find the nearest court by location. The goal is to crawl/seed all badminton courts in Ho Chi Minh City into the database.

**Target Schema (Court table):**
| Field | Type | Notes |
|---|---|---|
| name | string | Court name |
| address | string | Full address |
| district | string | District (Quận/Huyện) |
| city | string | "Ho Chi Minh City" |
| lat | float | Latitude |
| lng | float | Longitude |
| geometry | PostGIS | For spatial queries (optional at seed time) |

---

## Evaluated Approaches

### Approach A: Google Maps Places API (Text Search)
Use the official API: `POST /v1/places:searchText` with query `"sân cầu lông"` (Vietnamese for badminton court), paginating through HCM districts.

- **Pros:**
  - Richest data source — most courts are listed on Google Maps
  - Structured response: name, address, lat/lng, rating, photos
  - Legal & TOS-compliant
  - Free tier: ~5,000-10,000 requests/month (more than enough for a one-time seed)
- **Cons:**
  - Requires a Google Cloud account + API key + billing enabled
  - Max 20 results per page (need `nextPageToken` pagination)
  - District extraction requires parsing the `formattedAddress` string
  - Data is Google's property — can't redistribute commercially without license
- **Effort:** ~2-3 hours
- **Cost:** **FREE** for this use case (one-time seed of ~200-500 courts fits well within free tier)

### Approach B: Web Scraping Google Maps (Playwright/Puppeteer)
Automate a headless browser to search "sân cầu lông" on maps.google.com and scrape results.

- **Pros:**
  - No API key needed
  - Can extract extra data (photos, reviews)
- **Cons:**
  - **Violates Google's TOS** — risk of IP bans
  - Fragile — Google frequently changes their DOM structure
  - Slow & complex to maintain
  - Anti-bot detection (CAPTCHAs, rate limiting)
  - Harder to get lat/lng reliably
- **Effort:** ~6-10 hours
- **Cost:** Free but high maintenance cost

### Approach C: OpenStreetMap (Overpass API)
Query OSM via Overpass API for `leisure=pitch` + `sport=badminton` in Vietnam.

- **Pros:**
  - Completely free, open data, no API key
  - Legal to use and redistribute
  - Structured lat/lng data
- **Cons:**
  - **Very sparse data in Vietnam** — OSM coverage for badminton courts in HCM is extremely poor (likely <20 results vs 200+ on Google Maps)
  - Missing addresses, district info, and names for most entries
  - Not viable as a primary data source
- **Effort:** ~1 hour
- **Cost:** Free

### Approach D: Manual Curation + CSV Seed
Manually research and compile a CSV/JSON of courts, then write a seed script.

- **Pros:**
  - 100% accurate, curated data
  - Full control over district mapping
  - No API costs or TOS concerns
- **Cons:**
  - Extremely time-consuming (200+ courts × manual research)
  - Hard to keep updated
- **Effort:** ~10-20 hours of manual work
- **Cost:** Free but expensive in time

---

## Final Recommended Solution

**Recommendation: Approach A — Google Maps Places API (Text Search)**

*Rationale:*
1. **One-time seed operation** — we only need to run this once. The free tier (5,000-10,000 requests) is more than enough.
2. **Best data quality** — Google Maps has the most comprehensive listing of badminton courts in Vietnam.
3. **Structured data** — API returns name, address, lat/lng directly. No DOM parsing.
4. **Legal** — Using the official API is TOS-compliant.
5. **KISS** — A simple Node.js script that calls the API, transforms data, and inserts into Postgres via Prisma or raw SQL.

### Implementation Strategy
1. **Search by district** — HCM has ~22 districts. Search `"sân cầu lông Quận 1"`, `"sân cầu lông Quận 2"`, etc. to maximize coverage and naturally extract district info.
2. **Deduplicate** by `place_id` or by (lat, lng) proximity (<50m = same court).
3. **Parse district** from the formattedAddress or from the search query itself.
4. **Output** a JSON file, then seed into Postgres.

### Script Flow
```
1. Define list of 22 HCM districts
2. For each district:
   a. Call Text Search API: "sân cầu lông {district}"
   b. Paginate with nextPageToken until exhausted
   c. Extract: name, address, lat, lng
   d. Tag with district name
3. Deduplicate by place_id
4. Save to courts-data.json
5. Run Prisma seed script to insert into DB
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Need Google Cloud account | Low | Free to create, no charge for this volume |
| Some courts might be listed under different names | Medium | Search both "sân cầu lông" and "badminton" keywords |
| District parsing from address could be imprecise | Low | We're searching per-district, so we already know the district |
| Duplicate entries across district searches | Medium | Deduplicate by Google `place_id` |

## Success Metrics
- ≥150 unique badminton courts seeded into the `courts` table
- All entries have valid lat/lng coordinates
- All entries have correct district assignment
- Data can be queried by district in the app

## Next Steps & Questions

1. **Do you have a Google Cloud account with Maps API enabled?** If not, we'll need to set one up (free).
2. **Alternative if no GCP account:** I can write the script using a free alternative like SerpAPI's Google Maps scraper, or we can use the approach of searching on Google Maps in the browser and manually exporting via a Chrome extension — but the official API is cleanest.
3. Ready to create an implementation plan (`/plan`) for the seed script?
