import { db, hasDatabase } from "./index";
import { eq, and, sql, count, desc } from "drizzle-orm";
import * as schema from "./schema";
import type {
  Course,
  Institution,
  Category,
  User,
  DashboardData,
  InstitutionDashboardData,
  AnalyticsData,
  ResourcesData,
} from "@/lib/types";

// ─── JSON fallback imports ──────────────────────────────────────
import coursesJson from "@/lib/data/courses.json";
import institutionsJson from "@/lib/data/institutions.json";
import categoriesJson from "@/lib/data/categories.json";
import usersJson from "@/lib/data/users.json";
import dashboardJson from "@/lib/data/dashboard.json";
import institutionDashboardJson from "@/lib/data/institution-dashboard.json";
import analyticsJson from "@/lib/data/analytics.json";
import resourcesJson from "@/lib/data/resources.json";

// ─── Courses ────────────────────────────────────────────────────

export async function getCourses(filters?: {
  search?: string;
  category?: string;
  level?: string;
  delivery?: string;
}): Promise<Course[]> {
  if (!hasDatabase()) {
    let filtered = [...coursesJson] as Course[];
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s) ||
          c.instructor.toLowerCase().includes(s)
      );
    }
    if (filters?.category) filtered = filtered.filter((c) => c.category === filters.category);
    if (filters?.level) filtered = filtered.filter((c) => c.level === filters.level);
    if (filters?.delivery) filtered = filtered.filter((c) => c.delivery === filters.delivery);
    return filtered;
  }

  const conditions = [];
  if (filters?.category) {
    conditions.push(eq(schema.courses.category, filters.category));
  }
  if (filters?.level) {
    conditions.push(eq(schema.courses.level, filters.level as "Beginner" | "Intermediate" | "Advanced"));
  }
  if (filters?.delivery) {
    conditions.push(eq(schema.courses.delivery, filters.delivery as "Online" | "In-Person" | "Hybrid"));
  }
  if (filters?.search) {
    conditions.push(
      sql`(${schema.courses.title} ILIKE ${"%" + filters.search + "%"} OR ${schema.courses.description} ILIKE ${"%" + filters.search + "%"} OR ${schema.courses.instructor} ILIKE ${"%" + filters.search + "%"})`
    );
  }

  const rows = await db
    .select()
    .from(schema.courses)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return rows.map(rowToCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!hasDatabase()) {
    return (coursesJson as Course[]).find((c) => c.slug === slug) ?? null;
  }

  const rows = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.slug, slug))
    .limit(1);
  return rows[0] ? rowToCourse(rows[0]) : null;
}

function rowToCourse(row: typeof schema.courses.$inferSelect): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    instructor: row.instructor,
    price: row.price,
    rating: row.rating,
    reviewCount: row.reviewCount,
    studentCount: row.studentCount,
    category: row.category,
    level: row.level as Course["level"],
    duration: row.duration,
    language: row.language,
    delivery: row.delivery as Course["delivery"],
    certification: row.certification,
    image: row.image,
    institution: row.institution,
    curriculum: row.curriculum as Course["curriculum"],
    perks: row.perks as string[],
  };
}

// ─── Institutions ───────────────────────────────────────────────

export async function getInstitutions(): Promise<Institution[]> {
  if (!hasDatabase()) {
    return institutionsJson as Institution[];
  }

  const rows = await db
    .select({
      id: schema.institutions.id,
      name: schema.institutions.name,
      logo: schema.institutions.logo,
      location: schema.institutions.location,
      courseCount: count(schema.courses.id),
    })
    .from(schema.institutions)
    .leftJoin(schema.courses, eq(schema.institutions.name, schema.courses.institution))
    .groupBy(schema.institutions.id);

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    logo: r.logo,
    location: r.location,
    courseCount: Number(r.courseCount),
  }));
}

// ─── Categories ─────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (!hasDatabase()) {
    return categoriesJson as Category[];
  }

  const rows = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      icon: schema.categories.icon,
      image: schema.categories.image,
      courseCount: count(schema.courses.id),
    })
    .from(schema.categories)
    .leftJoin(schema.courses, eq(schema.categories.name, schema.courses.category))
    .groupBy(schema.categories.id);

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    image: r.image,
    courseCount: Number(r.courseCount),
  }));
}

