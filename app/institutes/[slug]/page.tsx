import { notFound } from "next/navigation";
import institutes from "@/lib/data/institutes.json";
import InstituteDetailClient from "./institute-detail-client";
import { getCourses } from "@/lib/db/queries";
import { getInstitutionAliasesBySlug } from "@/lib/institutes";

export default async function InstituteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const institute = institutes.find((item) => item.slug === slug);

  if (!institute) {
    notFound();
  }

  const aliases = getInstitutionAliasesBySlug(institute.slug);
  const courses = await getCourses();
  const availableCourses = courses
    .filter((course) => aliases.includes(course.institution.trim().toLowerCase()))
    .map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      delivery: course.delivery,
      price: course.price,
      rating: course.rating,
    }));

  return <InstituteDetailClient institute={institute} availableCourses={availableCourses} />;
}
