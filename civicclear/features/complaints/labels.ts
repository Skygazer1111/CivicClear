import type { ComplaintStatus, ComplaintType } from "@prisma/client";
import { complaintTypeSchema } from "@/features/complaints/schemas";

/** Types shown in report form + coordinator filters. */
export const ACTIVE_COMPLAINT_TYPES = complaintTypeSchema.options;

export type ActiveComplaintType = (typeof ACTIVE_COMPLAINT_TYPES)[number];

export const ACTIVE_COMPLAINT_TYPE_LABELS: Record<ActiveComplaintType, string> =
  {
    waterlogging: "Waterlogging",
    elevator: "Elevator",
    escalator: "Escalator",
    washroom: "Washroom",
    other: "Other",
  };

const LEGACY_TYPE_LABELS: Record<string, string> = {
  pothole: "Other",
  garbage: "Other",
  streetlight: "Other",
  drainage: "Other",
};

/** Safe label lookup for any stored complaint type (active or legacy). */
export function complaintTypeLabel(type: ComplaintType | string): string {
  if (type in ACTIVE_COMPLAINT_TYPE_LABELS) {
    return ACTIVE_COMPLAINT_TYPE_LABELS[type as ActiveComplaintType];
  }
  return LEGACY_TYPE_LABELS[type] ?? "Other";
}

/** @deprecated Prefer complaintTypeLabel() — kept for existing call sites. */
export const COMPLAINT_TYPE_LABELS: Record<string, string> = {
  ...ACTIVE_COMPLAINT_TYPE_LABELS,
  ...LEGACY_TYPE_LABELS,
};

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: "Submitted",
  verified: "Verified",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function statusBadgeClass(status: ComplaintStatus) {
  switch (status) {
    case "submitted":
    case "verified":
      return "bg-amber-100/90 text-status-pending ring-1 ring-amber-200/80";
    case "in_progress":
      return "bg-sky-100/90 text-status-progress ring-1 ring-sky-200/80";
    case "resolved":
      return "bg-emerald-100/90 text-status-resolved ring-1 ring-emerald-200/80";
    case "rejected":
      return "bg-orange-100/90 text-status-rejected ring-1 ring-orange-200/80";
  }
}
