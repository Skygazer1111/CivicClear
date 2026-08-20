import Link from "next/link";
import type { ComplaintStatus, ComplaintType, Priority } from "@prisma/client";
import { auth } from "@/features/auth/auth";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";
import { formatAge, PRIORITY_LABELS } from "@/features/official/workflow";
import { listComplaintsForOfficials } from "@/features/official/queue";
import { QueueFilters } from "@/features/official/components/queue-filters";
import { StatusBadge } from "@/features/complaints/components/status-badge";
import { Button } from "@/shared/ui/button";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
}>;

function asType(value?: string): ComplaintType | "all" | undefined {
  if (!value || value === "all") return value as "all" | undefined;
  const allowed = ["pothole", "garbage", "streetlight", "drainage", "other"];
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

export default async function OfficialQueuePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const params = await searchParams;
  const filters = {
    q: params.q,
    type: asType(params.type),
    status: asStatus(params.status),
    priority: asPriority(params.priority),
    from: params.from,
    to: params.to,
  };

  const complaints = await listComplaintsForOfficials(filters);

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
        <Button asChild variant="outline">
          <Link href="/map">Map view</Link>
        </Button>
      </div>

      <QueueFilters filters={params} />

      <div className="glass-panel overflow-hidden rounded-[1.5rem]">
        <table className="w-full min-w-[720px] text-left text-sm">
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
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-14 text-center text-ink-muted"
                >
                  No complaints match these filters.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
