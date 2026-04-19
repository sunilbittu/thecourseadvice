import { NextResponse } from "next/server";
import { db } from "@courseadvice/db";
import { users } from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@courseadvice/auth/password";
import { createSessionToken, COOKIE_NAME } from "@courseadvice/auth/jwt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
      role: "student",
      avatar: "",
      bio: "",
      socialLinks: {},
    });

    const token = await createSessionToken({ userId: id, email, role: "student" });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
