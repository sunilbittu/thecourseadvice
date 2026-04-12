import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/db/queries";
import { getAuth } from "@/lib/auth";

export async function GET() {
  const { userId: _userId } = await getAuth();
  // TODO: resolve institutionId from user's profile
  const data = await getAnalyticsData("1");
  return NextResponse.json(data);
}
