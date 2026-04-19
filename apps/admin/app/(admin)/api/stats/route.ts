import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { getAdminUser } from "@courseadvice/auth/admin";
import { count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const adminUser = await getAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [coursesResult, institutionsResult, usersResult, enrollmentsResult] = await Promise.all([
      db.select({ value: count() }).from(schema.courses),
      db.select({ value: count() }).from(schema.institutions),
      db.select({ value: count() }).from(schema.users),
      db.select({ value: count() }).from(schema.enrollments),
    ]);

    return NextResponse.json({
      totalCourses: coursesResult[0]?.value ?? 0,
      totalInstitutions: institutionsResult[0]?.value ?? 0,
      totalUsers: usersResult[0]?.value ?? 0,
      totalEnrollments: enrollmentsResult[0]?.value ?? 0,
    });
  } catch (err) {
    console.error("[GET /api/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
