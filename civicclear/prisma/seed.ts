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

  const citizenHash = await hash("citizen123", 12);
  const officialHash = await hash("official123", 12);

  await prisma.user.upsert({
    where: { email: "citizen@civicclear.local" },
    update: {},
    create: {
      name: "Asha Patel",
      email: "citizen@civicclear.local",
      phone: "9876543210",
      passwordHash: citizenHash,
      role: "citizen",
    },
  });

  await prisma.user.upsert({
    where: { email: "official@civicclear.local" },
    update: {},
    create: {
      name: "Ravi Kumar",
      email: "official@civicclear.local",
      phone: "9876543211",
      passwordHash: officialHash,
      role: "official",
    },
  });

  console.log("Seeded citizen@civicclear.local and official@civicclear.local");
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
