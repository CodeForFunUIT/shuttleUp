import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://shuttleup:shuttleup_dev@localhost:5432/shuttleup?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding initial data...');

  // 1. Create a dummy test user
  const user = await prisma.user.upsert({
    where: { email: 'test@shuttleup.io' },
    update: {},
    create: {
      email: 'test@shuttleup.io',
      name: 'Test Setup User',
      phone: '0901234567',
      role: 'ADMIN',
      skillLevel: 'ADVANCED',
    },
  });

  console.log(`Created user: ${user.name}`);

  // 2. Create courts
  const courts = [
    {
      name: 'VBH Badminton Court',
      address: '123 Test Street',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      lat: 10.762622,
      lng: 106.660172,
    },
    {
      name: 'Tao Dan Sports Center',
      address: '1 Huyền Trân Công Chúa',
      district: 'District 1',
      city: 'Ho Chi Minh City',
      lat: 10.774404,
      lng: 106.691763,
    }
  ];

  for (const c of courts) {
    const check = await prisma.court.findFirst({ where: { name: c.name } });
    if (!check) {
      const court = await prisma.court.create({ data: c });
      // Update geometry separately using raw SQL to properly cast to Point, 4326
      await prisma.$executeRaw`
        UPDATE "courts"
        SET geometry = ST_SetSRID(ST_MakePoint(${c.lng}, ${c.lat}), 4326)
        WHERE id = ${court.id}
      `;
      console.log(`Created court: ${c.name} with GeoLocation`);
    }
  }

  // 3. Create a test session
  const court1 = await prisma.court.findFirst({ where: { name: 'VBH Badminton Court' } });
  if (court1) {
    const session = await prisma.courtSession.create({
      data: {
        hostId: user.id,
        courtId: court1.id,
        title: 'Weekend Morning Play',
        description: 'Friendly match, join us!',
        startTime: new Date(new Date().getTime() + 86400000), // Tomorrow
        endTime: new Date(new Date().getTime() + 86400000 + 7200000), // 2h duration
        totalSlots: 4,
        availableSlots: 4,
        pricePerSlot: 50000,
        skillRequired: 'ALL',
        status: 'OPEN',
      }
    });
    console.log(`Created session: ${session.title}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