// ─── Users ──────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  if (!hasDatabase()) {
    return (usersJson as User[]).find((u) => u.id === id) ?? null;
  }

  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);

  if (!rows[0]) return null;

  const user = rows[0];

  const enrolledRows = await db
    .select({ courseId: schema.enrollments.courseId })
    .from(schema.enrollments)
    .where(eq(schema.enrollments.userId, id));

  const shortlistRows = await db
    .select({ courseId: schema.shortlists.courseId })
    .from(schema.shortlists)
    .where(eq(schema.shortlists.userId, id));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as User["role"],
    avatar: user.avatar,
    bio: user.bio,
    socialLinks: user.socialLinks as User["socialLinks"],
    enrolledCourses: enrolledRows.map((r) => r.courseId),
    shortlist: shortlistRows.map((r) => r.courseId),
  };
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "name" | "email" | "bio" | "avatar" | "socialLinks">>
): Promise<User | null> {
  if (!hasDatabase()) {
    // In JSON-only mode, return merged data without persisting
    const user = (usersJson as User[]).find((u) => u.id === id);
    if (!user) return null;
    return { ...user, ...data } as User;
  }

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;
  if (data.socialLinks !== undefined) updateData.socialLinks = data.socialLinks;

  if (Object.keys(updateData).length > 0) {
    await db.update(schema.users).set(updateData).where(eq(schema.users.id, id));
  }

  return getUserById(id);
}

// ─── Dashboard ──────────────────────────────────────────────────

export async function getDashboardData(userId: string): Promise<DashboardData> {
  if (!hasDatabase()) {
    return dashboardJson as DashboardData;
  }

  const enrolledRows = await db
    .select({
      courseId: schema.enrollments.courseId,
      progress: schema.enrollments.progress,
      status: schema.enrollments.status,
      title: schema.courses.title,
      instructor: schema.courses.instructor,
      image: schema.courses.image,
    })
    .from(schema.enrollments)
    .innerJoin(schema.courses, eq(schema.enrollments.courseId, schema.courses.id))
    .where(eq(schema.enrollments.userId, userId));

  const shortlistRows = await db
    .select({
      courseId: schema.shortlists.courseId,
      title: schema.courses.title,
      price: schema.courses.price,
      instructor: schema.courses.instructor,
      image: schema.courses.image,
    })
    .from(schema.shortlists)
    .innerJoin(schema.courses, eq(schema.shortlists.courseId, schema.courses.id))
    .where(eq(schema.shortlists.userId, userId));

  const activeCourse = enrolledRows.find((r) => r.status === "active");
  const completedCount = enrolledRows.filter((r) => r.status === "completed").length;

  const enrolledIds = enrolledRows.map((r) => r.courseId);
  const shortlistIds = shortlistRows.map((r) => r.courseId);
  const excludeIds = new Set([...enrolledIds, ...shortlistIds]);

  const allCourses = await db.select().from(schema.courses).limit(20);
  const recommended = allCourses
    .filter((c) => !excludeIds.has(c.id))
    .slice(0, 3);

  return {
    currentCourse: activeCourse
      ? {
          id: activeCourse.courseId,
          title: activeCourse.title,
          progress: activeCourse.progress,
          nextLesson: "Continue where you left off",
        }
      : { id: "", title: "No active course", progress: 0, nextLesson: "Enroll in a course to get started" },
    studyHours: enrolledRows.length * 40,
    certificates: completedCount,
    purchasedCourses: enrolledRows.map((r) => ({
      id: r.courseId,
      title: r.title,
      progress: r.progress,
      instructor: r.instructor,
      image: r.image,
    })),
    shortlist: shortlistRows.map((r) => ({
      id: r.courseId,
      title: r.title,
      price: r.price,
      instructor: r.instructor,
      image: r.image,
    })),
    recommended: recommended.map((c) => ({
      id: c.id,
      title: c.title,
      price: c.price,
      rating: c.rating,
      image: c.image,
    })),
  };
}

