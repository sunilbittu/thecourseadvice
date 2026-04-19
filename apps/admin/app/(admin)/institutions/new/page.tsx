import { requireSuperadmin } from "@courseadvice/auth/admin";
import { InstitutionFormClient } from "./institution-form-client";

export const dynamic = "force-dynamic";

export default async function NewInstitutionPage() {
  await requireSuperadmin();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Institution</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new partner institution
        </p>
      </div>
      <InstitutionFormClient />
    </div>
  );
}
