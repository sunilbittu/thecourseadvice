import { auth } from "@clerk/nextjs/server";

/** Returns true if Clerk env vars are configured. */
export function hasAuth(): boolean {
  return !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;
}

/** Safe wrapper around Clerk's auth(). Returns null userId when Clerk isn't configured. */
export async function getAuth(): Promise<{ userId: string | null }> {
  if (!hasAuth()) {
    return { userId: null };
  }
  return auth();
}
