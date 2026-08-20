import type {
  ComplaintStatus,
  ComplaintType,
  Prisma,
  Priority,
} from "@prisma/client";
import { prisma } from "@/shared/db/prisma";

export type QueueFilters = {
  q?: string;
  type?: ComplaintType | "all";
  status?: ComplaintStatus | "all";
  priority?: Priority | "all";
  from?: string;
  to?: string;
};

function parseDateStart(value?: string) {
  if (!value) return undefined;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function parseDateEnd(value?: string) {
  if (!value) return undefined;
  const d = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function buildComplaintWhere(
  filters: QueueFilters,
): Prisma.ComplaintWhereInput {
  const where: Prisma.ComplaintWhereInput = {};

  if (filters.q?.trim()) {
    where.OR = [
      { publicRef: { contains: filters.q.trim(), mode: "insensitive" } },
      { title: { contains: filters.q.trim(), mode: "insensitive" } },
    ];
  }
  if (filters.type && filters.type !== "all") where.type = filters.type;
  if (filters.status && filters.status !== "all") where.status = filters.status;
  if (filters.priority && filters.priority !== "all") {
    where.priority = filters.priority;
  }

  const from = parseDateStart(filters.from);
  const to = parseDateEnd(filters.to);
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    };
  }

  return where;
}

const statusRank: Record<ComplaintStatus, number> = {
  submitted: 0,
  verified: 1,
  in_progress: 2,
  resolved: 3,
  rejected: 4,
};

export async function listComplaintsForOfficials(filters: QueueFilters) {
  const complaints = await prisma.complaint.findMany({
    where: buildComplaintWhere(filters),
    include: {
      citizen: { select: { name: true, email: true } },
      photos: { take: 1 },
    },
  });

  // Oldest unverified first, then by workflow stage, then age.
  return complaints.sort((a, b) => {
    const rankDiff = statusRank[a.status] - statusRank[b.status];
    if (rankDiff !== 0) return rankDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}
