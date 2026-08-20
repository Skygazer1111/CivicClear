import { prisma } from "@/shared/db/prisma";

export async function createPublicRef() {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const n = Math.floor(Math.random() * 100000);
    const publicRef = `CC-${year}-${String(n).padStart(5, "0")}`;
    const existing = await prisma.complaint.findUnique({
      where: { publicRef },
      select: { id: true },
    });
    if (!existing) return publicRef;
  }

  return `CC-${year}-${Date.now().toString().slice(-5)}`;
}
