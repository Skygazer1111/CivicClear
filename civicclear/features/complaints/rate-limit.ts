import { prisma } from "@/shared/db/prisma";

const MAX_REPORTS_PER_HOUR = 5;

export async function assertComplaintRateLimit(citizenId: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.complaint.count({
    where: {
      citizenId,
      createdAt: { gte: since },
    },
  });

  if (count >= MAX_REPORTS_PER_HOUR) {
    throw new Error(
      "You can submit up to 5 reports per hour. Please try again later.",
    );
  }
}
