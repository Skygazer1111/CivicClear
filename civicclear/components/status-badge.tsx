import { ComplaintStatus } from "@prisma/client";
import {
  COMPLAINT_STATUS_LABELS,
  statusBadgeClass,
} from "@/lib/labels";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        statusBadgeClass(status),
      )}
    >
      {COMPLAINT_STATUS_LABELS[status]}
    </span>
  );
}
