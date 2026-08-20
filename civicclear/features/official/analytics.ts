import type { ComplaintType } from "@prisma/client";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";
import type { AnalyticsPayload } from "@/features/official/analytics-types";
import {
  buildComplaintWhere,
  type QueueFilters,
} from "@/features/official/queue";
import { prisma } from "@/shared/db/prisma";

export type { AnalyticsPayload };

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function hoursBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

export async function getOfficialAnalytics(
  filters: QueueFilters,
): Promise<AnalyticsPayload> {
  const where = buildComplaintWhere(filters);
  const complaints = await prisma.complaint.findMany({
    where,
    select: {
      type: true,
      createdAt: true,
      resolvedAt: true,
      status: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const overTimeMap = new Map<string, number>();
  const typeCount = new Map<ComplaintType, number>();
  const resolutionByType = new Map<
    ComplaintType,
    { totalHours: number; count: number }
  >();

  let resolvedHoursSum = 0;
  let resolvedCount = 0;

  for (const c of complaints) {
    const key = dayKey(c.createdAt);
    overTimeMap.set(key, (overTimeMap.get(key) ?? 0) + 1);
    typeCount.set(c.type, (typeCount.get(c.type) ?? 0) + 1);

    if (c.status === "resolved" && c.resolvedAt) {
      const hours = hoursBetween(c.createdAt, c.resolvedAt);
      resolvedHoursSum += hours;
      resolvedCount += 1;
      const bucket = resolutionByType.get(c.type) ?? {
        totalHours: 0,
        count: 0,
      };
      bucket.totalHours += hours;
      bucket.count += 1;
      resolutionByType.set(c.type, bucket);
    }
  }

  const types = Object.keys(COMPLAINT_TYPE_LABELS) as ComplaintType[];

  return {
    total: complaints.length,
    overTime: [...overTimeMap.entries()].map(([date, count]) => ({
      date,
      count,
    })),
    byType: types.map((type) => ({
      type,
      label: COMPLAINT_TYPE_LABELS[type],
      count: typeCount.get(type) ?? 0,
    })),
    resolution: {
      averageHours:
        resolvedCount > 0 ? resolvedHoursSum / resolvedCount : null,
      resolvedCount,
      byType: types.map((type) => {
        const bucket = resolutionByType.get(type);
        return {
          type,
          label: COMPLAINT_TYPE_LABELS[type],
          averageHours:
            bucket && bucket.count > 0
              ? bucket.totalHours / bucket.count
              : null,
          count: bucket?.count ?? 0,
        };
      }),
    },
  };
}

export function formatHours(hours: number | null) {
  if (hours == null) return "—";
  if (hours < 24) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} d`;
}
