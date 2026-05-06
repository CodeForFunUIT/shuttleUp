# Brainstorm: Comprehensive Court Crawler for HCM City

## Problem Statement

Current seeded data = **83 courts**. Real HCM City likely has **300-500+** badminton courts. Need a scalable tool to crawl comprehensive data without Google Maps API key hassles.

## Requirements

- Crawl **all** badminton courts in HCM City (target: 300+)
- Extract: name, address, district, lat/lng coordinates
- **Free** — no paid API keys, no monthly fees
- One-time use (seed data, not continuous scraping)
- Deduplicate results
- Output: JSON compatible with existing `seed-courts.js`

## Approaches Evaluated

### ❌ A. Google Maps Places API (New)
**Already tried — FAILED due to API permission issues.**
- Requires enabling "Places API (New)" in Google Cloud Console
- User spent significant time and couldn't resolve 403 errors
- Costs: ~$17 per 1000 requests (free tier covers it but setup is painful)
- **Verdict: Eliminated — too much friction**

### ⭐ B. Playwright Browser Scraper (RECOMMENDED)
**Automate a real Chrome browser to scrape Google Maps directly.**

| Pros | Cons |
|---|---|
| **FREE** — no API key needed | Slower (~2-3 min per district) |
| Gets EXACT lat/lng from URLs | Google may block after heavy use |
| Most comprehensive data source | DOM selectors can break |
| Already have Playwright in project | Needs headless Chrome |
| Can extract 20+ results per search | ~45-60 min total run time |

**How it works:**
1. Open Google Maps in headless Chrome
2. Search "sân cầu lông" per district
3. Scroll results panel to load all
4. Extract name, address from cards
5. Parse lat/lng from URL (`@10.7769,106.7009,15z`)
6. Deduplicate by name+address
7. Save to JSON

**Expected yield: 300-500 courts**

### 🟡 C. gosom/google-maps-scraper (Docker CLI)
**Open-source Go tool, 3.8k⭐ on GitHub. Uses Playwright internally.**

| Pros | Cons |
|---|---|
| Battle-tested, 3.8k stars | Requires Docker |
| Outputs CSV/JSON directly | Go binary, not Node.js |
| Handles pagination, dedup | Overkill for one-time use |
| Built-in proxy support | Large Docker image (~1GB) |
| Concurrency controls | Learning curve |

**How it works:**
```bash
# Create query file
echo "sân cầu lông Quận 1 Hồ Chí Minh" > queries.txt
echo "sân cầu lông Quận 3 Hồ Chí Minh" >> queries.txt
# ... all 22 districts

# Run via Docker
docker run -v "$PWD/queries.txt:/queries.txt:ro" \
  -v "$PWD/output:/out" \
  gosom/google-maps-scraper \
  -input /queries.txt \
  -results /out/courts.csv \
  -depth 1 -lang vi
```

**Expected yield: 300-500 courts (same as B, but less work)**

### 🟡 D. Multi-Source Web Scraping
**Scrape Vietnamese sports directory websites programmatically.**

| Pros | Cons |
|---|---|
| No anti-bot risk | Incomplete data per source |
| Simpler DOM structure | Multiple parsers needed |
| Can run very fast | No lat/lng coordinates |
| Totally free | Different formats per site |

Sources: qvbadminton.com, shopvnb.com, hvshop.vn, babolat.com.vn, xbsports.vn, sieuthicaulong.vn

**Expected yield: 100-200 courts (limited, no coordinates)**

### ❌ E. SerpAPI / Serper.dev
**Paid SERP scraping APIs.**
- Serper.dev: 2,500 free searches/month
- SerpAPI: 100 free searches/month
- Clean JSON output with coordinates
- **Verdict: Viable but introduces another API dependency — same friction as Google Maps**

## Final Recommendation: **Option C (gosom/google-maps-scraper)**

### Rationale

1. **Zero code to write** — just create a queries file and run Docker
2. **Battle-tested** — 3.8k stars, handles anti-bot, pagination, dedup
3. **Docker is already in the project** — user has `docker-compose.yml`
4. **Outputs structured CSV/JSON** with name, address, phone, rating, lat, lng
5. **One command, done** — no Playwright scripts to debug

### If Docker feels heavy → **Option B (Custom Playwright)**

Write a ~150-line Node.js script using `playwright` to:
- Open Google Maps headless
- Search each district
- Scroll + extract results
- Parse coordinates from URLs
- More control, stays in Node.js ecosystem

## Implementation Plan

### Option C (Quick path — Docker)
1. Create `scripts/queries-hcm.txt` with 22 district queries + 2 keywords = 44 lines
2. Run `docker run gosom/google-maps-scraper` with the queries file
3. Parse output CSV → transform to `courts-data.json` format
4. Run existing `seed-courts.js --apply` to upsert into DB

### Option B (Custom path — Playwright)
1. Install `playwright` in shuttleup-api
2. Create `scripts/crawl-courts-playwright.js`
3. Implement district-by-district Google Maps search
4. Extract name, address, coordinates from results
5. Deduplicate and save to `courts-data.json`
6. Run `seed-courts.js --apply`

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Google blocks scraping | Use delays, headless mode, rotate user agents |
| DOM selectors change | gosom tool maintains these; Playwright script needs manual update |
| Duplicate courts across districts | Dedupe by name + coordinates proximity |
| Missing districts | Verify output covers all 22 districts |

## Success Metrics
- [ ] 250+ unique courts crawled
- [ ] All 22 HCM districts covered
- [ ] Each court has name, address, district, lat, lng
- [ ] Data seeded into PostgreSQL successfully

## Next Steps
1. User chooses Option B or C
2. Implement chosen approach
3. Run crawler
4. Verify output, run seed script
