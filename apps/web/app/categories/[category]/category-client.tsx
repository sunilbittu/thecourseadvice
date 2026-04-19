"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Course, Category } from "@courseadvice/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import {
  ArrowLeft, ArrowRight, Star, Users, Clock, Globe, BookOpen, X,
  Cpu, BarChart3, DollarSign, Palette, Zap, Briefcase, Leaf, Megaphone, Target,
} from "lucide-react";

const categoryIcons: Record<string, typeof Cpu> = {
  "Artificial Intelligence": Cpu,
  "Data Science": BarChart3,
  "Finance": DollarSign,
  "Design": Palette,
  "Technology": Zap,
  "Business": Briefcase,
  "Sustainability": Leaf,
  "Marketing": Megaphone,
  "Leadership": Target,
};

const THUMB_COLORS = [
  "bg-[#1a1a2e] text-[#e0e0e0]",
  "bg-[#16213e] text-[#a8b4c4]",
  "bg-[#0f3460] text-[#8db5e0]",
  "bg-[#1b2838] text-[#c7d5e0]",
  "bg-[#2d2d3a] text-[#b8b8cc]",
  "bg-[#1e3a5f] text-[#89b4d4]",
];

function courseInitials(title: string) {
  return title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

/** Derive a course type label from perks / title */
function getCourseType(course: Course): string {
  const haystack = [...course.perks, course.title, course.description]
    .join(" ")
    .toLowerCase();
  if (haystack.includes("degree")) return "Degree";
  if (haystack.includes("diploma")) return "Diploma";
  if (haystack.includes("workshop")) return "Workshop";
  if (course.certification) return "Certificate";
  return "Certificate";
}

type Filters = {
  languages: string[];
  formats: string[];
  courseTypes: string[];
  price: string; // "all" | "free" | "paid"
};

const FORMAT_OPTIONS = ["Online", "In-Person", "Hybrid"] as const;
const COURSE_TYPE_OPTIONS = ["Certificate", "Degree", "Diploma", "Workshop"] as const;

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
  languages,
  filters,
  activeCount,
  clearFilters,
  toggleArr,
  setPrice,
}: {
  languages: string[];
  filters: Filters;
  activeCount: number;
  clearFilters: () => void;
  toggleArr: (key: "languages" | "formats" | "courseTypes", value: string) => void;
  setPrice: (price: Filters["price"]) => void;
}) {
  return (
    <div className="bg-white rounded-2xl ghost-border p-5 md:p-6 space-y-6 md:space-y-7">
      {/* Header */}
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

      {/* Language */}
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

      {/* Format */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Format
        </p>
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

      {/* Course Type */}
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

      {/* Price */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Price
        </p>
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
                {filters.price === opt && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
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

export default function CategoryClient({
  category,
  courses,
  allCategories,
}: {
  category: string;
  courses: Course[];
  allCategories: Category[];
}) {
  const Icon = categoryIcons[category] || BookOpen;

  // Derive unique languages from courses
  const languages = useMemo(
    () => [...new Set(courses.map((c) => c.language))].sort(),
    [courses]
  );

  const [filters, setFilters] = useState<Filters>({
    languages: [],
    formats: [],
    courseTypes: [],
    price: "all",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleArr = (key: "languages" | "formats" | "courseTypes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () =>
    setFilters({ languages: [], formats: [], courseTypes: [], price: "all" });

  const activeCount =
    filters.languages.length +
    filters.formats.length +
    filters.courseTypes.length +
    (filters.price !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (filters.languages.length > 0 && !filters.languages.includes(c.language)) return false;
      if (filters.formats.length > 0 && !filters.formats.includes(c.delivery)) return false;
      if (filters.courseTypes.length > 0 && !filters.courseTypes.includes(getCourseType(c))) return false;
      if (filters.price === "free" && c.price > 0) return false;
      if (filters.price === "paid" && c.price === 0) return false;
      return true;
    });
  }, [courses, filters]);

  return (
    <main className="flex-1 page-enter overflow-x-hidden">
      {/* ─── HEADER ─── */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-8 border-b border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-surface-tint transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-surface-tint/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-surface-tint" />
              </div>
              <div>
                <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-on-surface break-words">
                  {category}
                </h1>
                <p className="text-on-surface-variant mt-1">
                  {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── BODY: SIDEBAR + COURSES ─── */}
      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── FILTERS SIDEBAR ── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <FiltersPanel
              languages={languages}
              filters={filters}
              activeCount={activeCount}
              clearFilters={clearFilters}
              toggleArr={toggleArr}
              setPrice={(price) => setFilters((prev) => ({ ...prev, price }))}
            />
          </aside>

          {/* ── COURSES GRID ── */}
          <div className="flex-1 min-w-0 w-full">
            {/* Mobile filters */}
            <div className="lg:hidden mb-5">
              <button
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="w-full inline-flex items-center justify-between rounded-xl bg-white ghost-border px-4 py-3 text-sm font-semibold text-on-surface"
              >
                <span>Filters {activeCount > 0 ? `(${activeCount})` : ""}</span>
                <span className="text-on-surface-variant">{mobileFiltersOpen ? "Hide" : "Show"}</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${mobileFiltersOpen ? "max-h-[1200px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
              >
                <FiltersPanel
                  languages={languages}
                  filters={filters}
                  activeCount={activeCount}
                  clearFilters={clearFilters}
                  toggleArr={toggleArr}
                  setPrice={(price) => setFilters((prev) => ({ ...prev, price }))}
                />
              </div>
            </div>

            {filtered.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" stagger={0.06}>
                {filtered.map((course, i) => (
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
                          {getCourseType(course)}
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

      {/* ─── OTHER CATEGORIES ─── */}
      <section className="py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-surface-container-low border-t border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <h2 className="font-heading text-xl font-bold text-on-surface mb-6">Explore other categories</h2>
          </AnimatedSection>
          <div className="flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c.name !== category)
              .map((cat) => {
                const CatIcon = categoryIcons[cat.name] || BookOpen;
                return (
                  <Link
                    key={cat.id}
                    href={`/courses?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-2 bg-white rounded-xl px-5 py-3 ghost-border card-hover text-sm font-semibold text-on-surface hover:text-surface-tint transition-colors duration-300"
                  >
                    <CatIcon className="w-4 h-4 text-on-surface-variant" />
                    {cat.name}
                    <span className="text-xs text-on-surface-variant font-normal">({cat.courseCount})</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
