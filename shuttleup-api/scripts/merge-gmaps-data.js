/**
 * Merge Google Maps scraper output with existing courts-data.json
 *
 * Reads NDJSON from gmaps-output/courts.json, transforms to our format,
 * deduplicates by name similarity + coordinate proximity, and merges
 * with existing courts-data.json.
 *
 * Usage: node scripts/merge-gmaps-data.js
 */

const fs = require('fs');
const path = require('path');

const GMAPS_OUTPUT = path.join(__dirname, 'gmaps-output', 'courts.json');
const EXISTING_DATA = path.join(__dirname, 'courts-data.json');
const MERGED_OUTPUT = path.join(__dirname, 'courts-data.json');

// District mapping: extract district from Google Maps address
const DISTRICT_PATTERNS = [
  { pattern: /Quận 1(?:\s|,|$)/i, district: 'Quận 1' },
  { pattern: /Quận 3(?:\s|,|$)/i, district: 'Quận 3' },
  { pattern: /Quận 4(?:\s|,|$)/i, district: 'Quận 4' },
  { pattern: /Quận 5(?:\s|,|$)/i, district: 'Quận 5' },
  { pattern: /Quận 6(?:\s|,|$)/i, district: 'Quận 6' },
  { pattern: /Quận 7(?:\s|,|$)/i, district: 'Quận 7' },
  { pattern: /Quận 8(?:\s|,|$)/i, district: 'Quận 8' },
  { pattern: /Quận 10(?:\s|,|$)/i, district: 'Quận 10' },
  { pattern: /Quận 11(?:\s|,|$)/i, district: 'Quận 11' },
  { pattern: /Quận 12(?:\s|,|$)/i, district: 'Quận 12' },
  { pattern: /Bình Tân/i, district: 'Quận Bình Tân' },
  { pattern: /Bình Thạnh/i, district: 'Quận Bình Thạnh' },
  { pattern: /Gò Vấp/i, district: 'Quận Gò Vấp' },
  { pattern: /Phú Nhuận/i, district: 'Quận Phú Nhuận' },
  { pattern: /Tân Bình/i, district: 'Quận Tân Bình' },
  { pattern: /Tân Phú/i, district: 'Quận Tân Phú' },
  { pattern: /Thủ Đức|Thủ đức/i, district: 'Thành phố Thủ Đức' },
  { pattern: /Bình Chánh/i, district: 'Huyện Bình Chánh' },
  { pattern: /Cần Giờ/i, district: 'Huyện Cần Giờ' },
  { pattern: /Củ Chi/i, district: 'Huyện Củ Chi' },
  { pattern: /Hóc Môn/i, district: 'Huyện Hóc Môn' },
  { pattern: /Nhà Bè/i, district: 'Huyện Nhà Bè' },
  // Ward-based detection for Thu Duc sub-areas (old Q2, Q9, Thu Duc)
  { pattern: /Hiệp Bình|Linh Trung|Linh Xuân|Linh Đông|Linh Chiểu|Bình Chiểu|Tam Bình|Tam Phú|Trường Thọ|An Phú|Bình An|Thảo Điền|An Khánh|Cát Lái|Phước Long|Tăng Nhơn Phú|Long Bình|Phú Hữu|Long Thạnh Mỹ|Bưng Ông Thoàn|Nguyễn Xiển|Quang Trung/i, district: 'Thành phố Thủ Đức' },
  // Bình Tân wards
  { pattern: /Tân Tạo|Bình Trị Đông|An Lạc|Bình Hưng Hòa|Ao Đôi|Tân Kỳ Tân Quý/i, district: 'Quận Bình Tân' },
  // Tân Phú wards
  { pattern: /Phú Thạnh|Hòa Bình.*Phú|Tân Sơn Nhì|Phú Thọ Hòa|Tây Thạnh|Sơn Kỳ/i, district: 'Quận Tân Phú' },
  // Quận 11 wards
  { pattern: /Bình Thới|Minh Phụng|Lạc Long Quân.*Phường/i, district: 'Quận 11' },
  // Quận 3 wards
  { pattern: /Nhiêu Lộc|Cách Mạng Tháng Tám.*Phường/i, district: 'Quận 3' },
];

