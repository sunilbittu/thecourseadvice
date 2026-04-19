import { verifySessionToken } from "./jwt";
import type { SessionPayload } from "./jwt";

/** Returns true if JWT_SECRET is configured. */
export function hasAuth(): boolean {
  return !!process.env.JWT_SECRET;
}

/** Returns { userId } — same shape as the old Clerk wrapper. */
export async function getAuth(): Promise<{ userId: string | null }> {
  if (!hasAuth()) {
    return { userId: null };
  }
  const session = await verifySessionToken();
  return { userId: session?.userId ?? null };
}

/** Returns the full session payload (userId, email, role) or null. */
export async function getSession(): Promise<SessionPayload | null> {
  if (!hasAuth()) return null;
  return verifySessionToken();
}
