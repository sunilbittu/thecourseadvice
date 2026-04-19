import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { asc } from "drizzle-orm";
import { CategoriesClient } from "./categories-client";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requireSuperadmin();

  const categories = await db
    .select()
    .from(schema.categories)
    .orderBy(asc(schema.categories.sortOrder));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage course categories, icons, and display order.
        </p>
      </div>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
