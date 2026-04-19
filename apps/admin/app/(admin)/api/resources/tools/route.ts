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
    const tools = await db
      .select()
      .from(schema.scholarlyTools)
      .orderBy(asc(schema.scholarlyTools.name));

    return NextResponse.json(tools);
  } catch (err) {
    console.error("[GET /api/resources/tools]", err);
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
    const { name, description, icon, url } = body;

    if (!name || !description || !icon || !url) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, icon, url" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    const [tool] = await db
      .insert(schema.scholarlyTools)
      .values({ id, name, description, icon, url })
      .returning();

    return NextResponse.json(tool, { status: 201 });
  } catch (err) {
    console.error("[POST /api/resources/tools]", err);
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
      .from(schema.scholarlyTools)
      .where(eq(schema.scholarlyTools.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(schema.scholarlyTools)
      .set(updates)
      .where(eq(schema.scholarlyTools.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/resources/tools]", err);
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
      .from(schema.scholarlyTools)
      .where(eq(schema.scholarlyTools.id, id))
      .limit(1);

    if (!rows[0]) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    await db.delete(schema.scholarlyTools).where(eq(schema.scholarlyTools.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/resources/tools]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
