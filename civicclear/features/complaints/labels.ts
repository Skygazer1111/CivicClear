import type { ComplaintStatus, ComplaintType } from "@prisma/client";

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  pothole: "Pothole",
  garbage: "Garbage",
  streetlight: "Streetlight",
  drainage: "Drainage",
  other: "Other",
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
