import { NextResponse } from "next/server";
import dashboard from "@/lib/data/dashboard.json";

export async function GET() {
  return NextResponse.json(dashboard);
}
