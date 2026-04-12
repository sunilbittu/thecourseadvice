import { NextResponse } from "next/server";
import analytics from "@/lib/data/analytics.json";

export async function GET() {
  return NextResponse.json(analytics);
}
