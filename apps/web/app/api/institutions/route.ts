import { NextResponse } from "next/server";
import { getInstitutions } from "@courseadvice/db/queries";

export async function GET() {
  const institutions = await getInstitutions();
  return NextResponse.json(institutions);
}