// ─── Institution Dashboard ──────────────────────────────────────

export async function getInstitutionDashboard(institutionId: string): Promise<InstitutionDashboardData> {
  if (!hasDatabase()) {
    return institutionDashboardJson as InstitutionDashboardData;
  }

  const inst = await db
    .select()
    .from(schema.institutions)
    .where(eq(schema.institutions.id, institutionId))
    .limit(1);
  const instName = inst[0]?.name ?? "";

  const instCourses = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.institution, instName));

  const instLeads = await db
    .select()
    .from(schema.leads)
    .where(eq(schema.leads.institutionId, institutionId))
    .orderBy(desc(schema.leads.createdAt))
    .limit(10);

  const leadCountResult = await db
    .select({ count: count() })
    .from(schema.leads)
    .where(eq(schema.leads.institutionId, institutionId));

  const courseIds = instCourses.map((c) => c.id);
  let interestedStudents = 0;
  if (courseIds.length > 0) {
    const studentResult = await db
      .select({ count: count() })
      .from(schema.enrollments)
      .where(sql`${schema.enrollments.courseId} IN ${courseIds}`);
    interestedStudents = Number(studentResult[0]?.count ?? 0);
  }

  return {
    totalLeads: Number(leadCountResult[0]?.count ?? 0),
    activeCourses: instCourses.length,
    interestedStudents,
    recentLeads: instLeads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      course: instCourses.find((c) => c.id === l.courseId)?.title ?? "",
      date: l.createdAt.toISOString().split("T")[0],
      status: l.status as "new" | "contacted" | "enrolled",
    })),
    myCourses: instCourses.map((c) => ({
      id: c.id,
      title: c.title,
      students: c.studentCount,
      revenue: c.studentCount * c.price,
      status: "active" as const,
    })),
    monthlyGoal: { target: 150, current: Number(leadCountResult[0]?.count ?? 0) },
  };
}

// ─── Analytics ──────────────────────────────────────────────────

export async function getAnalyticsData(institutionId: string): Promise<AnalyticsData> {
  if (!hasDatabase()) {
    return analyticsJson as AnalyticsData;
  }

  const viewsResult = await db
    .select({ count: count() })
    .from(schema.courseViews)
    .where(eq(schema.courseViews.institutionId, institutionId));
  const totalViews = Number(viewsResult[0]?.count ?? 0);

  const leadsResult = await db
    .select({ count: count() })
    .from(schema.leads)
    .where(eq(schema.leads.institutionId, institutionId));
  const totalLeads = Number(leadsResult[0]?.count ?? 0);

  const conversionRate = totalViews > 0 ? Math.round((totalLeads / totalViews) * 10000) / 100 : 0;

  const locationRows = await db
    .select({
      city: schema.courseViews.city,
      country: schema.courseViews.country,
      leads: count(),
    })
    .from(schema.courseViews)
    .where(eq(schema.courseViews.institutionId, institutionId))
    .groupBy(schema.courseViews.city, schema.courseViews.country)
    .orderBy(desc(count()))
    .limit(5);

  const inst = await db
    .select()
    .from(schema.institutions)
    .where(eq(schema.institutions.id, institutionId))
    .limit(1);
  const instName = inst[0]?.name ?? "";

  const instCourses = await db
    .select()
    .from(schema.courses)
    .where(eq(schema.courses.institution, instName));

  const coursePerformance = await Promise.all(
    instCourses.map(async (c) => {
      const views = await db
        .select({ count: count() })
        .from(schema.courseViews)
        .where(eq(schema.courseViews.courseId, c.id));
      const leads = await db
        .select({ count: count() })
        .from(schema.leads)
        .where(eq(schema.leads.courseId, c.id));
      const v = Number(views[0]?.count ?? 0);
      const l = Number(leads[0]?.count ?? 0);
      return {
        id: c.id,
        title: c.title,
        views: v,
        leads: l,
        conversion: v > 0 ? Math.round((l / v) * 10000) / 100 : 0,
        trend: "stable" as const,
      };
    })
  );

  return {
    kpis: {
      totalViews,
      totalLeads,
      conversionRate,
      avgTimeOnPage: "3m 42s",
    },
    interestOverTime: [],
    deliveryPreference: [
      { type: "Online", percentage: 62 },
      { type: "Hybrid", percentage: 25 },
      { type: "In-Person", percentage: 13 },
    ],
    topLocations: locationRows.map((r) => ({
      city: r.city ?? "Unknown",
      country: r.country ?? "Unknown",
      leads: Number(r.leads),
    })),
    coursePerformance,
  };
}

