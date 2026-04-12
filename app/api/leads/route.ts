import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getLeads, getUserById } from "@/lib/db/queries";

export async function GET() {
  const { userId } = await getAuth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user || user.role !== "institution-admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // TODO: resolve institutionId from user's profile
  const leads = await getLeads("1");
  return NextResponse.json(leads);
}
