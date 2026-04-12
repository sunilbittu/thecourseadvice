import { NextResponse } from "next/server";
import institutions from "@/lib/data/institutions.json";

export async function GET() {
  return NextResponse.json(institutions);
}
