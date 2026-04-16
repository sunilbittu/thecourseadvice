export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getUserById, getContentPostById, getContentCategories } from "@/lib/db/queries";
import EditContentClient from "./edit-content-client";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") redirect("/");

  const { id } = await params;
  const post = await getContentPostById(id);
  if (!post) notFound();

  const categories = await getContentCategories();
  return <EditContentClient post={post} categories={categories} />;
}
