import { NextRequest, NextResponse } from "next/server";
import { getCourses, createCourse } from "@/lib/db/queries";
import { getAuth } from "@/lib/auth";
import { getUserById } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const level = searchParams.get("level") ?? undefined;
  const delivery = searchParams.get("delivery") ?? undefined;

  const courses = await getCourses({ search, category, level, delivery });
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const course = await createCourse(body);
  return NextResponse.json(course, { status: 201 });
}
