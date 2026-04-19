import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser } from "@courseadvice/db/queries";
import { getAuth } from "@courseadvice/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await getAuth();
  const { id } = await params;

  // Users can only edit their own profile
  if (!userId || userId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await updateUser(id, body);
  return NextResponse.json(updated);
}
