import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import {
  getUserById,
  getContentPosts,
  getContentCRMData,
  createContentPost,
  getContentCategories,
} from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  const institutionId = "1"; // from user context

  if (view === "crm") {
    const data = await getContentCRMData(institutionId);
    return NextResponse.json(data);
  }

  if (view === "categories") {
    const categories = await getContentCategories();
    return NextResponse.json(categories);
  }

  const posts = await getContentPosts(institutionId, { status, search, category });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const post = await createContentPost({
    ...body,
    authorId: userId,
    authorName: user.name,
    institutionId: "1",
  });

  return NextResponse.json(post, { status: 201 });
}
