export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById, getCategories } from "@/lib/db/queries";
import NewCourseClient from "./new-course-client";

export default async function NewCoursePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") redirect("/");

  const categories = await getCategories();
  return <NewCourseClient categories={categories.map((c) => c.name)} />;
}
