import Link from "next/link";
import { auth } from "@/features/auth/auth";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";
import { formatAge, PRIORITY_LABELS } from "@/features/official/workflow";
import { listComplaintsForOfficials } from "@/features/official/queue";
import { QueueFilters } from "@/features/official/components/queue-filters";
import {
  filtersToSearchParams,
  parseQueueFilters,
} from "@/features/official/parse-filters";
import { StatusBadge } from "@/features/complaints/components/status-badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
}>;

export default async function OfficialQueuePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const params = await searchParams;
  const filters = parseQueueFilters(params);
  const complaints = await listComplaintsForOfficials(filters);
  const exportQuery = filtersToSearchParams(filters).toString();

  return (
    <div className="rise-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Complaint queue
          </h1>
          <p className="mt-2 text-ink-muted">
            Signed in as {session?.user?.name}. Oldest unverified reports appear
            first.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/map">Map view</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics">Analytics</Link>
          </Button>
          <Button asChild>
            <a
              href={`/api/official/export${exportQuery ? `?${exportQuery}` : ""}`}
            >
              Download CSV
            </a>
          </Button>
        </div>
      </div>

      <QueueFilters filters={params} />

      {complaints.length === 0 ? (
        <div className="glass-panel rounded-[1.5rem]">
          <EmptyState
            title="No complaints match these filters"
            description="Clear filters or wait for new citizen reports."
          />
        </div>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {complaints.map((complaint) => (
              <li key={complaint.id}>
                <Link
                  href={`/queue/${complaint.id}`}
                  className="glass-panel block rounded-[1.25rem] p-4 transition-colors hover:bg-white/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-accent">
                        {complaint.publicRef}
                      </p>
                      <p className="mt-1 font-medium text-ink">
                        {complaint.title}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {COMPLAINT_TYPE_LABELS[complaint.type]} ·{" "}
                        {PRIORITY_LABELS[complaint.priority]} ·{" "}
                        {formatAge(complaint.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={complaint.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="glass-panel hidden overflow-hidden rounded-[1.5rem] md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line/70 bg-white/40 text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Age</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-t border-line/60 hover:bg-white/35"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/queue/${complaint.id}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {complaint.publicRef}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink">{complaint.title}</td>
                    <td className="px-5 py-3 text-ink-muted">
                      {COMPLAINT_TYPE_LABELS[complaint.type]}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {PRIORITY_LABELS[complaint.priority]}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {formatAge(complaint.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
