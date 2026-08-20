import { NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { buildComplaintPdf } from "@/features/official/export-pdf";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: Request,
  context: { params: Params },
) {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "official" && session.user.role !== "admin")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const pdf = await buildComplaintPdf(id);
  if (!pdf) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(Buffer.from(pdf.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdf.filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
