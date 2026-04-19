import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@courseadvice/auth";
import { getEnrollments, createEnrollment } from "@courseadvice/db/queries";

export async function GET() {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await getEnrollments(userId);
  return NextResponse.json(enrollments);
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  await createEnrollment(userId, courseId);
  return NextResponse.json({ success: true }, { status: 201 });
}
