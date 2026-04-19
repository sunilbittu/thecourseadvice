export const dynamic = "force-dynamic";

import HomeClient from "./home-client";
import { getCourses, getCategories, getInstitutions, getSiteContent, getTestimonials } from "@courseadvice/db/queries";

export default async function HomePage() {
  const [courses, categories, institutions, siteContent, testimonials] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstitutions(),
    getSiteContent(),
    getTestimonials(true),
  ]);

  // Group site content by section for easier access
  const contentBySection: Record<string, Record<string, string>> = {};
  for (const item of siteContent) {
    if (!contentBySection[item.section]) {
      contentBySection[item.section] = {};
    }
    contentBySection[item.section][item.key] = item.value;
  }

  return (
    <HomeClient
      courses={courses}
      categories={categories}
      institutions={institutions}
      siteContent={contentBySection}
      testimonials={testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        quote: t.quote,
        avatar: t.avatar,
        rating: t.rating,
      }))}
    />
  );
}
