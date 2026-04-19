import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { ResourcesClient } from "./resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  await requireSuperadmin();

  const [resourceCategories, featuredAssets, scholarlyTools] = await Promise.all([
    db.select().from(schema.resourceCategories),
    db.select().from(schema.featuredAssets),
    db.select().from(schema.scholarlyTools),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage resource categories, featured assets, and scholarly tools.
        </p>
      </div>
      <ResourcesClient
        initialCategories={resourceCategories}
        initialAssets={featuredAssets}
        initialTools={scholarlyTools}
      />
    </div>
  );
}
