import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

import coursesData from "../data/courses.json";
import categoriesData from "../data/categories.json";
import institutionsData from "../data/institutions.json";
import usersData from "../data/users.json";
import resourcesData from "../data/resources.json";
import institutionDashboardData from "../data/institution-dashboard.json";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...\n");

  // 1. Institutions
  console.log("Seeding institutions...");
  await db.insert(schema.institutions).values(
    institutionsData.map((i) => ({
      id: i.id,
      name: i.name,
      logo: i.logo,
      location: i.location,
    }))
  );

  // 2. Categories
  console.log("Seeding categories...");
  await db.insert(schema.categories).values(
    categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      image: c.image,
    }))
  );

  // 3. Courses
  console.log("Seeding courses...");
  await db.insert(schema.courses).values(
    coursesData.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      instructor: c.instructor,
      price: c.price,
      rating: c.rating,
      reviewCount: c.reviewCount,
      studentCount: c.studentCount,
      category: c.category,
      level: c.level as "Beginner" | "Intermediate" | "Advanced",
      duration: c.duration,
      language: c.language,
      delivery: c.delivery as "Online" | "In-Person" | "Hybrid",
      certification: c.certification,
      image: c.image,
      institution: c.institution,
      curriculum: c.curriculum,
      perks: c.perks,
    }))
  );

  // 4. Users
  console.log("Seeding users...");
  await db.insert(schema.users).values(
    usersData.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as "student" | "institution-admin",
      avatar: u.avatar,
      bio: u.bio,
      socialLinks: u.socialLinks,
      institutionId: u.role === "institution-admin" ? "1" : null, // LSE
    }))
  );

  // 5. Enrollments (from users' enrolledCourses)
  console.log("Seeding enrollments...");
  const enrollments: { userId: string; courseId: string; progress: number; status: "active" | "completed" }[] = [];
  for (const u of usersData) {
    for (const courseId of u.enrolledCourses) {
      // Use dashboard data for progress if user 1
      let progress = 0;
      if (u.id === "1") {
        const dashboardCourse = (await import("../data/dashboard.json")).default.purchasedCourses.find(
          (pc: { id: string }) => pc.id === courseId
        );
        progress = dashboardCourse?.progress ?? 0;
      }
      enrollments.push({
        userId: u.id,
        courseId,
        progress,
        status: progress >= 100 ? "completed" : "active",
      });
    }
  }
  // Also add courses from dashboard that aren't in user's enrolledCourses
  const dashboardData = (await import("../data/dashboard.json")).default;
  for (const pc of dashboardData.purchasedCourses) {
    if (!enrollments.some((e) => e.userId === "1" && e.courseId === pc.id)) {
      enrollments.push({
        userId: "1",
        courseId: pc.id,
        progress: pc.progress,
        status: pc.progress >= 100 ? "completed" : "active",
      });
    }
  }
  if (enrollments.length > 0) {
    await db.insert(schema.enrollments).values(enrollments);
  }

  // 6. Shortlists
  console.log("Seeding shortlists...");
  const shortlistEntries: { userId: string; courseId: string }[] = [];
  for (const u of usersData) {
    for (const courseId of u.shortlist) {
      shortlistEntries.push({ userId: u.id, courseId });
    }
  }
  if (shortlistEntries.length > 0) {
    await db.insert(schema.shortlists).values(shortlistEntries);
  }

  // 7. Leads (from institution dashboard)
  console.log("Seeding leads...");
  // Map course titles to IDs
  const courseTitleToId: Record<string, string> = {};
  for (const c of coursesData) {
    courseTitleToId[c.title] = c.id;
  }
  await db.insert(schema.leads).values(
    institutionDashboardData.recentLeads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      courseId: courseTitleToId[l.course] ?? "2",
      institutionId: "1", // LSE
      status: l.status as "new" | "contacted" | "enrolled",
    }))
  );

  // 8. Resources
  console.log("Seeding resource categories...");
  await db.insert(schema.resourceCategories).values(
    resourcesData.categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      assetCount: c.assetCount,
    }))
  );

  console.log("Seeding featured assets...");
  await db.insert(schema.featuredAssets).values(
    resourcesData.featuredAssets.map((a) => ({
      id: a.id,
      title: a.title,
      type: a.type as "guide" | "template" | "video" | "tool",
      description: a.description,
      image: a.image,
      downloadUrl: a.downloadUrl,
    }))
  );

  console.log("Seeding scholarly tools...");
  await db.insert(schema.scholarlyTools).values(
    resourcesData.scholarlyTools.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      icon: t.icon,
      url: t.url,
    }))
  );

  console.log("\nSeeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