// ─── Resources ──────────────────────────────────────────────────

export async function getResourcesData(): Promise<ResourcesData> {
  if (!hasDatabase()) {
    return resourcesJson as ResourcesData;
  }

  const cats = await db.select().from(schema.resourceCategories);
  const assets = await db.select().from(schema.featuredAssets);
  const tools = await db.select().from(schema.scholarlyTools);

  return {
    categories: cats.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      assetCount: c.assetCount,
    })),
    featuredAssets: assets.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type as "guide" | "template" | "video" | "tool",
      description: a.description,
      image: a.image,
      downloadUrl: a.downloadUrl,
    })),
    scholarlyTools: tools.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      icon: t.icon,
      url: t.url,
    })),
  };
}

// ─── Enrollments ────────────────────────────────────────────────

export async function getEnrollments(userId: string) {
  if (!hasDatabase()) return [];

  return db
    .select()
    .from(schema.enrollments)
    .where(eq(schema.enrollments.userId, userId));
}

export async function createEnrollment(userId: string, courseId: string, stripePaymentId?: string) {
  await db.insert(schema.enrollments).values({
    userId,
    courseId,
    progress: 0,
    status: "active",
    stripePaymentId: stripePaymentId ?? null,
  });
}

export async function updateEnrollmentProgress(userId: string, courseId: string, progress: number) {
  const status = progress >= 100 ? "completed" : "active";
  await db
    .update(schema.enrollments)
    .set({ progress, status })
    .where(and(eq(schema.enrollments.userId, userId), eq(schema.enrollments.courseId, courseId)));
}

// ─── Shortlists ─────────────────────────────────────────────────

export async function getShortlist(userId: string) {
  if (!hasDatabase()) return [];

  return db
    .select({ courseId: schema.shortlists.courseId })
    .from(schema.shortlists)
    .where(eq(schema.shortlists.userId, userId));
}

export async function addToShortlist(userId: string, courseId: string) {
  await db.insert(schema.shortlists).values({ userId, courseId }).onConflictDoNothing();
}

export async function removeFromShortlist(userId: string, courseId: string) {
  await db
    .delete(schema.shortlists)
    .where(and(eq(schema.shortlists.userId, userId), eq(schema.shortlists.courseId, courseId)));
}

// ─── Leads ──────────────────────────────────────────────────────

export async function getLeads(institutionId: string) {
  if (!hasDatabase()) return [];

  return db
    .select()
    .from(schema.leads)
    .where(eq(schema.leads.institutionId, institutionId))
    .orderBy(desc(schema.leads.createdAt));
}

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "enrolled") {
  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
}

// ─── Course Views ───────────────────────────────────────────────

export async function trackCourseView(courseId: string, institutionId: string, city?: string, country?: string) {
  if (!hasDatabase()) return;

  const id = crypto.randomUUID();
  await db.insert(schema.courseViews).values({ id, courseId, institutionId, city, country });
}

// ─── Course CRUD ────────────────────────────────────────────────

export async function createCourse(data: Omit<typeof schema.courses.$inferInsert, "createdAt">) {
  await db.insert(schema.courses).values(data);
  return getCourseBySlug(data.slug);
}

export async function updateCourse(id: string, data: Partial<typeof schema.courses.$inferInsert>) {
  await db.update(schema.courses).set(data).where(eq(schema.courses.id, id));
  const rows = await db.select().from(schema.courses).where(eq(schema.courses.id, id)).limit(1);
  return rows[0] ? rowToCourse(rows[0]) : null;
}

export async function deleteCourse(id: string) {
  await db.delete(schema.courses).where(eq(schema.courses.id, id));
}
