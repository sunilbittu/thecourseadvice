import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContentEntry {
  id?: string;
  section: string;
  key: string;
  value: string;
  metadata?: Record<string, unknown>;
  sortOrder?: number;
}

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const content = await db
      .select()
      .from(schema.siteContent)
      .orderBy(asc(schema.siteContent.section), asc(schema.siteContent.sortOrder));

    return NextResponse.json(content);
  } catch (err) {
    console.error("[GET /api/content]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser || !isSuperadmin(adminUser)) {
    return NextResponse.json({ error: "Forbidden: superadmin access required" }, { status: 403 });
  }

  try {
    const body: ContentEntry[] = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array of content entries" }, { status: 400 });
    }

    const results: (typeof schema.siteContent.$inferSelect)[] = [];

    for (const entry of body) {
      const { id, section, key, value, metadata, sortOrder } = entry;

      if (!section || !key || value == null) {
        return NextResponse.json(
          { error: `Missing required fields (section, key, value) in entry: ${JSON.stringify(entry)}` },
          { status: 400 }
        );
      }

      if (id) {
        // Check if exists — upsert by id
        const existing = await db
          .select()
          .from(schema.siteContent)
          .where(eq(schema.siteContent.id, id))
          .limit(1);

        if (existing[0]) {
          const [updated] = await db
            .update(schema.siteContent)
            .set({
              section,
              key,
              value,
              metadata: metadata ?? null,
              sortOrder: sortOrder ?? 0,
              updatedAt: new Date(),
            })
            .where(eq(schema.siteContent.id, id))
            .returning();
          results.push(updated);
        } else {
          const [inserted] = await db
            .insert(schema.siteContent)
            .values({
              id,
              section,
              key,
              value,
              metadata: metadata ?? null,
              sortOrder: sortOrder ?? 0,
            })
            .returning();
          results.push(inserted);
        }
      } else {
        const newId = crypto.randomUUID();
        const [inserted] = await db
          .insert(schema.siteContent)
          .values({
            id: newId,
            section,
            key,
            value,
            metadata: metadata ?? null,
            sortOrder: sortOrder ?? 0,
          })
          .returning();
        results.push(inserted);
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("[PUT /api/content]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
