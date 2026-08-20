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
      return "bg-amber-50 text-status-pending";
    case "in_progress":
      return "bg-sky-50 text-status-progress";
    case "resolved":
      return "bg-emerald-50 text-status-resolved";
    case "rejected":
      return "bg-rose-50 text-status-rejected";
  }
}
