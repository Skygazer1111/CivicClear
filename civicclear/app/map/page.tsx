import Link from "next/link";
import type { ComplaintStatus, ComplaintType, Priority } from "@prisma/client";
import { auth } from "@/features/auth/auth";
import { listComplaintsForOfficials } from "@/features/official/queue";
import {
  OfficialComplaintsMap,
  type MapComplaint,
} from "@/features/official/components/complaints-map-dynamic";
import { QueueFilters } from "@/features/official/components/queue-filters";
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

export default async function OfficialMapPage({
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
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Complaint map
          </h1>
          <p className="mt-2 text-ink-muted">
            Signed in as {session?.user?.name}. Click a pin for a summary.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/queue">Queue view</Link>
        </Button>
      </div>

      <QueueFilters filters={params} action="/map" />
      <OfficialComplaintsMap complaints={mapped} />
    </div>
  );
}
