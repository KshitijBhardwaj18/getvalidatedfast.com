import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NEXT_REQUEST_META } from "next/dist/server/request-meta";
import { Prisma } from "@prisma/client";

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

// {
//   content: {
//     type: 'feedback',
//     npsScore: '4',
//     feedback: 'Very good but need polishing very hard . need to work on this lets go!!'
//   },
//   browser: 'Mozilla/5.0',
//   os: 'MacIntel',
//   device: 'desktop',
//   language: 'en',
//   url: 'http://localhost:3000/widget/cmhomdcnu0000xui45j0wm43x',
//   timestamp: '2025-11-07T15:40:56.330Z'
// }

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

  console.log(body)
  // to do add ip country and city
  const response = await db.response.create({data:{
    type: body.submissionType,
    widgetId: widget.id,
    surveyType: body.surveyType,
    content: body.content as Prisma.InputJsonValue,
    browser: body.browser,
    os: body.os,
    device: body.device,
    url: body.url
  }})

   return NextResponse.json({success:true}, {status: 200})
  
}
