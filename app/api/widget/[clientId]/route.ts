import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NEXT_REQUEST_META } from "next/dist/server/request-meta";

export async function GET(
  _req: Request,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = await  params;

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
  console.log(widget?.settings)
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

export async function POST(
  req: Request,
  {params}: {params: Promise<{clientId: string}>}
) {
  const body = await req.json();
  
  const {clientId} = await params;

  if(!clientId){
    return NextResponse.json(
      {success: false, error: "Missing client id"},
      {status: 400}
    )
  }

  const widget = await db.widget.findFirst({
    where: {clientId, isActive: true},
  })

  if(!widget){
    return NextResponse.json({error: "Not found"}, {status: 404});
  }

  console.log(body.content)
  return NextResponse.json({success:true}, {status: 200})
  
}
