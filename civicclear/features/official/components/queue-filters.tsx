import Link from "next/link";
import type { ComplaintStatus, ComplaintType, Priority } from "@prisma/client";
import { COMPLAINT_STATUS_LABELS, COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";
import { PRIORITY_LABELS } from "@/features/official/workflow";
import { Button } from "@/shared/ui/button";

type Filters = {
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
};

export function QueueFilters({
  filters,
  action = "/queue",
}: {
  filters: Filters;
  action?: string;
}) {
  return (
    <form
      method="get"
      action={action}
      className="glass-panel grid gap-3 rounded-[1.5rem] p-4 sm:grid-cols-2 lg:grid-cols-6"
    >
      <label className="block text-sm lg:col-span-2">
        <span className="mb-1.5 block font-semibold text-ink">Search</span>
        <input
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Reference or title"
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3.5 text-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-ink">Type</span>
        <select
          name="type"
          defaultValue={filters.type ?? "all"}
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
        >
          <option value="all">All</option>
          {(Object.keys(COMPLAINT_TYPE_LABELS) as ComplaintType[]).map(
            (value) => (
              <option key={value} value={value}>
                {COMPLAINT_TYPE_LABELS[value]}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-ink">Status</span>
        <select
          name="status"
          defaultValue={filters.status ?? "all"}
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
        >
          <option value="all">All</option>
          {(Object.keys(COMPLAINT_STATUS_LABELS) as ComplaintStatus[]).map(
            (value) => (
              <option key={value} value={value}>
                {COMPLAINT_STATUS_LABELS[value]}
              </option>
            ),
          )}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-ink">Priority</span>
        <select
          name="priority"
          defaultValue={filters.priority ?? "all"}
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
        >
          <option value="all">All</option>
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((value) => (
            <option key={value} value={value}>
              {PRIORITY_LABELS[value]}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-ink">From</span>
        <input
          type="date"
          name="from"
          defaultValue={filters.from ?? ""}
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-semibold text-ink">To</span>
        <input
          type="date"
          name="to"
          defaultValue={filters.to ?? ""}
          className="flex h-11 w-full rounded-2xl border border-line/80 bg-white/80 px-3 text-sm"
        />
      </label>

      <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-6">
        <Button type="submit">Apply filters</Button>
        <Button asChild variant="outline">
          <Link href={action}>Clear</Link>
        </Button>
      </div>
    </form>
  );
}
