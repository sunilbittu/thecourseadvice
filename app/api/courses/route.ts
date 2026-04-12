import { NextRequest, NextResponse } from "next/server";
import courses from "@/lib/data/courses.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const category = searchParams.get("category");
  const level = searchParams.get("level");
  const delivery = searchParams.get("delivery");

  let filtered = [...courses];

  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.instructor.toLowerCase().includes(search)
    );
  }

  if (category) {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (level) {
    filtered = filtered.filter((c) => c.level === level);
  }

  if (delivery) {
    filtered = filtered.filter((c) => c.delivery === delivery);
  }

  return NextResponse.json(filtered);
}
