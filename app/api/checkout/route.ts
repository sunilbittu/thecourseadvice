import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getCourseBySlug } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseSlug } = await request.json();
  const course = await getCourseBySlug(courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: `${course.duration} · ${course.institution} · ${course.level}`,
            images: course.image ? [`${origin}${course.image}`] : [],
          },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      courseId: course.id,
    },
    success_url: `${origin}/dashboard?enrolled=${course.slug}`,
    cancel_url: `${origin}/courses/${course.slug}`,
  });

  return NextResponse.json({ url: session.url });
}
