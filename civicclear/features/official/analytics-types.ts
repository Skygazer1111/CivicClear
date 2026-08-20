import type { ComplaintType } from "@prisma/client";

export type AnalyticsPayload = {
  total: number;
  overTime: { date: string; count: number }[];
  byType: { type: ComplaintType; label: string; count: number }[];
  resolution: {
    averageHours: number | null;
    resolvedCount: number;
    byType: {
      type: ComplaintType;
      label: string;
      averageHours: number | null;
      count: number;
    }[];
  };
};
