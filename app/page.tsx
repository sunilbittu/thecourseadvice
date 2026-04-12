export const dynamic = "force-dynamic";

import HomeClient from "./home-client";
import { getCourses, getCategories, getInstitutions } from "@/lib/db/queries";

export default async function HomePage() {
  const [courses, categories, institutions] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstitutions(),
  ]);

  return <HomeClient courses={courses} categories={categories} institutions={institutions} />;
}
