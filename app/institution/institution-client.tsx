"use client";

import { useState } from "react";
import Link from "next/link";
import { InstitutionDashboardData } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import Counter from "@/components/counter";
import { Users, BookOpen, Heart, Target, ArrowRight, BarChart3, Plus, MoreHorizontal } from "lucide-react";

export default function InstitutionClient({ data: initialData }: { data: InstitutionDashboardData }) {
  const [data, setData] = useState(initialData);

  const updateLeadStatus = async (leadId: string, status: "new" | "contacted" | "enrolled") => {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        recentLeads: prev.recentLeads.map((l) =>
          l.id === leadId ? { ...l, status } : l
        ),
      }));
    }
  };
  const goalProgress = Math.round((data.monthlyGoal.current / data.monthlyGoal.target) * 100);

  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto flex items-end justify-between">
          <div className="editorial-margins">
            <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-on-surface-variant">Overview of your courses, leads, and performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/institution/analytics"
              className="flex items-center gap-2 px-5 py-3 rounded-xl ghost-border text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all"
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </Link>
            <Link
              href="/institution/courses/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-tint text-white text-sm font-semibold hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" /> New Course
            </Link>
          </div>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto">
          {/* KPI Stats */}
          <StaggerChildren className="grid grid-cols-4 gap-6 mb-14" stagger={0.08}>
            {[
              { icon: Users, label: "Total Leads", value: data.totalLeads, color: "surface-tint" },
              { icon: BookOpen, label: "Active Courses", value: data.activeCourses, color: "success" },
              { icon: Heart, label: "Interested Students", value: data.interestedStudents, color: "warning" },
              { icon: Target, label: "Monthly Goal", value: goalProgress, suffix: "%", color: "secondary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-7 ghost-border card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <p className="label-caps text-on-surface-variant">{stat.label}</p>
                </div>
                <p className="font-heading text-[2.5rem] font-extrabold text-on-surface leading-none">
                  <Counter value={stat.value} suffix={stat.suffix || ""} />
                </p>
                {stat.label === "Monthly Goal" && (
                  <div className="h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${goalProgress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </StaggerChildren>

          <div className="grid grid-cols-12 gap-8">
            {/* Recent Leads */}
            <AnimatedSection className="col-span-7">
              <div className="bg-white rounded-2xl ghost-border overflow-hidden">
                <div className="flex items-center justify-between p-7 pb-5">
                  <h2 className="font-heading text-xl font-bold text-on-surface">Recent Leads</h2>
                  <button className="text-sm font-semibold text-surface-tint flex items-center gap-1 hover:gap-2 transition-all">
                    View all <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-container-low/40">
                        <th className="text-left px-7 py-3 label-caps text-on-surface-variant font-bold">Name</th>
                        <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Course</th>
                        <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Date</th>
                        <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentLeads.map((lead) => (
                        <tr key={lead.id} className="table-row-hover group">
                          <td className="px-7 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                                <span className="text-xs font-bold text-primary/40">
                                  {lead.name.split(" ").map(w => w[0]).join("")}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-on-surface">{lead.name}</p>
                                <p className="text-xs text-on-surface-variant">{lead.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-on-surface-variant max-w-[180px] truncate">{lead.course}</td>
                          <td className="px-4 py-4 text-sm text-on-surface-variant">{lead.date}</td>
                          <td className="px-4 py-4">
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                updateLeadStatus(
                                  lead.id,
                                  e.target.value as "new" | "contacted" | "enrolled"
                                )
                              }
                              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-none cursor-pointer ${
                                lead.status === "enrolled"
                                  ? "bg-success/10 text-success"
                                  : lead.status === "contacted"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-surface-tint/10 text-surface-tint"
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>

            {/* My Courses */}
            <AnimatedSection className="col-span-5" delay={0.15}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-on-surface">My Courses</h2>
              </div>
              <div className="space-y-4">
                {data.myCourses.map((course) => (
                  <Link key={course.id} href={`/institution/courses/${course.id}/edit`} className="group block bg-white rounded-2xl p-6 ghost-border card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading text-[1.05rem] font-bold text-on-surface group-hover:text-surface-tint transition-colors">
                        {course.title}
                      </h3>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0 ml-3 ${
                          course.status === "active"
                            ? "bg-success/10 text-success"
                            : course.status === "draft"
                            ? "bg-warning/10 text-warning"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {course.students.toLocaleString()} students
                      </span>
                      <span className="font-semibold text-on-surface">${course.revenue.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
}
