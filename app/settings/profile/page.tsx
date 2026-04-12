import { User } from "@/lib/types";
import ProfileClient from "./profile-client";

async function getUser(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/users/1`, { cache: "no-store" });
  return res.json();
}

export default async function ProfileSettingsPage() {
  const user = await getUser();
  return <ProfileClient user={user} />;
}
