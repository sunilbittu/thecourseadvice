import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { requireInstitutionAdmin } from "@courseadvice/auth/admin";
import type { Category, Institution } from "@courseadvice/types";
import { CourseFormClient } from "./course-form-client";

export const dynamic = "force-dynamic";

export default async function NewCoursePage() {
  await requireInstitutionAdmin();

  const [categoryRows, institutionRows] = await Promise.all([
    db
      .select({ id: schema.categories.id, name: schema.categories.name })
      .from(schema.categories)
      .orderBy(schema.categories.name),
    db
      .select({ id: schema.institutions.id, name: schema.institutions.name })
      .from(schema.institutions)
      .orderBy(schema.institutions.name),
  ]);

  const categories = categoryRows as Pick<Category, "id" | "name">[];
  const institutions = institutionRows as Pick<Institution, "id" | "name">[];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new course listing
        </p>
      </div>
      <CourseFormClient categories={categories} institutions={institutions} />
    </div>
  );
}
