import { ComplaintStatus } from "@prisma/client";
import {
  COMPLAINT_STATUS_LABELS,
  statusBadgeClass,
} from "@/features/complaints/labels";
import { cn } from "@/shared/lib/utils";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight shadow-[0_1px_0_rgba(255,255,255,0.7)_inset]",
        statusBadgeClass(status),
      )}
    >
      {COMPLAINT_STATUS_LABELS[status]}
    </span>
  );
}
