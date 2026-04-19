import { NextResponse } from "next/server";
import { getCategories } from "@courseadvice/db/queries";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}
