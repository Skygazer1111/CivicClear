import type {
  ComplaintStatus,
  ComplaintType,
  Priority,
} from "@prisma/client";
import type { QueueFilters } from "@/features/official/queue";

export type FilterSearchParams = {
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
};

function asType(value?: string): ComplaintType | "all" | undefined {
  if (!value || value === "all") return value as "all" | undefined;
  const allowed = [
    "waterlogging",
    "elevator",
    "escalator",
    "washroom",
    "other",
  ];
  return allowed.includes(value) ? (value as ComplaintType) : "all";
}

function asStatus(value?: string): ComplaintStatus | "all" | undefined {
  if (!value || value === "all") return value as "all" | undefined;
  const allowed = [
    "submitted",
    "verified",
    "in_progress",
    "resolved",
    "rejected",
  ];
  return allowed.includes(value) ? (value as ComplaintStatus) : "all";
}

function asPriority(value?: string): Priority | "all" | undefined {
  if (!value || value === "all") return value as "all" | undefined;
  const allowed = ["low", "medium", "high"];
  return allowed.includes(value) ? (value as Priority) : "all";
}

export function parseQueueFilters(
  params: FilterSearchParams,
  options?: { defaultLastDays?: number },
): QueueFilters {
  let from = params.from;
  let to = params.to;

  if (!from && !to && options?.defaultLastDays) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (options.defaultLastDays - 1));
    from = start.toISOString().slice(0, 10);
    to = end.toISOString().slice(0, 10);
  }

  return {
    q: params.q,
    type: asType(params.type),
    status: asStatus(params.status),
    priority: asPriority(params.priority),
    from,
    to,
  };
}

export function filtersToSearchParams(filters: QueueFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.priority && filters.priority !== "all") {
    params.set("priority", filters.priority);
  }
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  return params;
}
