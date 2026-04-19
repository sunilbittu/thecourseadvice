import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireInstitutionAdmin, canManageCourse } from "@courseadvice/auth/admin";
import type { Course, Category, Institution } from "@courseadvice/types";
import { CourseFormClient } from "./course-form-client";

export const dynamic = "force-dynamic";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;

  const adminUser = await requireInstitutionAdmin();

  const [courseRows, categoryRows, institutionRows] = await Promise.all([
    db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.id, id))
      .limit(1),
    db
      .select({ id: schema.categories.id, name: schema.categories.name })
      .from(schema.categories)
      .orderBy(schema.categories.name),
    db
      .select({ id: schema.institutions.id, name: schema.institutions.name })
      .from(schema.institutions)
      .orderBy(schema.institutions.name),
  ]);

  const row = courseRows[0];
  if (!row) notFound();

  if (!canManageCourse(adminUser, row.institution)) {
    notFound();
  }

  const course: Course = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    instructor: row.instructor,
    price: row.price,
    rating: row.rating,
    reviewCount: row.reviewCount,
    studentCount: row.studentCount,
    category: row.category,
    level: row.level as Course["level"],
    duration: row.duration,
    language: row.language,
    delivery: row.delivery as Course["delivery"],
    certification: row.certification,
    image: row.image,
    institution: row.institution,
    curriculum: row.curriculum as Course["curriculum"],
    perks: row.perks as string[],
    status: row.status as Course["status"],
  };

  const categories = categoryRows as Pick<Category, "id" | "name">[];
  const institutions = institutionRows as Pick<Institution, "id" | "name">[];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
        <p className="mt-1 text-sm text-muted-foreground">{course.title}</p>
      </div>
      <CourseFormClient
        categories={categories}
        institutions={institutions}
        initialData={course}
        courseId={id}
      />
    </div>
  );
}
