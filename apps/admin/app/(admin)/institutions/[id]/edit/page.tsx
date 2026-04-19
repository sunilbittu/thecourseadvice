import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireInstitutionAdmin, canManageInstitution } from "@courseadvice/auth/admin";
import type { Institution } from "@courseadvice/types";
import { InstitutionFormClient } from "./institution-form-client";

export const dynamic = "force-dynamic";

interface EditInstitutionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInstitutionPage({
  params,
}: EditInstitutionPageProps) {
  const { id } = await params;

  const adminUser = await requireInstitutionAdmin();

  if (!canManageInstitution(adminUser, id)) {
    notFound();
  }

  const rows = await db
    .select()
    .from(schema.institutions)
    .where(eq(schema.institutions.id, id))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();

  const institution: Institution = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo,
    location: row.location,
    description: row.description,
    website: row.website ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    founded: row.founded ?? undefined,
    featured: row.featured,
    courseCount: 0,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Institution</h1>
        <p className="mt-1 text-sm text-muted-foreground">{institution.name}</p>
      </div>
      <InstitutionFormClient
        initialData={institution}
        institutionId={id}
      />
    </div>
  );
}
