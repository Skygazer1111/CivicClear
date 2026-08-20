import { auth } from "@/lib/auth";

export default async function OfficialQueuePage() {
  const session = await auth();

  return (
    <div className="rise-in">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Complaint queue
      </h1>
      <p className="mt-2 text-ink-muted">
        Signed in as {session?.user?.name}. Oldest unverified reports appear
        first.
      </p>

      <div className="glass-panel mt-8 overflow-hidden rounded-[1.5rem]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line/70 bg-white/40 text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-5 py-14 text-center text-ink-muted">
                No complaints in the queue.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
