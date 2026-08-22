import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

config({ path: resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Put your Neon URL in civicclear/.env",
    );
  }

  const officialHash = await hash("official123", 12);
  const adminHash = await hash("admin123", 12);
  const citizenHash = await hash("citizen123", 12);

  await prisma.user.upsert({
    where: { email: "admin@civicclear.local" },
    update: {
      name: "CampusClean Admin",
      role: "admin",
      passwordHash: adminHash,
      active: true,
    },
    create: {
      name: "CampusClean Admin",
      email: "admin@civicclear.local",
      phone: "9876543200",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "official@civicclear.local" },
    update: {
      role: "official",
      passwordHash: officialHash,
      active: true,
    },
    create: {
      name: "Ravi Kumar",
      email: "official@civicclear.local",
      phone: "9876543211",
      passwordHash: officialHash,
      role: "official",
    },
  });

  await prisma.user.upsert({
    where: { email: "citizen@civicclear.local" },
    update: {
      role: "citizen",
      passwordHash: citizenHash,
      active: true,
    },
    create: {
      name: "Asha Patel",
      email: "citizen@civicclear.local",
      phone: "9876543210",
      passwordHash: citizenHash,
      role: "citizen",
    },
  });

  console.log("Seeded CampusClean:");
  console.log("  admin@civicclear.local / admin123  (creates coordinators at /admin)");
  console.log("  official@civicclear.local / official123  (coordinator)");
  console.log("  citizen@civicclear.local / citizen123  (student)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
