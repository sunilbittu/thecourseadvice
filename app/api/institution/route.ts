import { NextResponse } from "next/server";
import institutionDashboard from "@/lib/data/institution-dashboard.json";

export async function GET() {
  return NextResponse.json(institutionDashboard);
}
