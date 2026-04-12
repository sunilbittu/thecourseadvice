import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { updateLeadStatus, getUserById } from "@/lib/db/queries";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();
  await updateLeadStatus(id, status);
  return NextResponse.json({ success: true });
}
