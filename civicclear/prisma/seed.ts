import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
