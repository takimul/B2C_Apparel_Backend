import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const adminEmail = process.env.ADMIN_EMAIL;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: {
      email: adminEmail,
    },

    update: {
      name: "Verigo Essential Admin",
      passwordHash,
      isActive: true,
    },

    create: {
      name: "Verigo Essential Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.siteSettings.upsert({
    where: {
      id: "default",
    },

    update: {},

    create: {
      id: "default",
      siteName: "Verigo Essential",
      tagline: "Premium Apparel & Authentic Beauty",
    },
  });

  await prisma.aboutPage.upsert({
    where: {
      id: "default",
    },

    update: {},

    create: {
      id: "default",
      title: "About Verigo Essential",
      description:
        "Premium apparel wholesale and custom manufacturing solutions.",
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  console.log("✅ Site settings initialized");

  console.log("✅ About page initialized");

  console.log("🌱 Seed completed");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
