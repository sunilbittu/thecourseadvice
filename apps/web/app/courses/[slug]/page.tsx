export const dynamic = "force-dynamic";

import CourseDetailClient from "./course-detail-client";
import { getCourseBySlug, getEnrollments, getShortlist, trackCourseView } from "@courseadvice/db/queries";
import { getAuth } from "@courseadvice/auth";
import { after } from "next/server";
import { getInstituteSlugByCourseInstitution } from "@/lib/institutes";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

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

  // Track page view in the background
  after(async () => {
    try {
      await trackCourseView(course.id, course.institution);
    } catch {
      // silently ignore tracking errors
    }
  });

  const { userId } = await getAuth();
  let isEnrolled = false;
  let isShortlisted = false;

  if (userId) {
    const [enrollments, shortlist] = await Promise.all([
      getEnrollments(userId),
      getShortlist(userId),
    ]);
    isEnrolled = enrollments.some((e) => e.courseId === course.id);
    isShortlisted = shortlist.some((s) => s.courseId === course.id);
  }

  const instituteSlug = getInstituteSlugByCourseInstitution(course.institution);

  return (
    <CourseDetailClient
      course={course}
      instituteSlug={instituteSlug}
      isEnrolled={isEnrolled}
      isShortlisted={isShortlisted}
      isSignedIn={!!userId}
    />
  );
}
