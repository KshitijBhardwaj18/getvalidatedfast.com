import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NEXT_REQUEST_META } from "next/dist/server/request-meta";

export async function GET(
  _req: Request,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { success: false, error: "Missing Client Id" },
      { status: 400 }
    );
  }

  const widget = await db.widget.findFirst({
    where: { clientId, isActive: true },
    select: {
      title: true,
      description: true,
      settings: true,
    },
  });
  if (!widget) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(widget, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
