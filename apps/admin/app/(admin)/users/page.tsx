import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { desc } from "drizzle-orm";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireSuperadmin();

  const users = await db
    .select()
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage user accounts and roles.
        </p>
      </div>
      <UsersClient initialUsers={users} />
    </div>
  );
}
