import { verifySessionToken } from "./jwt";
import { db, hasDatabase } from "@courseadvice/db";
import { users } from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";

export type AdminRole = "superadmin" | "institution-admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  institutionId: string | null;
}

/** Returns the current user if they have an admin role, otherwise null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const session = await verifySessionToken();
  if (!session) return null;

  if (!hasDatabase()) return null;

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = rows[0];
  if (!user) return null;

  if (user.role !== "superadmin" && user.role !== "institution-admin") {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AdminRole,
    institutionId: user.institutionId,
  };
}

/** Throws a Response error if the user is not a superadmin. Returns the admin user. */
export async function requireSuperadmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user || user.role !== "superadmin") {
    throw new Response("Forbidden: superadmin access required", { status: 403 });
  }
  return user;
}

/** Throws a Response error if the user is not an admin (superadmin or institution-admin). Returns the admin user. */
export async function requireInstitutionAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    throw new Response("Forbidden: admin access required", { status: 403 });
  }
  return user;
}

/** Check if a user can manage a specific course (superadmin can manage all, institution-admin only their own). */
export function canManageCourse(user: AdminUser, courseInstitutionId: string): boolean {
  if (user.role === "superadmin") return true;
  return user.institutionId === courseInstitutionId;
}

/** Check if a user can manage a specific institution. */
export function canManageInstitution(user: AdminUser, institutionId: string): boolean {
  if (user.role === "superadmin") return true;
  return user.institutionId === institutionId;
}

/** Check if a user has superadmin role. */
export function isSuperadmin(user: AdminUser): boolean {
  return user.role === "superadmin";
}
