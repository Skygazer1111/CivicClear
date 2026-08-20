import { NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { buildComplaintsCsv } from "@/features/official/export-csv";
import { parseQueueFilters } from "@/features/official/parse-filters";

export async function GET(request: Request) {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "official" && session.user.role !== "admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = parseQueueFilters({
    q: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const csv = await buildComplaintsCsv(filters);
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="civicclear-complaints-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
