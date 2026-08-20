import Link from "next/link";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/shared/db/prisma";
import { StatusBadge } from "@/features/complaints/components/status-badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";

export default async function CitizenDashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [complaints, user] = await Promise.all([
    prisma.complaint.findMany({
      where: { citizenId: userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    }),
  ]);

  const open = complaints.filter(
    (c) => c.status === "submitted" || c.status === "verified",
  ).length;
  const inProgress = complaints.filter((c) => c.status === "in_progress").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  return (
    <div className="rise-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-ink-muted">
            Welcome, {session?.user?.name}. Track and file civic reports here.
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Points balance:{" "}
            <Link
              href="/profile"
              className="font-semibold text-accent hover:underline"
            >
              {user?.points ?? 0}
            </Link>
          </p>
        </div>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/complaints/new">Report an issue</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Open" value={String(open)} />
        <Stat label="In progress" value={String(inProgress)} />
        <Stat label="Resolved" value={String(resolved)} />
      </div>

      <section className="glass-panel mt-8 overflow-hidden rounded-[1.5rem]">
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
          <h2 className="font-display text-xl font-semibold">Your reports</h2>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            title="No reports yet"
            description="File a civic issue with a photo and location."
            actionHref="/complaints/new"
            actionLabel="Report an issue"
          />
        ) : (
          <>
            <ul className="divide-y divide-line/60 md:hidden">
              {complaints.map((complaint) => (
                <li key={complaint.id}>
                  <Link
                    href={`/complaints/${complaint.id}`}
                    className="block px-5 py-4 hover:bg-white/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-accent">
                          {complaint.publicRef}
                        </p>
                        <p className="mt-1 font-medium">{complaint.title}</p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {COMPLAINT_TYPE_LABELS[complaint.type]} ·{" "}
                          {complaint.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/40 text-ink-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Reference</th>
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Filed</th>
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
                          href={`/complaints/${complaint.id}`}
                          className="font-medium text-accent hover:underline"
                        >
                          {complaint.publicRef}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-ink">{complaint.title}</td>
                      <td className="px-5 py-3 text-ink-muted">
                        {COMPLAINT_TYPE_LABELS[complaint.type]}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-5 py-3 text-ink-muted">
                        {complaint.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-[1.35rem] px-5 py-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}
