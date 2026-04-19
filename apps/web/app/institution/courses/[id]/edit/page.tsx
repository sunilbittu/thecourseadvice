export const dynamic = "force-dynamic";

import { getAuth } from "@courseadvice/auth";
import { redirect } from "next/navigation";
import { getUserById, getCategories } from "@courseadvice/db/queries";
import { db } from "@courseadvice/db";
import { courses } from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";
import EditCourseClient from "./edit-course-client";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await getAuth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") redirect("/");

  const { id } = await params;
  const rows = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!rows[0]) redirect("/institution");

  const categories = await getCategories();
  const course = rows[0];

  return (
    <EditCourseClient
      course={{
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        price: course.price,
        category: course.category,
        level: course.level,
        duration: course.duration,
        language: course.language,
        delivery: course.delivery,
        certification: course.certification,
        image: course.image,
        institution: course.institution,
        curriculum: course.curriculum as { title: string; duration: string; lessons: number }[],
        perks: course.perks as string[],
      }}
      categories={categories.map((c) => c.name)}
    />
  );
}
