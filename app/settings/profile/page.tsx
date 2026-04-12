import { User } from "@/lib/types";
import ProfileClient from "./profile-client";
import usersData from "@/lib/data/users.json";

export default async function ProfileSettingsPage() {
  const user = (usersData as User[]).find((u) => u.id === "1") as User;
  return <ProfileClient user={user} />;
}
