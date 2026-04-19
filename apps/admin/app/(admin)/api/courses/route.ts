import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (isSuperadmin(adminUser)) {
      const courses = await db
        .select()
        .from(schema.courses)
        .orderBy(desc(schema.courses.createdAt));
      return NextResponse.json(courses);
    }

    // institution-admin: filter by their institution name
    if (!adminUser.institutionId) {
      return NextResponse.json([], { status: 200 });
    }

    const institutions = await db
      .select()
      .from(schema.institutions)
      .where(eq(schema.institutions.id, adminUser.institutionId))
      .limit(1);

    const institution = institutions[0];
    if (!institution) {
      return NextResponse.json([], { status: 200 });
    }

    const courses = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.institution, institution.name))
      .orderBy(desc(schema.courses.createdAt));

    return NextResponse.json(courses);
  } catch (err) {
    console.error("[GET /api/courses]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const {
      title,
      description,
      instructor,
      price,
      rating,
      reviewCount,
      studentCount,
      category,
      level,
      duration,
      language,
      delivery,
      certification,
      image,
      institution,
      curriculum,
      perks,
      status,
    } = body;

    if (!title || !description || !instructor || price == null || !category || !level || !duration || !delivery || !image || !institution) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const slug = slugify(title);

    const [course] = await db
      .insert(schema.courses)
      .values({
        id,
        slug,
        title,
        description,
        instructor,
        price,
        rating: rating ?? 0,
        reviewCount: reviewCount ?? 0,
        studentCount: studentCount ?? 0,
        category,
        level,
        duration,
        language: language ?? "English",
        delivery,
        certification: certification ?? false,
        image,
        institution,
        curriculum: curriculum ?? [],
        perks: perks ?? [],
        status: status ?? "published",
      })
      .returning();

    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    console.error("[POST /api/courses]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
