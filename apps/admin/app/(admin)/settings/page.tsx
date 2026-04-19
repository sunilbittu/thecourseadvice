import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { asc } from "drizzle-orm";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireSuperadmin();

  const settings = await db
    .select()
    .from(schema.siteSettings)
    .orderBy(asc(schema.siteSettings.key));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage global site configuration key-value pairs.
        </p>
      </div>
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
