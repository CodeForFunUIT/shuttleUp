import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { fakerVI as faker } from '@faker-js/faker';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://shuttleup:shuttleup_dev@localhost:5432/shuttleup?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const generateUsers = async (count: number) => {
  console.log(`Generating ${count} mock users...`);
  const users: any[] = [];
  for (let i = 0; i < count; i++) {
    const isHost = faker.datatype.boolean({ probability: 0.3 }); // 30% chance to have higher elo
    const skillLevel = faker.helpers.arrayElement(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO']);
    const eloScore = isHost ? faker.number.int({ min: 1400, max: 2000 }) : faker.number.int({ min: 1000, max: 1600 });
    
    users.push({
      email: faker.internet.email().toLowerCase(),
      emailVerified: true,
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      phone: faker.phone.number(),
      skillLevel,
      eloScore,
      role: 'USER',
    });
  }
  
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
  console.log(`✅ Created ${count} mock users.`);
};

const main = async () => {
  console.log('🌱 Starting database seed with realistic mock data...');

  // 1. Ensure we have courts
  const courts = await prisma.court.findMany({ select: { id: true, name: true } });
  if (courts.length === 0) {
    console.error('❌ No courts found in the database. Please run your court scraper seed first.');
    process.exit(1);
  }
  console.log(`✅ Found ${courts.length} existing courts.`);

  // 2. Ensure we have enough users
  let users = await prisma.user.findMany({ select: { id: true } });
  if (users.length < 50) {
    await generateUsers(50 - users.length);
    users = await prisma.user.findMany({ select: { id: true } });
  } else {
    console.log(`✅ Found ${users.length} existing users. No need to generate more.`);
  }

  // 3. Generate Court Sessions
  const SESSION_COUNT = 1000;
  console.log(`Generating ${SESSION_COUNT} mock court sessions...`);

  const courtIds = courts.map((c) => c.id);
  const userIds = users.map((u) => u.id);

  const sessions: any[] = [];

  for (let i = 0; i < SESSION_COUNT; i++) {
    const hostId = faker.helpers.arrayElement(userIds);
    const courtId = faker.helpers.arrayElement(courtIds);
    
    // Generate a random startTime between yesterday and 30 days into the future
    const startTime = faker.date.soon({ days: 30 });
    
    // duration between 1 to 3 hours
    const durationHours = faker.helpers.arrayElement([1, 1.5, 2, 2.5, 3]);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);

    const totalSlots = faker.helpers.arrayElement([4, 6, 8, 10, 12]);
    const availableSlots = faker.number.int({ min: 0, max: totalSlots });

    const priceOptions = [50000, 60000, 70000, 80000, 100000, 120000, 150000];
    const pricePerSlot = faker.helpers.arrayElement(priceOptions);

    const skillRequired = faker.helpers.arrayElement(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO']);
    const gameType = faker.helpers.arrayElement(['singles', 'doubles', 'mixed']);
    
    // Status Logic
    let status = 'OPEN';
    if (availableSlots === 0) {
      status = 'FULL';
    } else if (startTime < new Date()) {
      status = 'COMPLETED';
    }

    sessions.push({
      hostId,
      courtId,
      title: `Kèo ${gameType === 'singles' ? 'đơn' : gameType === 'doubles' ? 'đôi' : 'nam nữ'} trình độ ${skillRequired}`,
      description: faker.helpers.maybe(() => faker.lorem.paragraph({ min: 1, max: 3 }), { probability: 0.6 }),
      startTime,
      endTime,
      totalSlots,
      availableSlots,
      pricePerSlot,
      skillRequired,
      gameType,
      status,
    });
  }

  // Insert Sessions
  // Prisma createMany returns { count: number }
  const createResult = await prisma.courtSession.createMany({
    data: sessions,
  });
  console.log(`✅ Inserted ${createResult.count} mock sessions.`);

  // 4. (Optional) Generate Bookings for non-empty sessions to match availableSlots math
  // For the sake of simplicity, we can just say the slots are taken but skip generating Bookings for now, 
  // or generate a few if needed.
  console.log('🌱 Seed complete!');
};

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
