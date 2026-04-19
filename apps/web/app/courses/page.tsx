export const dynamic = "force-dynamic";

import { getCategories, getCourses } from "@courseadvice/db/queries";
import CoursesClient from "./courses-client";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category ? decodeURIComponent(params.category) : "";

  const [courses, categories] = await Promise.all([getCourses(), getCategories()]);

  return (
    <CoursesClient
      courses={courses}
      categories={categories}
      initialCategory={initialCategory}
    />
  );
}
