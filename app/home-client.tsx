"use client";

import Link from "next/link";
import { Course, Category, Institution } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import Counter from "@/components/counter";
import HeroText from "@/components/hero-text";
import MagneticButton from "@/components/magnetic-button";
import {
  Search, ArrowRight, Star, Users, BookOpen, Award, MapPin, Clock, Globe,
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

function courseInitials(title: string) {
  return title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const THUMB_COLORS = [
  "bg-[#1a1a2e] text-[#e0e0e0]",
  "bg-[#16213e] text-[#a8b4c4]",
  "bg-[#0f3460] text-[#8db5e0]",
  "bg-[#1b2838] text-[#c7d5e0]",
  "bg-[#2d2d3a] text-[#b8b8cc]",
  "bg-[#1e3a5f] text-[#89b4d4]",
];

export default function HomeClient({
  courses,
  categories,
  institutions,
}: {
  courses: Course[];
  categories: Category[];
  institutions: Institution[];
}) {
  return (
    <main className="flex-1 page-enter">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="max-w-[1440px] mx-auto px-8 w-full relative z-10">
          <div className="editorial-margins">
            <h1 className="font-heading text-[4.5rem] md:text-[5.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-on-surface mb-8 max-w-4xl">
              <HeroText text="Discover your path to success" />
            </h1>

            <AnimatedSection delay={0.5} y={30}>
              <p className="text-xl leading-[1.7] text-on-surface-variant max-w-xl mb-12">
                Find the perfect course and institution
              </p>
            </AnimatedSection>

            {/* Search */}
            <AnimatedSection delay={0.7} y={30}>
              <div className="max-w-3xl bg-white rounded-2xl p-2.5 shadow-editorial ghost-border">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 bg-surface-container-low rounded-xl px-5 py-4">
                    <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
                    <input
                      type="text"
                      placeholder="Search courses, institutions, topics..."
                      className="w-full bg-transparent text-on-surface placeholder:text-outline text-[15px] font-medium outline-none"
                    />
                  </div>
                  <div className="hidden md:flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-4">
                    <MapPin className="w-4 h-4 text-on-surface-variant shrink-0" />
                    <select className="bg-transparent text-sm font-medium text-on-surface outline-none cursor-pointer">
                      <option>All Locations</option>
                      <option>London</option>
                      <option>New York</option>
                      <option>Singapore</option>
                      <option>Sydney</option>
                    </select>
                  </div>
                  <MagneticButton
                    className="bg-surface-tint text-white font-heading font-bold text-sm px-8 py-4 rounded-xl hover:brightness-110 transition-all shrink-0"
                    strength={0.2}
                  >
                    Search
                  </MagneticButton>
                </div>
              </div>
            </AnimatedSection>

            {/* Quick Stats — inline text, not icon boxes */}
            <AnimatedSection delay={0.9} y={20}>
              <div className="flex items-center gap-8 mt-14 text-sm text-on-surface-variant">
                <span><strong className="text-on-surface font-heading"><Counter value={500} suffix="+" /></strong> courses</span>
                <span className="w-px h-4 bg-outline-variant/30" />
                <span><strong className="text-on-surface font-heading"><Counter value={25000} suffix="+" /></strong> students</span>
                <span className="w-px h-4 bg-outline-variant/30" />
                <span><strong className="text-on-surface font-heading"><Counter value={50} suffix="+" /></strong> institutions</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-28 px-8 bg-surface-container-low">
        <div className="absolute left-0 right-0 h-px bg-outline-variant/10" />
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <h2 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
                  Popular Categories
                </h2>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold text-surface-tint hover:gap-3 transition-all duration-300"
              >
                View all categories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-3 gap-5" stagger={0.06}>
            {categories.slice(0, 9).map((cat) => {
              const Icon = categoryIcons[cat.name] || BookOpen;
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${encodeURIComponent(cat.name)}`}
                  className="group bg-white rounded-2xl p-7 card-hover ghost-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-4 group-hover:bg-surface-tint/10 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-surface-tint transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{cat.courseCount} courses</p>
                </Link>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      <section className="py-28 px-8">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <h2 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
                  Trending Courses
                </h2>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-semibold text-surface-tint hover:gap-3 transition-all duration-300"
              >
                Browse all courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-3 gap-7" stagger={0.08}>
              {courses.slice(0, 6).map((course, i) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group bg-white rounded-2xl shadow-editorial card-hover ghost-border overflow-hidden"
                >
                  {/* Thumbnail with initials */}
                  <div className={`relative h-52 flex items-center justify-center ${THUMB_COLORS[i % THUMB_COLORS.length]}`}>
                    <span className="font-heading text-5xl font-extrabold opacity-40">
                      {courseInitials(course.title)}
                    </span>
                    <div className="absolute bottom-4 left-5">
                      <span className="inline-block bg-white text-on-surface text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-xs font-bold text-on-surface">{course.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-[1.25rem] font-bold leading-[1.3] tracking-[-0.01em] text-on-surface mb-2 group-hover:text-surface-tint transition-colors duration-300">
                      {course.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-5">{course.instructor}</p>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-5">
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

                    <div className="flex items-center justify-between pt-5 border-t border-outline-variant/10">
                      <span className="font-heading text-xl font-extrabold text-on-surface">
                        ${course.price.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-surface-tint opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        View Course <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 px-8 border-y border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto">
          <StaggerChildren className="grid grid-cols-4 gap-8" stagger={0.1}>
            {[
              { value: 500, suffix: "+", label: "Expert Courses", icon: BookOpen },
              { value: 25000, suffix: "+", label: "Active Students", icon: Users },
              { value: 50, suffix: "+", label: "Institutions", icon: Award },
              { value: 4.8, suffix: "", label: "Average Rating", icon: Star, decimals: 1 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-[3rem] font-extrabold text-on-surface leading-none mb-1">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </p>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── INSTITUTIONS ─── */}
      <section className="py-28 px-8 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface mb-4">
                Leading Institutions
              </h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
                Learn from the world&apos;s most prestigious universities and educational organizations
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5" stagger={0.06}>
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="group bg-white rounded-2xl p-6 card-hover ghost-border text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-container-low mx-auto mb-4 flex items-center justify-center group-hover:bg-surface-tint/10 transition-colors duration-300">
                  <span className="font-heading text-lg font-extrabold text-on-surface-variant/60 group-hover:text-surface-tint transition-colors duration-300">
                    {inst.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <p className="font-heading text-sm font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors duration-300">
                  {inst.name}
                </p>
                <p className="text-xs text-on-surface-variant">{inst.location}</p>
                <p className="text-[10px] font-semibold text-surface-tint mt-2">{inst.courseCount} courses</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 px-8">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
                How It Works
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-3 gap-8" stagger={0.12}>
            {[
              {
                step: 1,
                title: "Discover",
                description: "Browse hundreds of courses from world-class institutions. Filter by category, location, price, and delivery mode.",
                icon: Search,
              },
              {
                step: 2,
                title: "Compare & Connect",
                description: "Read reviews, compare curricula, and show interest to connect directly with institutions for more information.",
                icon: BarChart3,
              },
              {
                step: 3,
                title: "Enroll & Learn",
                description: "Secure your spot with online payment or advance booking. Access your dashboard to track progress and certificates.",
                icon: BookOpen,
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <div className="bg-white rounded-2xl p-10 ghost-border card-hover">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center mb-6">
                    <item.icon className="w-5 h-5 text-surface-tint" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-on-surface mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[15px] text-on-surface-variant leading-[1.7]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── INSTITUTION PARTNER BANNER ─── */}
      <section className="px-8 pb-28">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 ghost-border flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-3xl">
                <h3 className="font-heading text-[2rem] md:text-[2.25rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-on-surface">
                  Are you an educational institute?
                </h3>
                <p className="text-on-surface-variant text-[1.05rem] leading-[1.7] mt-3">
                  Showcase your courses, attract students, and get student feedback.
                </p>
              </div>

              <Link
                href="/institution"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-surface-tint text-white font-heading font-bold text-sm hover:brightness-110 transition-all duration-300 whitespace-nowrap"
              >
                Partner with us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      
    </main>
  );
}
