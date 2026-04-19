import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, canManageCourse } from "@courseadvice/auth/admin";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.id, id))
      .limit(1);

    const course = rows[0];
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (err) {
    console.error("[GET /api/courses/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.id, id))
      .limit(1);

    const existing = rows[0];
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Look up the institution id for the course's institution name
    const institutionRows = await db
      .select()
      .from(schema.institutions)
      .where(eq(schema.institutions.name, existing.institution))
      .limit(1);

    const institutionId = institutionRows[0]?.id ?? existing.institution;

    if (!canManageCourse(adminUser, institutionId)) {
      return NextResponse.json({ error: "Forbidden: cannot manage this course" }, { status: 403 });
    }

    const body = await req.json();
    const { id: _ignored, createdAt: _ca, ...updates } = body;

    const [updated] = await db
      .update(schema.courses)
      .set(updates)
      .where(eq(schema.courses.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/courses/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const rows = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.id, id))
      .limit(1);

    const existing = rows[0];
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const institutionRows = await db
      .select()
      .from(schema.institutions)
      .where(eq(schema.institutions.name, existing.institution))
      .limit(1);

    const institutionId = institutionRows[0]?.id ?? existing.institution;

    if (!canManageCourse(adminUser, institutionId)) {
      return NextResponse.json({ error: "Forbidden: cannot manage this course" }, { status: 403 });
    }

    await db.delete(schema.courses).where(eq(schema.courses.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/courses/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
