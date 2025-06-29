const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const seed = async () => {
  try {
    console.log("🧹 Clearing old data...");
    await prisma.spamReport.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.user.deleteMany();

    console.log("👤 Creating sample users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const user1 = await prisma.user.create({
      data: {
        name: "Alice",
        phone: "1111111111",
        email: "alice@example.com",
        password: passwordHash,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: "Bob",
        phone: "2222222222",
        email: "bob@example.com",
        password: passwordHash,
      },
    });

    console.log("📇 Creating contacts...");
    await prisma.contact.createMany({
      data: [
        { name: "Spammy Guy", phone: "9999999999", userId: user1.id },
        { name: "Scamster", phone: "9999999999", userId: user2.id },
        { name: "Alice", phone: user1.phone, userId: user2.id },
        { name: "Bob", phone: user2.phone, userId: user1.id },
      ],
    });

    console.log("🚨 Marking spam numbers...");
    await prisma.spamReport.createMany({
      data: [
        { phone: "9999999999", userId: user1.id },
        { phone: "9999999999", userId: user2.id },
      ],
    });

    console.log("✅ Seed data created successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seed();
