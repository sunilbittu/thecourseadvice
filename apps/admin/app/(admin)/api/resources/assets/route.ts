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
    const assets = await db
      .select()
      .from(schema.featuredAssets)
      .orderBy(asc(schema.featuredAssets.title));

    return NextResponse.json(assets);
  } catch (err) {
    console.error("[GET /api/resources/assets]", err);
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
    const { title, type, description, image, downloadUrl } = body;

    if (!title || !type || !description || !image || !downloadUrl) {
      return NextResponse.json(
        { error: "Missing required fields: title, type, description, image, downloadUrl" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    const [asset] = await db
      .insert(schema.featuredAssets)
      .values({ id, title, type, description, image, downloadUrl })
      .returning();

    return NextResponse.json(asset, { status: 201 });
  } catch (err) {
    console.error("[POST /api/resources/assets]", err);
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
      .from(schema.featuredAssets)
      .where(eq(schema.featuredAssets.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(schema.featuredAssets)
      .set(updates)
      .where(eq(schema.featuredAssets.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/resources/assets]", err);
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
      .from(schema.featuredAssets)
      .where(eq(schema.featuredAssets.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    await db.delete(schema.featuredAssets).where(eq(schema.featuredAssets.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/resources/assets]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
