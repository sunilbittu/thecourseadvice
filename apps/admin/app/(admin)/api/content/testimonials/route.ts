import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { asc, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const testimonials = await db
      .select()
      .from(schema.testimonials)
      .orderBy(asc(schema.testimonials.sortOrder), desc(schema.testimonials.createdAt));

    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("[GET /api/content/testimonials]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, role, quote, avatar, rating, featured, sortOrder } = body;

    if (!name || !role || !quote) {
      return NextResponse.json({ error: "Missing required fields: name, role, quote" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const [testimonial] = await db
      .insert(schema.testimonials)
      .values({
        id,
        name,
        role,
        quote,
        avatar: avatar ?? "",
        rating: rating ?? 5,
        featured: featured ?? false,
        sortOrder: sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    console.error("[POST /api/content/testimonials]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
