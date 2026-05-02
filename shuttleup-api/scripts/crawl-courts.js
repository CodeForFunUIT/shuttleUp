/**
 * Crawl Badminton Courts in Ho Chi Minh City from Google Maps Places API (New)
 *
 * Usage:
 *   GOOGLE_MAPS_API_KEY=your_key node scripts/crawl-courts.js --test   # Test mode: 1 API call only
 *   GOOGLE_MAPS_API_KEY=your_key node scripts/crawl-courts.js          # Full crawl
 *
 * Output: scripts/courts-data.json
 */

const fs = require('fs');
const path = require('path');

const IS_TEST_MODE = process.argv.includes('--test');

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error('❌ Missing GOOGLE_MAPS_API_KEY environment variable');
  console.error('   Usage: GOOGLE_MAPS_API_KEY=your_key node scripts/crawl-courts.js');
  process.exit(1);
}

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.addressComponents',
].join(',');

// All districts in Ho Chi Minh City
const HCM_DISTRICTS = [
  'Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7',
  'Quận 8', 'Quận 10', 'Quận 11', 'Quận 12',
  'Quận Bình Tân', 'Quận Bình Thạnh', 'Quận Gò Vấp',
  'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú',
  'Thành phố Thủ Đức',
  'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Củ Chi',
  'Huyện Hóc Môn', 'Huyện Nhà Bè',
];

// Search queries — Vietnamese terms for badminton court
const SEARCH_TERMS = ['sân cầu lông', 'badminton'];

// HCM City center for locationBias
const HCM_CENTER = { latitude: 10.7769, longitude: 106.7009 };

/**
 * Call Google Maps Places API Text Search
 */
async function textSearch(query, pageToken = null) {
  const body = {
    textQuery: query,
    languageCode: 'vi',
    pageSize: 20,
    locationBias: {
      circle: {
        center: HCM_CENTER,
        radius: 30000.0, // 30km radius covers all of HCM
      },
    },
  };

  if (pageToken) {
    body.pageToken = pageToken;
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

/**
 * Extract district from addressComponents or formattedAddress
 */
function extractDistrict(place, searchDistrict) {
  // Try addressComponents first
  if (place.addressComponents) {
    for (const comp of place.addressComponents) {
      const types = comp.types || [];
      if (
        types.includes('administrative_area_level_2') ||
        types.includes('sublocality_level_1') ||
        types.includes('sublocality')
      ) {
        return comp.longText || comp.shortText || searchDistrict;
      }
    }
  }

  // Fallback: try to extract from formattedAddress
  const address = place.formattedAddress || '';
  for (const district of HCM_DISTRICTS) {
    if (address.includes(district)) {
      return district;
    }
  }

  // Final fallback: use the search district
  return searchDistrict;
}

/**
 * Transform a Google Place into our Court schema
 */
function transformPlace(place, searchDistrict) {
  return {
    googlePlaceId: place.id,
    name: place.displayName?.text || 'Unknown Court',
    address: place.formattedAddress || '',
    district: extractDistrict(place, searchDistrict),
    city: 'Hồ Chí Minh',
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0,
  };
}

/**
 * Pause execution for ms milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main crawl function
 */
async function crawl() {
  const allCourts = new Map(); // keyed by googlePlaceId for dedup
  let totalApiCalls = 0;

  if (IS_TEST_MODE) {
    console.log('🧪 TEST MODE — only 1 API call, no pagination\n');
  }
  console.log('🏸 Starting badminton court crawl for Ho Chi Minh City...\n');

  const districts = IS_TEST_MODE ? [HCM_DISTRICTS[0]] : HCM_DISTRICTS;
  const terms = IS_TEST_MODE ? [SEARCH_TERMS[0]] : SEARCH_TERMS;

  for (const district of districts) {
    for (const term of terms) {
      const query = `${term} ${district} Hồ Chí Minh`;
      console.log(`🔍 Searching: "${query}"`);

      let pageToken = null;
      let pageNum = 1;

      do {
        try {
          const data = await textSearch(query, pageToken);
          totalApiCalls++;

          const places = data.places || [];
          console.log(`   Page ${pageNum}: ${places.length} results`);

          // In test mode, print raw first result for inspection
          if (IS_TEST_MODE && places.length > 0) {
            console.log('\n📋 Raw API response sample (first result):');
            console.log(JSON.stringify(places[0], null, 2));
            console.log('');
          }

          for (const place of places) {
            if (place.id && !allCourts.has(place.id)) {
              allCourts.set(place.id, transformPlace(place, district));
            }
          }

          // In test mode, skip pagination
          pageToken = IS_TEST_MODE ? null : (data.nextPageToken || null);
          pageNum++;

          // Rate limit — wait 2s between requests
          if (pageToken) {
            await sleep(2000);
          }
        } catch (error) {
          console.error(`   ❌ Error: ${error.message}`);
          pageToken = null; // stop pagination on error
        }
      } while (pageToken);

      // Small delay between searches to be respectful
      await sleep(500);
    }
  }

  const courts = Array.from(allCourts.values());

  console.log(`\n✅ ${IS_TEST_MODE ? 'Test' : 'Crawl'} complete!`);
  console.log(`   Total API calls: ${totalApiCalls}`);
  console.log(`   Unique courts found: ${courts.length}`);

  // In test mode, print all transformed results for review
  if (IS_TEST_MODE) {
    console.log('\n📋 Transformed courts (what will be saved):');
    for (const court of courts) {
      console.log(`   🏸 ${court.name}`);
      console.log(`      📍 ${court.address}`);
      console.log(`      🗺️  District: ${court.district} | Lat: ${court.lat}, Lng: ${court.lng}`);
      console.log('');
    }
    console.log('💡 If this looks good, run without --test to crawl all districts.');
    return;
  }

  // Save to JSON
  const outputPath = path.join(__dirname, 'courts-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(courts, null, 2), 'utf-8');
  console.log(`   📄 Saved to: ${outputPath}`);

  // Print summary by district
  const byDistrict = {};
  for (const court of courts) {
    byDistrict[court.district] = (byDistrict[court.district] || 0) + 1;
  }
  console.log('\n📊 Courts by district:');
  for (const [district, count] of Object.entries(byDistrict).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${district}: ${count}`);
  }
}

crawl().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
