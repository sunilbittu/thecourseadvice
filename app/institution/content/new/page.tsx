export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById, getContentCategories } from "@/lib/db/queries";
import NewContentClient from "./new-content-client";

export default async function NewContentPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") redirect("/");

  const categories = await getContentCategories();
  return <NewContentClient categories={categories} />;
}
