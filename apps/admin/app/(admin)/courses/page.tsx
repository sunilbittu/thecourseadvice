import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { eq, desc } from "drizzle-orm";
import { getAdminUser } from "@courseadvice/auth/admin";
import type { Course } from "@courseadvice/types";
import { CoursesClient } from "./courses-client";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const adminUser = await getAdminUser();

  let rows: (typeof schema.courses.$inferSelect)[];

  if (adminUser?.role === "institution-admin" && adminUser.institutionId) {
    const instRows = await db
      .select({ name: schema.institutions.name })
      .from(schema.institutions)
      .where(eq(schema.institutions.id, adminUser.institutionId))
      .limit(1);

    const instName = instRows[0]?.name;

    if (instName) {
      rows = await db
        .select()
        .from(schema.courses)
        .where(eq(schema.courses.institution, instName))
        .orderBy(desc(schema.courses.createdAt));
    } else {
      rows = [];
    }
  } else {
    rows = await db
      .select()
      .from(schema.courses)
      .orderBy(desc(schema.courses.createdAt));
  }

  const courses: Course[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    instructor: r.instructor,
    price: r.price,
    rating: r.rating,
    reviewCount: r.reviewCount,
    studentCount: r.studentCount,
    category: r.category,
    level: r.level as Course["level"],
    duration: r.duration,
    language: r.language,
    delivery: r.delivery as Course["delivery"],
    certification: r.certification,
    image: r.image,
    institution: r.institution,
    curriculum: r.curriculum as Course["curriculum"],
    perks: r.perks as string[],
    status: r.status as Course["status"],
  }));

  return <CoursesClient courses={courses} />;
}
