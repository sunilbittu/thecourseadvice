import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const categories = await db
      .select()
      .from(schema.resourceCategories)
      .orderBy(asc(schema.resourceCategories.name));

    return NextResponse.json(categories);
  } catch (err) {
    console.error("[GET /api/resources/categories]", err);
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
    const { name, description, assetCount } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Missing required fields: name, description" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const [category] = await db
      .insert(schema.resourceCategories)
      .values({
        id,
        name,
        description,
        assetCount: assetCount ?? 0,
      })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[POST /api/resources/categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(schema.resourceCategories)
      .where(eq(schema.resourceCategories.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Resource category not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(schema.resourceCategories)
      .set(updates)
      .where(eq(schema.resourceCategories.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/resources/categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(schema.resourceCategories)
      .where(eq(schema.resourceCategories.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Resource category not found" }, { status: 404 });
    }

    await db.delete(schema.resourceCategories).where(eq(schema.resourceCategories.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/resources/categories]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
