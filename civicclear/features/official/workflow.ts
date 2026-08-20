import type { ComplaintStatus, Priority } from "@prisma/client";

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/** Allowed official status transitions (roadmap status machine). */
export const STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  submitted: ["verified", "rejected"],
  verified: ["in_progress"],
  in_progress: ["resolved"],
  resolved: [],
  rejected: [],
};

export function canTransition(
  from: ComplaintStatus,
  to: ComplaintStatus,
): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function formatAge(from: Date, now = new Date()) {
  const ms = Math.max(0, now.getTime() - from.getTime());
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function statusPinColor(status: ComplaintStatus) {
  switch (status) {
    case "submitted":
      return "#d97706";
    case "verified":
      return "#ca8a04";
    case "in_progress":
      return "#2563eb";
    case "resolved":
      return "#15803d";
    case "rejected":
      return "#b91c1c";
  }
}
