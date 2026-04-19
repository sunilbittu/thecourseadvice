import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─── Institutions ───────────────────────────────────────────────
export const institutions = pgTable("institutions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull().default(""),
  website: text("website"),
  email: text("email"),
  phone: text("phone"),
  founded: text("founded"),
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
  }>().notNull().default({}),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Categories ─────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Courses ────────────────────────────────────────────────────
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor").notNull(),
  price: integer("price").notNull(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  studentCount: integer("student_count").notNull().default(0),
  category: text("category").notNull(),
  level: text("level", { enum: ["Beginner", "Intermediate", "Advanced"] }).notNull(),
  duration: text("duration").notNull(),
  language: text("language").notNull().default("English"),
  delivery: text("delivery", { enum: ["Online", "In-Person", "Hybrid"] }).notNull(),
  certification: boolean("certification").notNull().default(false),
  image: text("image").notNull(),
  institution: text("institution").notNull(),
  curriculum: jsonb("curriculum").$type<{ title: string; duration: string; lessons: number }[]>().notNull(),
  perks: jsonb("perks").$type<string[]>().notNull(),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Users ──────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["student", "institution-admin", "superadmin"] }).notNull().default("student"),
  avatar: text("avatar").notNull().default(""),
  bio: text("bio").notNull().default(""),
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    website?: string;
  }>().notNull().default({}),
  institutionId: text("institution_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Enrollments (many-to-many: users ↔ courses) ───────────────
export const enrollments = pgTable(
  "enrollments",
  {
    userId: text("user_id").notNull(),
    courseId: text("course_id").notNull(),
    progress: integer("progress").notNull().default(0),
    status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
    stripePaymentId: text("stripe_payment_id"),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

// ─── Shortlists (many-to-many: users ↔ courses) ────────────────
export const shortlists = pgTable(
  "shortlists",
  {
    userId: text("user_id").notNull(),
    courseId: text("course_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

// ─── Leads ──────────────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  courseId: text("course_id").notNull(),
  institutionId: text("institution_id").notNull(),
  status: text("status", { enum: ["new", "contacted", "enrolled"] }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Course Views ───────────────────────────────────────────────
export const courseViews = pgTable("course_views", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  institutionId: text("institution_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  city: text("city"),
  country: text("country"),
});

// ─── Resources ──────────────────────────────────────────────────
export const resourceCategories = pgTable("resource_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  assetCount: integer("asset_count").notNull().default(0),
});

export const featuredAssets = pgTable("featured_assets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", { enum: ["guide", "template", "video", "tool"] }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  downloadUrl: text("download_url").notNull(),
});

export const scholarlyTools = pgTable("scholarly_tools", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  url: text("url").notNull(),
});

// ─── Site Content (CMS) ─────────────────────────────────────────
export const siteContent = pgTable("site_content", {
  id: text("id").primaryKey(),
  section: text("section").notNull(), // e.g. "hero", "stats", "how-it-works", "partner-banner"
  key: text("key").notNull(),
  value: text("value").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Testimonials ───────────────────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  quote: text("quote").notNull(),
  avatar: text("avatar").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Site Settings ──────────────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
