import { auth } from "@/features/auth/auth";
import { getOfficialAnalytics } from "@/features/official/analytics";
import { AnalyticsCharts } from "@/features/official/components/analytics-charts";
import { QueueFilters } from "@/features/official/components/queue-filters";
import { filtersToSearchParams, parseQueueFilters } from "@/features/official/parse-filters";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

type SearchParams = Promise<{
  q?: string;
  type?: string;
  status?: string;
  priority?: string;
  from?: string;
  to?: string;
}>;

export default async function OfficialAnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const params = await searchParams;
  const filters = parseQueueFilters(params, { defaultLastDays: 30 });
  const data = await getOfficialAnalytics(filters);
  const exportQuery = filtersToSearchParams(filters).toString();

  return (
    <div className="rise-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Analytics
          </h1>
          <p className="mt-2 text-ink-muted">
            Signed in as {session?.user?.name}. Defaults to the last 30 days.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/queue">Queue</Link>
          </Button>
          <Button asChild>
            <a href={`/api/official/export${exportQuery ? `?${exportQuery}` : ""}`}>
              Download CSV
            </a>
          </Button>
        </div>
      </div>

      <QueueFilters
        filters={{
          q: filters.q,
          type: filters.type ?? "all",
          status: filters.status ?? "all",
          priority: filters.priority ?? "all",
          from: filters.from,
          to: filters.to,
        }}
        action="/analytics"
      />

      <AnalyticsCharts data={data} />
    </div>
  );
}
