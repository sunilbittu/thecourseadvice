import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@courseadvice/auth";
import { updateEnrollmentProgress } from "@courseadvice/db/queries";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: courseId } = await params;
  const { progress } = await request.json();

  await updateEnrollmentProgress(userId, courseId, progress);
  return NextResponse.json({ success: true });
}
