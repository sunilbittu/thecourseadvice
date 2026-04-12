"use client";

import { useState } from "react";
import { DashboardData } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import { BookOpen, CheckCircle2, Heart, Play, Clock, ArrowRight } from "lucide-react";

type Tab = "in-progress" | "completed" | "shortlisted";

export default function MyCoursesClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<Tab>("in-progress");

  const inProgress = data.purchasedCourses.filter((c) => c.progress < 100);
  const completed = data.purchasedCourses.filter((c) => c.progress === 100);

  const tabs: { id: Tab; label: string; count: number; icon: typeof BookOpen }[] = [
    { id: "in-progress", label: "In Progress", count: inProgress.length, icon: Play },
    { id: "completed", label: "Completed", count: completed.length, icon: CheckCircle2 },
    { id: "shortlisted", label: "Shortlisted", count: data.shortlist.length, icon: Heart },
  ];

  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto editorial-margins">
          <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
            My Courses
          </h1>
          <p className="text-lg text-on-surface-variant">Manage your enrolled courses and saved programs.</p>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-surface-tint text-white shadow-floating"
                    : "bg-white ghost-border text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20" : "bg-surface-container"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* In Progress */}
          {activeTab === "in-progress" && (
            <StaggerChildren className="grid grid-cols-2 gap-7" stagger={0.08}>
              {inProgress.map((course) => (
                <div key={course.id} className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden">
                  <div className="h-44 bg-surface-container-high relative flex items-center justify-center">
                    <span className="font-heading text-4xl font-extrabold text-on-surface-variant/15">
                      {course.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </span>
                    <div className="absolute bottom-4 right-4">
                      <button className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-editorial hover:bg-surface-container-low transition-colors">
                        <Play className="w-5 h-5 text-surface-tint ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="font-heading text-xl font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-5">{course.instructor}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full bg-surface-tint rounded-full transition-all duration-700"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-on-surface whitespace-nowrap">{course.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          )}

          {/* Completed */}
          {activeTab === "completed" && (
            <StaggerChildren className="grid grid-cols-2 gap-7" stagger={0.08}>
              {completed.length === 0 ? (
                <div className="col-span-2 text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-on-surface-variant/40" />
                  </div>
                  <p className="text-on-surface-variant">No completed courses yet</p>
                </div>
              ) : (
                completed.map((course) => (
                  <div key={course.id} className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden accent-bar pl-6">
                    <div className="p-7">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-heading text-xl font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-on-surface-variant mb-4">{course.instructor}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </StaggerChildren>
          )}

          {/* Shortlisted */}
          {activeTab === "shortlisted" && (
            <StaggerChildren className="grid grid-cols-3 gap-6" stagger={0.08}>
              {data.shortlist.map((course) => (
                <div key={course.id} className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden">
                  <div className="h-40 bg-surface-container relative flex items-center justify-center">
                    <span className="font-heading text-3xl font-extrabold text-on-surface-variant/15">
                      {course.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </span>
                    <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center">
                      <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-bold text-on-surface mb-1 group-hover:text-surface-tint transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-3">{course.instructor}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <span className="font-heading text-lg font-extrabold text-on-surface">
                        ${course.price.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-surface-tint opacity-0 group-hover:opacity-100 transition-all">
                        Enroll <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          )}
        </div>
      </div>
    </main>
  );
}