function extractDistrict(address) {
  for (const { pattern, district } of DISTRICT_PATTERNS) {
    if (pattern.test(address)) return district;
  }
  return 'Không xác định';
}

/**
 * Calculate distance between two GPS points (Haversine, meters)
 */
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Normalize name for comparison
 */
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/sân cầu lông\s*/i, '')
    .replace(/sân\s*/i, '')
    .replace(/badminton\s*/i, '')
    .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi, '')
    .trim();
}

function main() {
  // Load existing courts
  let existing = [];
  if (fs.existsSync(EXISTING_DATA)) {
    existing = JSON.parse(fs.readFileSync(EXISTING_DATA, 'utf-8'));
    console.log(`📋 Existing courts: ${existing.length}`);
  }

  // Load Google Maps scraper output (NDJSON format — one JSON per line)
  if (!fs.existsSync(GMAPS_OUTPUT)) {
    console.error('❌ gmaps-output/courts.json not found');
    process.exit(1);
  }

  const lines = fs.readFileSync(GMAPS_OUTPUT, 'utf-8').trim().split('\n');
  const gmapsRaw = lines.filter(Boolean).map((l) => JSON.parse(l));
  console.log(`🗺️  Google Maps entries: ${gmapsRaw.length}`);

  // Transform Google Maps data
  const gmapsCourts = gmapsRaw
    .filter((p) => p.latitude && p.longtitude) // note: typo in gosom output
    .map((p) => ({
      name: p.title,
      address: p.address.replace(/, Việt Nam$/i, '').replace(/, Vietnam$/i, ''),
      district: extractDistrict(p.address),
      city: 'Hồ Chí Minh',
      lat: p.latitude,
      lng: p.longtitude,
      phone: p.phone || null,
      rating: p.review_rating || null,
      reviewCount: p.review_count || 0,
      googleMapsUrl: p.link || null,
      placeId: p.place_id || null,
    }));

  console.log(`✅ Transformed: ${gmapsCourts.length} courts from Google Maps`);

  // Merge: for each gmaps court, check if it already exists
  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const gc of gmapsCourts) {
    // Find existing court by name similarity or coordinate proximity
    const existingMatch = existing.find((e) => {
      const nameSim =
        normalizeName(e.name) === normalizeName(gc.name) ||
        normalizeName(e.name).includes(normalizeName(gc.name)) ||
        normalizeName(gc.name).includes(normalizeName(e.name));
      const closeDistance = distanceMeters(e.lat, e.lng, gc.lat, gc.lng) < 200;
      return nameSim || closeDistance;
    });

    if (existingMatch) {
      // Update existing with Google Maps precision data
      existingMatch.lat = gc.lat;
      existingMatch.lng = gc.lng;
      if (gc.phone) existingMatch.phone = gc.phone;
      if (gc.rating) existingMatch.rating = gc.rating;
      if (gc.reviewCount) existingMatch.reviewCount = gc.reviewCount;
      if (gc.googleMapsUrl) existingMatch.googleMapsUrl = gc.googleMapsUrl;
      if (gc.placeId) existingMatch.placeId = gc.placeId;
      // Prefer Google Maps address
      existingMatch.address = gc.address;
      updated++;
    } else {
      existing.push(gc);
      added++;
    }
  }

  // Sort by district
  existing.sort((a, b) => a.district.localeCompare(b.district, 'vi'));

  // Write merged output
  fs.writeFileSync(MERGED_OUTPUT, JSON.stringify(existing, null, 2), 'utf-8');

  // Stats by district
  const byDistrict = {};
  for (const c of existing) {
    byDistrict[c.district] = (byDistrict[c.district] || 0) + 1;
  }

  console.log(`\n📊 Merge Results:`);
  console.log(`   Added (new): ${added}`);
  console.log(`   Updated (GPS/phone): ${updated}`);
  console.log(`   Total courts: ${existing.length}`);
  console.log(`\n📍 By district:`);
  for (const [d, c] of Object.entries(byDistrict).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${d}: ${c}`);
  }
}

main();
