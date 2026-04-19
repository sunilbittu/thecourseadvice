import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { asc } from "drizzle-orm";
import { ContentClient } from "./content-client";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireSuperadmin();

  const rows = await db
    .select()
    .from(schema.siteContent)
    .orderBy(asc(schema.siteContent.section), asc(schema.siteContent.sortOrder));

  // Group by section
  const grouped: Record<string, typeof rows> = {};
  for (const row of rows) {
    if (!grouped[row.section]) grouped[row.section] = [];
    grouped[row.section].push(row);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Homepage Content</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit homepage section content. Changes are saved per field.
        </p>
      </div>
      <ContentClient initialGrouped={grouped} />
    </div>
  );
}
