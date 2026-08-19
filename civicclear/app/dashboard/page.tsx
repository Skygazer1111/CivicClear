import { auth } from "@/lib/auth";

export default async function CitizenDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Welcome, {session?.user?.name}. You have no reports yet.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Open" value="0" />
        <Stat label="In progress" value="0" />
        <Stat label="Resolved" value="0" />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-sm font-medium">Your reports</h2>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-muted">No reports yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Reporting opens in the next phase.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white px-4 py-3">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
