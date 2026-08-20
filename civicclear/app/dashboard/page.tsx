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
          <p className="page-kicker">Citizen</p>
          <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-ink-muted sm:text-base">
            Welcome, {session?.user?.name}. Track and file civic reports here.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
            <span className="text-ink-muted">Points</span>
            <Link
              href="/profile"
              className="font-semibold text-accent hover:underline"
            >
              {user?.points ?? 0}
            </Link>
          </p>
        </div>
        <Button asChild size="lg" className="hidden w-full sm:flex sm:w-auto">
          <Link href="/complaints/new">Report an issue</Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
        <Stat label="Open" value={String(open)} />
        <Stat label="In progress" value={String(inProgress)} />
        <Stat label="Resolved" value={String(resolved)} />
      </div>

      <section className="glass-panel mt-6 overflow-hidden rounded-[1.5rem] sm:mt-8 sm:rounded-[1.75rem]">
        <div className="flex items-center justify-between border-b border-line/50 px-4 py-3.5 sm:px-5 sm:py-4">
          <h2 className="font-display text-lg font-semibold sm:text-xl">
            Your reports
          </h2>
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
                    className="tap-row block px-4 py-4 active:bg-white/50 sm:px-5"
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
    <div className="glass-panel stat-tile rounded-[1.15rem] px-3 py-3 sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      <p className="text-[0.7rem] font-medium leading-tight text-ink-muted sm:text-sm">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:mt-2 sm:text-4xl">
        {value}
      </p>
    </div>
  );
}
