"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Course, Category } from "@courseadvice/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Globe,
  Star,
  Users,
  X,
} from "lucide-react";

type Filters = {
  categories: string[];
  languages: string[];
  formats: string[];
  courseTypes: string[];
  price: "all" | "free" | "paid";
};

const FORMAT_OPTIONS = ["Online", "In-Person", "Hybrid"] as const;
const COURSE_TYPE_OPTIONS = ["Certificate", "Degree", "Diploma", "Workshop"] as const;
const THUMB_COLORS = [
  "bg-[#1a1a2e] text-[#e0e0e0]",
  "bg-[#16213e] text-[#a8b4c4]",
  "bg-[#0f3460] text-[#8db5e0]",
  "bg-[#1b2838] text-[#c7d5e0]",
  "bg-[#2d2d3a] text-[#b8b8cc]",
  "bg-[#1e3a5f] text-[#89b4d4]",
];

function courseInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getCourseType(course: Course): string {
  const haystack = [...course.perks, course.title, course.description].join(" ").toLowerCase();
  if (haystack.includes("degree")) return "Degree";
  if (haystack.includes("diploma")) return "Diploma";
  if (haystack.includes("workshop")) return "Workshop";
  if (course.certification) return "Certificate";
  return "Certificate";
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label onClick={onChange} className="flex items-center gap-3 cursor-pointer group">
      <span
        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors duration-200 shrink-0 ${
          checked
            ? "bg-surface-tint border-surface-tint"
            : "border-outline-variant/50 group-hover:border-surface-tint"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-sm transition-colors duration-200 ${checked ? "text-on-surface font-medium" : "text-on-surface-variant group-hover:text-on-surface"}`}>
        {label}
      </span>
    </label>
  );
}

function FiltersPanel({
  categories,
  languages,
  filters,
  activeCount,
  clearFilters,
  toggleArr,
  setPrice,
}: {
  categories: Category[];
  languages: string[];
  filters: Filters;
  activeCount: number;
  clearFilters: () => void;
  toggleArr: (key: "categories" | "languages" | "formats" | "courseTypes", value: string) => void;
  setPrice: (price: Filters["price"]) => void;
}) {
  return (
    <div className="bg-white rounded-2xl ghost-border p-5 md:p-6 space-y-6 md:space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-on-surface">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-surface-tint hover:opacity-70 transition-opacity"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Categories
        </p>
        <div className="space-y-2.5 max-h-64 overflow-auto pr-1">
          {categories.map((cat) => (
            <FilterCheckbox
              key={cat.id}
              label={cat.name}
              checked={filters.categories.includes(cat.name)}
              onChange={() => toggleArr("categories", cat.name)}
            />
          ))}
        </div>
      </div>

      {languages.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
            Language
          </p>
          <div className="space-y-2.5">
            {languages.map((lang) => (
              <FilterCheckbox
                key={lang}
                label={lang}
                checked={filters.languages.includes(lang)}
                onChange={() => toggleArr("languages", lang)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">Format</p>
        <div className="space-y-2.5">
          {FORMAT_OPTIONS.map((fmt) => (
            <FilterCheckbox
              key={fmt}
              label={fmt}
              checked={filters.formats.includes(fmt)}
              onChange={() => toggleArr("formats", fmt)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Course Type
        </p>
        <div className="space-y-2.5">
          {COURSE_TYPE_OPTIONS.map((type) => (
            <FilterCheckbox
              key={type}
              label={type}
              checked={filters.courseTypes.includes(type)}
              onChange={() => toggleArr("courseTypes", type)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">Price</p>
        <div className="space-y-2.5">
          {(["all", "free", "paid"] as const).map((opt) => (
            <label
              key={opt}
              onClick={() => setPrice(opt)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0 ${
                  filters.price === opt
                    ? "border-surface-tint bg-surface-tint"
                    : "border-outline-variant/50 group-hover:border-surface-tint"
                }`}
              >
                {filters.price === opt && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className={`text-sm transition-colors duration-200 capitalize ${filters.price === opt ? "text-on-surface font-medium" : "text-on-surface-variant group-hover:text-on-surface"}`}>
                {opt === "all" ? "All" : opt === "free" ? "Free" : "Paid"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CoursesClient({
  courses,
  categories,
  initialCategory,
}: {
  courses: Course[];
  categories: Category[];
  initialCategory?: string;
}) {
  const normalizedCategory = (initialCategory ?? "").trim();

  const languages = useMemo(
    () => [...new Set(courses.map((course) => course.language))].sort(),
    [courses],
  );

  const [filters, setFilters] = useState<Filters>({
    categories: normalizedCategory ? [normalizedCategory] : [],
    languages: [],
    formats: [],
    courseTypes: [],
    price: "all",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleArr = (key: "categories" | "languages" | "formats" | "courseTypes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], languages: [], formats: [], courseTypes: [], price: "all" });
  };

  const activeCount =
    filters.categories.length +
    filters.languages.length +
    filters.formats.length +
    filters.courseTypes.length +
    (filters.price !== "all" ? 1 : 0);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (filters.categories.length > 0 && !filters.categories.includes(course.category)) return false;
      if (filters.languages.length > 0 && !filters.languages.includes(course.language)) return false;
      if (filters.formats.length > 0 && !filters.formats.includes(course.delivery)) return false;
      if (filters.courseTypes.length > 0 && !filters.courseTypes.includes(getCourseType(course))) return false;
      if (filters.price === "free" && course.price > 0) return false;
      if (filters.price === "paid" && course.price === 0) return false;
      return true;
    });
  }, [courses, filters]);

  return (
    <main className="flex-1 page-enter overflow-x-hidden">
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-8 border-b border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-surface-tint transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-on-surface">
              All Courses
            </h1>
            <p className="text-on-surface-variant mt-2">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <FiltersPanel
              categories={categories}
              languages={languages}
              filters={filters}
              activeCount={activeCount}
              clearFilters={clearFilters}
              toggleArr={toggleArr}
              setPrice={(price) => setFilters((prev) => ({ ...prev, price }))}
            />
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <div className="lg:hidden mb-5">
              <button
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="w-full inline-flex items-center justify-between rounded-xl bg-white ghost-border px-4 py-3 text-sm font-semibold text-on-surface"
              >
                <span>Filters {activeCount > 0 ? `(${activeCount})` : ""}</span>
                <span className="text-on-surface-variant">{mobileFiltersOpen ? "Hide" : "Show"}</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${mobileFiltersOpen ? "max-h-[1400px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
              >
                <FiltersPanel
                  categories={categories}
                  languages={languages}
                  filters={filters}
                  activeCount={activeCount}
                  clearFilters={clearFilters}
                  toggleArr={toggleArr}
                  setPrice={(price) => setFilters((prev) => ({ ...prev, price }))}
                />
              </div>
            </div>

            {filteredCourses.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" stagger={0.06}>
                {filteredCourses.map((course, i) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group bg-white rounded-2xl shadow-editorial card-hover ghost-border overflow-hidden"
                  >
                    <div className={`relative h-48 flex items-center justify-center ${THUMB_COLORS[i % THUMB_COLORS.length]}`}>
                      <span className="font-heading text-5xl font-extrabold opacity-40">
                        {courseInitials(course.title)}
                      </span>
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full">
                        <Star className="w-3 h-3 text-warning fill-warning" />
                        <span className="text-xs font-bold text-on-surface">{course.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block bg-white/90 text-on-surface text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading text-[1.1rem] font-bold leading-[1.3] tracking-[-0.01em] text-on-surface mb-2 group-hover:text-surface-tint transition-colors duration-300">
                        {course.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant mb-4">{course.instructor}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> {course.delivery}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {course.studentCount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                        <span className="font-heading text-lg font-extrabold text-on-surface">
                          {course.price === 0 ? "Free" : `$${course.price.toLocaleString()}`}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-surface-tint opacity-100 md:opacity-0 translate-x-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
                          View Course <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </StaggerChildren>
            ) : (
              <div className="bg-white rounded-2xl p-8 md:p-16 ghost-border text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center mx-auto mb-5">
                  <BookOpen className="w-7 h-7 text-on-surface-variant" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-on-surface mb-2">No courses match</h2>
                <p className="text-on-surface-variant mb-6">Try adjusting your filters.</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-surface-tint hover:opacity-70 transition-opacity"
                >
                  Clear all filters <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
