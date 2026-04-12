"use client";

import Link from "next/link";
import { Course, Category, Institution } from "@/lib/types";
import { AnimatedSection, StaggerChildren, ParallaxElement } from "@/components/animated-section";
import Counter from "@/components/counter";
import HeroText from "@/components/hero-text";
import MagneticButton from "@/components/magnetic-button";
import { Search, ArrowRight, Star, Users, BookOpen, Award, MapPin, Clock, Globe } from "lucide-react";

const categoryIcons: Record<string, string> = {
  "Artificial Intelligence": "🧠",
  "Data Science": "📊",
  "Finance": "💰",
  "Design": "🎨",
  "Technology": "⚡",
  "Business": "📈",
  "Sustainability": "🌱",
  "Marketing": "📣",
  "Leadership": "🎯",
};

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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative orbs */}
        <ParallaxElement className="absolute top-20 right-[15%] w-[500px] h-[500px] bg-surface-tint/[0.06] blur-orb" speed={-30}><span /></ParallaxElement>
        <ParallaxElement className="absolute bottom-10 left-[10%] w-[350px] h-[350px] bg-secondary-container/[0.12] blur-orb" speed={-20}><span /></ParallaxElement>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-fixed/[0.08] blur-orb" />

        <div className="max-w-[1440px] mx-auto px-8 w-full relative z-10">
          <div className="editorial-margins">
            <AnimatedSection y={0} delay={0}>
              <p className="label-caps text-surface-tint mb-6 tracking-[0.3em]">
                The Scholarly Perspective
              </p>
            </AnimatedSection>

            <h1 className="font-heading text-[4.5rem] md:text-[5.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-on-surface mb-8 max-w-4xl">
              <HeroText text="Discover Your Next Academic Journey" />
            </h1>

            <AnimatedSection delay={0.5} y={30}>
              <p className="text-xl leading-[1.7] text-on-surface-variant max-w-xl mb-12">
                A curated collection of world-class courses from leading institutions.
                Find the perfect program to advance your career and expand your mind.
              </p>
            </AnimatedSection>

            {/* Search Bento */}
            <AnimatedSection delay={0.7} y={30}>
              <div className="max-w-3xl bg-white rounded-2xl p-2.5 shadow-floating ghost-border">
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

            {/* Quick Stats */}
            <AnimatedSection delay={0.9} y={20}>
              <div className="flex items-center gap-10 mt-14">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-surface-tint" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-extrabold text-on-surface">
                      <Counter value={500} suffix="+" />
                    </p>
                    <p className="text-xs text-on-surface-variant">Courses</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-outline-variant/20" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-extrabold text-on-surface">
                      <Counter value={25000} suffix="+" />
                    </p>
                    <p className="text-xs text-on-surface-variant">Students</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-outline-variant/20" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-extrabold text-on-surface">
                      <Counter value={50} suffix="+" />
                    </p>
                    <p className="text-xs text-on-surface-variant">Institutions</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-28 px-8 bg-surface-container-low relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Explore</p>
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
            {categories.slice(0, 9).map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.name}`}
                className="group bg-white rounded-2xl p-7 card-hover ghost-border relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-surface-tint/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-surface-tint/[0.06] transition-colors duration-500" />
                <span className="text-3xl mb-4 block">{categoryIcons[cat.name] || "📚"}</span>
                <h3 className="font-heading text-lg font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-sm text-on-surface-variant">{cat.courseCount} courses</p>
                <ArrowRight className="w-4 h-4 text-on-surface-variant absolute bottom-7 right-7 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      <section className="py-28 px-8 relative">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Featured</p>
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
            {courses.slice(0, 6).map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group bg-white rounded-2xl shadow-editorial card-hover ghost-border overflow-hidden"
              >
                {/* Image placeholder with gradient */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-container/80 to-surface-tint/60" />
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                  <div className="absolute bottom-4 left-5">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-on-surface text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
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

      {/* ─── STATS BANNER ─── */}
      <section className="py-24 px-8 bg-gradient-to-br from-primary to-primary-container relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-surface-tint blur-orb" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary-container blur-orb" />
        </div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <StaggerChildren className="grid grid-cols-4 gap-8" stagger={0.1}>
            {[
              { value: 500, suffix: "+", label: "Expert Courses", icon: BookOpen },
              { value: 25000, suffix: "+", label: "Active Students", icon: Users },
              { value: 50, suffix: "+", label: "Institutions", icon: Award },
              { value: 4.8, suffix: "", label: "Average Rating", icon: Star, decimals: 1 },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white/80" />
                </div>
                <p className="font-heading text-[3rem] font-extrabold text-white leading-none mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </p>
                <p className="text-sm text-white/60 font-medium">{stat.label}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ─── INSTITUTIONS ─── */}
      <section className="py-28 px-8 bg-surface-container-low relative">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Trusted Partners</p>
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high mx-auto mb-4 flex items-center justify-center group-hover:from-surface-tint/10 group-hover:to-primary/10 transition-all duration-500">
                  <span className="font-heading text-lg font-extrabold text-primary/40 group-hover:text-surface-tint transition-colors duration-300">
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
              <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Simple Process</p>
              <h2 className="font-heading text-[2.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
                How It Works
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-3 gap-8" stagger={0.12}>
            {[
              {
                step: "01",
                title: "Discover",
                description: "Browse hundreds of courses from world-class institutions. Filter by category, location, price, and delivery mode.",
              },
              {
                step: "02",
                title: "Compare & Connect",
                description: "Read reviews, compare curricula, and show interest to connect directly with institutions for more information.",
              },
              {
                step: "03",
                title: "Enroll & Learn",
                description: "Secure your spot with online payment or advance booking. Access your dashboard to track progress and certificates.",
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-white rounded-3xl p-10 ghost-border card-hover relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-surface-tint/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                  <span className="font-heading text-[4rem] font-extrabold text-surface-container-highest/60 leading-none block mb-6">
                    {item.step}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-on-surface mb-3">
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
    </main>
  );
}
