import { requireSuperadmin } from "@courseadvice/auth/admin";
import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { asc } from "drizzle-orm";
import { TestimonialsClient } from "./testimonials-client";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  await requireSuperadmin();

  const testimonials = await db
    .select()
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight">Testimonials</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage student testimonials shown on the homepage.
        </p>
      </div>
      <TestimonialsClient initialTestimonials={testimonials} />
    </div>
  );
}
