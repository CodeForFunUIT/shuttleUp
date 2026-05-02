/**
 * Custom Playwright-based Google Maps scraper for badminton courts
 *
 * Runs natively on ARM Mac (no Docker emulation issues).
 * Searches Google Maps for each district, scrolls results, extracts court data.
 *
 * Usage: node scripts/crawl-courts-playwright.js [--batch 2|3|4|all]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'gmaps-output', 'courts.json');

// All HCM districts with search queries
const ALL_QUERIES = [
  'sân cầu lông Quận 1 Hồ Chí Minh',
  'sân cầu lông Quận 3 Hồ Chí Minh',
  'sân cầu lông Quận 4 Hồ Chí Minh',
  'sân cầu lông Quận 5 Hồ Chí Minh',
  'sân cầu lông Quận 6 Hồ Chí Minh',
  'sân cầu lông Quận 7 Hồ Chí Minh',
  'sân cầu lông Quận 8 Hồ Chí Minh',
  'sân cầu lông Quận 10 Hồ Chí Minh',
  'sân cầu lông Quận 11 Hồ Chí Minh',
  'sân cầu lông Quận 12 Hồ Chí Minh',
  'sân cầu lông Quận Bình Tân Hồ Chí Minh',
  'sân cầu lông Quận Bình Thạnh Hồ Chí Minh',
  'sân cầu lông Quận Gò Vấp Hồ Chí Minh',
  'sân cầu lông Quận Phú Nhuận Hồ Chí Minh',
  'sân cầu lông Quận Tân Bình Hồ Chí Minh',
  'sân cầu lông Quận Tân Phú Hồ Chí Minh',
  'sân cầu lông Thành phố Thủ Đức Hồ Chí Minh',
  'sân cầu lông Huyện Bình Chánh Hồ Chí Minh',
  'sân cầu lông Huyện Hóc Môn Hồ Chí Minh',
  'sân cầu lông Huyện Nhà Bè Hồ Chí Minh',
  'sân cầu lông Huyện Củ Chi Hồ Chí Minh',
  'sân cầu lông Huyện Cần Giờ Hồ Chí Minh',
];

const BATCHES = {
  2: ALL_QUERIES.slice(0, 7),   // Q1 - Q8
  3: ALL_QUERIES.slice(7, 14),  // Q10 - Tân Bình
  4: ALL_QUERIES.slice(14),     // Tân Phú - Cần Giờ
  all: ALL_QUERIES,
};

/**
 * Scroll the results panel to load all places
 */
async function scrollResultsList(page) {
  const feedSelector = 'div[role="feed"]';
  const feed = page.locator(feedSelector);
  const exists = await feed.count();
  if (!exists) return;

  let prevCount = 0;
  let stableRounds = 0;

  for (let i = 0; i < 15; i++) {
    await feed.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await page.waitForTimeout(1500);

    const items = await page.locator('div[role="feed"] > div > div > a').count();
    if (items === prevCount) {
      stableRounds++;
      if (stableRounds >= 3) break;
    } else {
      stableRounds = 0;
      prevCount = items;
    }
  }
}

/**
 * Extract place data from a Google Maps place page
 */
