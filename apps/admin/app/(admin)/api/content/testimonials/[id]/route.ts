import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id: _ignored, createdAt: _ca, ...updates } = body;

    const [updated] = await db
      .update(schema.testimonials)
      .set(updates)
      .where(eq(schema.testimonials.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/content/testimonials/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/content/testimonials/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
