/**
 * Seed courts data into PostgreSQL database
 *
 * Usage:
 *   node scripts/seed-courts.js          # Preview mode (dry run)
 *   node scripts/seed-courts.js --apply  # Actually insert into DB
 *
 * Requires: DATABASE_URL in .env
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const IS_APPLY = process.argv.includes('--apply');

// Load .env manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex);
        let value = trimmed.substring(eqIndex + 1);
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL in .env');
  process.exit(1);
}

async function seed() {
  // Load courts data
  const dataPath = path.join(__dirname, 'courts-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ courts-data.json not found. Run crawl-courts.js first.');
    process.exit(1);
  }

  const courts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📋 Loaded ${courts.length} courts from courts-data.json\n`);

  if (!IS_APPLY) {
    console.log('🔍 PREVIEW MODE — showing what would be inserted:\n');
    const byDistrict = {};
    for (const court of courts) {
      byDistrict[court.district] = (byDistrict[court.district] || 0) + 1;
    }
    for (const [district, count] of Object.entries(byDistrict).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${district}: ${count} courts`);
    }
    console.log(`\n   Total: ${courts.length} courts`);
    console.log('\n💡 Run with --apply to insert into database.');
    return;
  }

  // Connect to DB
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log('✅ Connected to database\n');

  let inserted = 0;
  let skipped = 0;

  for (const court of courts) {
    try {
      // Check if court already exists (by name + district)
      const existing = await client.query(
        'SELECT id FROM courts WHERE name = $1 AND district = $2',
        [court.name, court.district]
      );

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      // Generate a CUID-like ID
      const id = generateCuid();

      await client.query(
        `INSERT INTO courts (id, name, address, district, city, lat, lng, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [id, court.name, court.address, court.district, court.city, court.lat, court.lng]
      );
      inserted++;
      console.log(`   ✅ ${court.name} (${court.district})`);
    } catch (err) {
      console.error(`   ❌ Failed: ${court.name} — ${err.message}`);
    }
  }

  await client.end();

  console.log(`\n🏸 Seeding complete!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped (already exists): ${skipped}`);
}

/**
 * Generate a simple CUID-like ID
 */
function generateCuid() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  const counter = Math.floor(Math.random() * 1000).toString(36).padStart(3, '0');
  return `c${timestamp}${random}${counter}`;
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
