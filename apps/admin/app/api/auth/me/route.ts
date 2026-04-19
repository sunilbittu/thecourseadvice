import { NextResponse } from "next/server";
import { verifySessionToken } from "@courseadvice/auth/jwt";
import { db } from "@courseadvice/db";
import { users } from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await verifySessionToken();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (user.role !== "superadmin" && user.role !== "institution-admin") {
    return NextResponse.json({ user: null }, { status: 403 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      institutionId: user.institutionId,
    },
  });
}
