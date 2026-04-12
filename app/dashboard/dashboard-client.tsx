"use client";

import Link from "next/link";
import { DashboardData } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import Counter from "@/components/counter";
import { Clock, Award, TrendingUp, Play, ArrowRight, Star, BookOpen } from "lucide-react";

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto editorial-margins">
          <p className="label-caps text-surface-tint mb-3 tracking-[0.3em]">Dashboard</p>
          <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
            Welcome back
          </h1>
          <p className="text-lg text-on-surface-variant">Track your learning progress and continue where you left off.</p>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto">
          {/* Stats Row */}
          <StaggerChildren className="grid grid-cols-3 gap-6 mb-14" stagger={0.08}>
            <div className="bg-white rounded-2xl p-7 ghost-border stat-card card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-surface-tint" />
                </div>
                <p className="label-caps text-on-surface-variant">Study Hours</p>
              </div>
              <p className="font-heading text-[2.75rem] font-extrabold text-on-surface leading-none">
                <Counter value={data.studyHours} />
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 ghost-border stat-card card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-success" />
                </div>
                <p className="label-caps text-on-surface-variant">Certificates</p>
              </div>
              <p className="font-heading text-[2.75rem] font-extrabold text-on-surface leading-none">
                <Counter value={data.certificates} />
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 ghost-border stat-card card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning" />
                </div>
                <p className="label-caps text-on-surface-variant">Current Progress</p>
              </div>
              <p className="font-heading text-[2.75rem] font-extrabold text-on-surface leading-none">
                <Counter value={data.currentCourse.progress} suffix="%" />
              </p>
            </div>
          </StaggerChildren>

          {/* Continue Learning */}
          <AnimatedSection className="mb-14">
            <div className="relative bg-gradient-to-br from-primary via-primary-container to-surface-tint rounded-3xl p-10 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-white rounded-full blur-[80px]" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1 max-w-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-3">Continue Learning</p>
                  <h2 className="font-heading text-[1.75rem] font-bold text-white mb-2">{data.currentCourse.title}</h2>
                  <p className="text-white/60 text-sm mb-6">Next: {data.currentCourse.nextLesson}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-xs">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary-container rounded-full transition-all duration-1000"
                          style={{ width: `${data.currentCourse.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/50 mt-2">{data.currentCourse.progress}% complete</p>
                    </div>
                  </div>
                </div>
                <button className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-colors">
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Purchased Courses */}
          <AnimatedSection className="mb-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                My Courses
              </h2>
              <Link
                href="/my-courses"
                className="flex items-center gap-2 text-sm font-semibold text-surface-tint hover:gap-3 transition-all duration-300"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <StaggerChildren className="grid grid-cols-3 gap-6" stagger={0.08}>
              {data.purchasedCourses.map((course) => (
                <div key={course.id} className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden">
                  <div className="h-36 bg-gradient-to-br from-surface-container to-surface-container-high relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-surface-tint/10" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-[1.1rem] font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-4">{course.instructor}</p>
                    <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-surface-tint rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2 font-medium">{course.progress}% complete</p>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </AnimatedSection>

          {/* Recommended */}
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                Recommended for You
              </h2>
            </div>
            <StaggerChildren className="grid grid-cols-3 gap-6" stagger={0.08}>
              {data.recommended.map((course) => (
                <div key={course.id} className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden">
                  <div className="h-36 bg-gradient-to-br from-primary-container/30 to-secondary-container/20 relative" />
                  <div className="p-6">
                    <h3 className="font-heading text-[1.1rem] font-bold text-on-surface mb-3 group-hover:text-surface-tint transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-lg font-extrabold text-on-surface">
                        ${course.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                        <span className="text-sm font-semibold text-on-surface">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
