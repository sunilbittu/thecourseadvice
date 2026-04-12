import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/db/queries";
import { getAuth } from "@/lib/auth";

export async function GET() {
  const { userId } = await getAuth();
  const data = await getDashboardData(userId ?? "1");
  return NextResponse.json(data);
}
