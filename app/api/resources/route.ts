import { NextResponse } from "next/server";
import resources from "@/lib/data/resources.json";

export async function GET() {
  return NextResponse.json(resources);
}
