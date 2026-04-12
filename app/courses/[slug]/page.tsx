import { Course } from "@/lib/types";
import CourseDetailClient from "./course-detail-client";
import coursesData from "@/lib/data/courses.json";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = (coursesData as Course[]).find((c) => c.slug === slug) ?? null;

  if (!course) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="font-heading text-[6rem] font-extrabold text-surface-container-highest leading-none mb-4">404</p>
          <h1 className="font-heading text-2xl font-bold text-on-surface mb-2">Course not found</h1>
          <p className="text-on-surface-variant">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </main>
    );
  }

  return <CourseDetailClient course={course} />;
}
