import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, canManageInstitution, isSuperadmin } from "@courseadvice/auth/admin";
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
      .from(schema.institutions)
      .where(eq(schema.institutions.id, id))
      .limit(1);

    const institution = rows[0];
    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    return NextResponse.json(institution);
  } catch (err) {
    console.error("[GET /api/institutions/[id]]", err);
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

    if (!canManageInstitution(adminUser, id)) {
      return NextResponse.json({ error: "Forbidden: cannot manage this institution" }, { status: 403 });
    }

    const rows = await db
      .select()
      .from(schema.institutions)
      .where(eq(schema.institutions.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id: _ignored, createdAt: _ca, ...updates } = body;

    const [updated] = await db
      .update(schema.institutions)
      .set(updates)
      .where(eq(schema.institutions.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/institutions/[id]]", err);
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
      .from(schema.institutions)
      .where(eq(schema.institutions.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    await db.delete(schema.institutions).where(eq(schema.institutions.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/institutions/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
