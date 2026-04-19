import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const institutions = await db
      .select()
      .from(schema.institutions)
      .orderBy(asc(schema.institutions.name));

    return NextResponse.json(institutions);
  } catch (err) {
    console.error("[GET /api/institutions]", err);
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
    const {
      name,
      slug,
      logo,
      location,
      description,
      website,
      email,
      phone,
      founded,
      socialLinks,
      featured,
    } = body;

    if (!name || !slug || !logo || !location) {
      return NextResponse.json({ error: "Missing required fields: name, slug, logo, location" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const [institution] = await db
      .insert(schema.institutions)
      .values({
        id,
        name,
        slug,
        logo,
        location,
        description: description ?? "",
        website: website ?? null,
        email: email ?? null,
        phone: phone ?? null,
        founded: founded ?? null,
        socialLinks: socialLinks ?? {},
        featured: featured ?? false,
      })
      .returning();

    return NextResponse.json(institution, { status: 201 });
  } catch (err) {
    console.error("[POST /api/institutions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