async function extractPlaceDetail(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const getText = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.textContent.trim() : '';
      };

      // Title
      const title = getText('h1');

      // Address — find button with data-item-id="address"
      const addressEl = document.querySelector('[data-item-id="address"]');
      const address = addressEl
        ? addressEl.querySelector('.Io6YTe')?.textContent.trim() || ''
        : '';

      // Phone
      const phoneEl = document.querySelector('[data-item-id^="phone:"]');
      const phone = phoneEl
        ? phoneEl.querySelector('.Io6YTe')?.textContent.trim() || ''
        : '';

      // Rating & review count
      const ratingEl = document.querySelector('div.F7nice span[aria-hidden]');
      const rating = ratingEl ? parseFloat(ratingEl.textContent) : null;
      const reviewEl = document.querySelector('div.F7nice span[aria-label]');
      const reviewCount = reviewEl
        ? parseInt(reviewEl.getAttribute('aria-label').replace(/\D/g, ''))
        : 0;

      // Category
      const catEl = document.querySelector('button[jsaction*="category"]');
      const category = catEl ? catEl.textContent.trim() : '';

      return { title, address, phone, rating, reviewCount, category };
    });

    // Extract coordinates from URL
    const coords = extractCoordsFromUrl(page.url());

    return { ...data, ...coords, link: page.url() };
  } catch (err) {
    console.error(`  ⚠️  Error extracting ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Extract lat/lng from Google Maps URL
 */
function extractCoordsFromUrl(url) {
  // Pattern: @10.7769,106.7009,15z or !3d10.7769!4d106.7009
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }
  const dataMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (dataMatch) {
    return { lat: parseFloat(dataMatch[1]), lng: parseFloat(dataMatch[2]) };
  }
  return { lat: null, lng: null };
}

/**
 * Search Google Maps for a query and extract all result URLs
 */
async function searchAndCollectUrls(page, query) {
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=vi`;
  console.log(`\n🔍 Searching: ${query}`);

  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  // Scroll to load all results
  await scrollResultsList(page);

  // Collect place URLs from the feed
  const urls = await page.evaluate(() => {
    const links = document.querySelectorAll('div[role="feed"] a[href*="/maps/place/"]');
    return [...new Set([...links].map((a) => a.href))];
  });

  console.log(`   📍 Found ${urls.length} places`);
  return urls;
}

async function main() {
  const batchArg = process.argv[2]?.replace('--batch=', '') || process.argv[3] || 'all';
  const queries = BATCHES[batchArg] || ALL_QUERIES;
  console.log(`\n🏸 Crawling ${queries.length} queries (batch: ${batchArg})`);

  // Load existing results (append mode)
  let allResults = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    const existing = fs.readFileSync(OUTPUT_FILE, 'utf-8').trim();
    if (existing) {
      allResults = existing.split('\n').filter(Boolean).map((l) => JSON.parse(l));
      console.log(`📋 Loaded ${allResults.length} existing results`);
    }
  }

  const seenPlaceIds = new Set(allResults.map((r) => r.link || ''));

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    locale: 'vi-VN',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  // Accept cookies if dialog appears
  page.on('dialog', async (dialog) => dialog.accept());

  let totalNew = 0;

  for (const query of queries) {
    try {
      const urls = await searchAndCollectUrls(page, query);

      for (const url of urls) {
        if (seenPlaceIds.has(url)) {
          console.log(`   ⏭️  Skip (already scraped)`);
          continue;
        }

        const place = await extractPlaceDetail(page, url);
        if (place && place.title) {
          allResults.push(place);
          seenPlaceIds.add(url);
          totalNew++;
          console.log(`   ✅ ${place.title} (${place.address?.slice(0, 40)}...)`);
        }

        // Respectful delay
        await page.waitForTimeout(800 + Math.random() * 700);
      }
    } catch (err) {
      console.error(`❌ Failed query "${query}": ${err.message}`);
    }
  }

  await browser.close();

  // Write results as NDJSON (same format as gosom scraper)
  const ndjson = allResults
    .map((r) =>
      JSON.stringify({
        title: r.title,
        address: r.address,
        phone: r.phone,
        review_rating: r.rating,
        review_count: r.reviewCount,
        category: r.category,
        latitude: r.lat,
        longtitude: r.lng, // keep typo for compatibility with merge script
        link: r.link,
        place_id: '',
      })
    )
    .join('\n');

  fs.writeFileSync(OUTPUT_FILE, ndjson + '\n', 'utf-8');

  console.log(`\n🎉 Done! Total places: ${allResults.length} (${totalNew} new this run)`);
  console.log(`📁 Saved to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
