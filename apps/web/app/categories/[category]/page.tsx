export const dynamic = "force-dynamic";

import CategoryClient from "./category-client";
import { getCourses, getCategories } from "@courseadvice/db/queries";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const selectedCategory = decodeURIComponent(category);

  const [courses, allCategories] = await Promise.all([
    getCourses({ category: selectedCategory }),
    getCategories(),
  ]);

  return (
    <CategoryClient
      category={selectedCategory}
      courses={courses}
      allCategories={allCategories}
    />
  );
}
