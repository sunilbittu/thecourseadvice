import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getShortlist, addToShortlist, removeFromShortlist } from "@/lib/db/queries";

export async function GET() {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shortlist = await getShortlist(userId);
  return NextResponse.json(shortlist);
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  await addToShortlist(userId, courseId);
  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  await removeFromShortlist(userId, courseId);
  return NextResponse.json({ success: true });
}
