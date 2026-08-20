"use client";

import { useActionState } from "react";
import type { ComplaintStatus, Priority } from "@prisma/client";
import {
  updateComplaintPriorityAction,
  updateComplaintStatusAction,
} from "@/features/official/actions";
import { COMPLAINT_STATUS_LABELS } from "@/features/complaints/labels";
import { PRIORITY_LABELS, STATUS_TRANSITIONS } from "@/features/official/workflow";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";

export function OfficialComplaintActions({
  complaintId,
  status,
  priority,
}: {
  complaintId: string;
  status: ComplaintStatus;
  priority: Priority;
}) {
  const nextStatuses = STATUS_TRANSITIONS[status];
  const [statusState, statusAction, statusPending] = useActionState(
    updateComplaintStatusAction,
    undefined,
  );
  const [priorityState, priorityAction, priorityPending] = useActionState(
    updateComplaintPriorityAction,
    undefined,
  );

  return (
    <div className="space-y-6">
      <form action={priorityAction} className="space-y-3">
        <input type="hidden" name="complaintId" value={complaintId} />
        <Label htmlFor="priority">Priority</Label>
        <div className="flex flex-wrap gap-2">
          <select
            id="priority"
            name="priority"
            defaultValue={priority}
            className="h-11 rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
          >
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" disabled={priorityPending}>
            {priorityPending ? "Saving…" : "Update priority"}
          </Button>
        </div>
        {priorityState?.error ? (
          <p className="text-sm text-status-rejected">{priorityState.error}</p>
        ) : null}
        {priorityState?.ok ? (
          <p className="text-sm text-status-resolved">Priority updated.</p>
        ) : null}
      </form>

      <form action={statusAction} className="space-y-3">
        <input type="hidden" name="complaintId" value={complaintId} />
        <Label htmlFor="toStatus">Update status</Label>
        {nextStatuses.length === 0 ? (
          <p className="text-sm text-ink-muted">
            This complaint is closed. No further status changes.
          </p>
        ) : (
          <>
            <select
              id="toStatus"
              name="toStatus"
              required
              className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
              defaultValue={nextStatuses[0]}
            >
              {nextStatuses.map((value) => (
                <option key={value} value={value}>
                  {COMPLAINT_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
            <div>
              <Label htmlFor="note">Note</Label>
              <textarea
                id="note"
                name="note"
                rows={3}
                placeholder="Required when rejecting or resolving"
                className="w-full rounded-2xl border border-line/80 bg-white/80 px-3.5 py-3 text-sm"
              />
            </div>
            <Button type="submit" disabled={statusPending}>
              {statusPending ? "Updating…" : "Save status"}
            </Button>
          </>
        )}
        {statusState?.error ? (
          <p className="text-sm text-status-rejected">{statusState.error}</p>
        ) : null}
        {statusState?.ok ? (
          <p className="text-sm text-status-resolved">Status updated.</p>
        ) : null}
      </form>
    </div>
  );
}
