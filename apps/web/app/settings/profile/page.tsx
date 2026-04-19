export const dynamic = "force-dynamic";

import ProfileClient from "./profile-client";
import { getUserById } from "@courseadvice/db/queries";
import { getAuth } from "@courseadvice/auth";

export default async function ProfileSettingsPage() {
  const { userId } = await getAuth();
  // Fall back to user "1" when auth isn't configured
  const id = userId ?? "1";

  const user = await getUserById(id);
  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-on-surface-variant">User not found. Please sign in.</p>
      </main>
    );
  }

  return <ProfileClient user={user} />;
}
