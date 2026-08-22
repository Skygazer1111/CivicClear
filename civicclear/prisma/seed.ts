import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { ensureAdminInvite } from "../features/auth/ensure-admin";

config({ path: resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Put your Neon URL in civicclear/.env",
    );
  }

  const adminEmail = await ensureAdminInvite();

  const citizenHash = await hash("citizen123", 12);

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
  console.log(
    `  admin invite: ${adminEmail}  (first login sets name, mobile, password)`,
  );
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
