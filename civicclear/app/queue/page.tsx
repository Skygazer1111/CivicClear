import { auth } from "@/lib/auth";

export default async function OfficialQueuePage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Complaint queue</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Signed in as {session?.user?.name}. Oldest unverified reports will appear
        here first.
      </p>

      <div className="mt-8 overflow-hidden rounded-md border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-ink-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Reference</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-ink-muted">
                No complaints in the queue.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
