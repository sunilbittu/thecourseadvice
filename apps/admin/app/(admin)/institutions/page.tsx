import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { eq, count } from "drizzle-orm";
import { getAdminUser, isSuperadmin } from "@courseadvice/auth/admin";
import type { Institution } from "@courseadvice/types";
import { InstitutionsClient } from "./institutions-client";

export const dynamic = "force-dynamic";

export default async function InstitutionsPage() {
  const adminUser = await getAdminUser();
  const superadmin = adminUser ? isSuperadmin(adminUser) : false;

  const rows = await db
    .select({
      id: schema.institutions.id,
      name: schema.institutions.name,
      slug: schema.institutions.slug,
      logo: schema.institutions.logo,
      location: schema.institutions.location,
      featured: schema.institutions.featured,
      courseCount: count(schema.courses.id),
    })
    .from(schema.institutions)
    .leftJoin(
      schema.courses,
      eq(schema.institutions.name, schema.courses.institution)
    )
    .groupBy(schema.institutions.id)
    .orderBy(schema.institutions.name);

  let institutions: Institution[];

  if (!superadmin && adminUser?.institutionId) {
    const filtered = rows.filter((r) => r.id === adminUser.institutionId);
    institutions = filtered.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      logo: r.logo,
      location: r.location,
      featured: r.featured,
      courseCount: Number(r.courseCount),
    }));
  } else {
    institutions = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      logo: r.logo,
      location: r.location,
      featured: r.featured,
      courseCount: Number(r.courseCount),
    }));
  }

  return <InstitutionsClient institutions={institutions} isSuperadmin={superadmin} />;
}
