import { db } from "@courseadvice/db";
import * as schema from "@courseadvice/db/schema";
import { count, desc } from "drizzle-orm";
import { BookOpen, Building2, Users, GraduationCap } from "lucide-react";
import { StatCard } from "@/components/stat-card";


export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    [{ total: totalCourses }],
    [{ total: totalInstitutions }],
    [{ total: totalUsers }],
    [{ total: totalEnrollments }],
    recentCourses,
  ] = await Promise.all([
    db.select({ total: count() }).from(schema.courses),
    db.select({ total: count() }).from(schema.institutions),
    db.select({ total: count() }).from(schema.users),
    db.select({ total: count() }).from(schema.enrollments),
    db
      .select({
        id: schema.courses.id,
        title: schema.courses.title,
        institution: schema.courses.institution,
        status: schema.courses.status,
        createdAt: schema.courses.createdAt,
      })
      .from(schema.courses)
      .orderBy(desc(schema.courses.createdAt))
      .limit(5),
  ]);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of the CourseAdvice platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={Number(totalCourses)}
          icon={<BookOpen className="h-5 w-5" />}
          description="All courses on the platform"
        />
        <StatCard
          title="Institutions"
          value={Number(totalInstitutions)}
          icon={<Building2 className="h-5 w-5" />}
          description="Partner institutions"
        />
        <StatCard
          title="Users"
          value={Number(totalUsers)}
          icon={<Users className="h-5 w-5" />}
          description="Registered users"
        />
        <StatCard
          title="Enrollments"
          value={Number(totalEnrollments)}
          icon={<GraduationCap className="h-5 w-5" />}
          description="Total course enrollments"
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Courses</h2>
        <div className="rounded-xl border border-border bg-card">
          {recentCourses.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No courses yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentCourses.map((course) => (
                <li
                  key={course.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {course.institution}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        course.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : course.status === "draft"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {course.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {course.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
