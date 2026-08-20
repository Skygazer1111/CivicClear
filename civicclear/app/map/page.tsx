import Link from "next/link";
import { auth } from "@/features/auth/auth";
import { listComplaintsForOfficials } from "@/features/official/queue";
import {
  OfficialComplaintsMap,
  type MapComplaint,
} from "@/features/official/components/complaints-map-dynamic";
import { QueueFilters } from "@/features/official/components/queue-filters";
import { parseQueueFilters } from "@/features/official/parse-filters";
import { Button } from "@/shared/ui/button";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
}>;

export default async function OfficialMapPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const params = await searchParams;
  const filters = parseQueueFilters(params);

  const complaints = await listComplaintsForOfficials(filters);
  const mapped: MapComplaint[] = complaints
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => ({
      id: c.id,
      publicRef: c.publicRef,
      title: c.title,
      type: c.type,
      status: c.status,
      priority: c.priority,
      addressText: c.addressText,
      lat: c.lat as number,
      lng: c.lng as number,
    }));

  return (
    <div className="rise-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="page-kicker">Official</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
            Complaint map
          </h1>
          <p className="mt-2 text-ink-muted">
            Signed in as {session?.user?.name}. Nearby pins cluster at wider
            zoom.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/queue">Queue view</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics">Analytics</Link>
          </Button>
        </div>
      </div>

      <QueueFilters filters={params} action="/map" />
      <OfficialComplaintsMap complaints={mapped} />
    </div>
  );
}
