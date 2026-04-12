"use client";

import Link from "next/link";
import { AnalyticsData } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import Counter from "@/components/counter";
import { Eye, Users, TrendingUp, Clock, ArrowLeft, MapPin, ChevronUp, ChevronDown, Minus } from "lucide-react";

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const maxLeads = Math.max(...data.interestOverTime.map((d) => d.leads));

  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto">
          <Link
            href="/institution"
            className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="editorial-margins">
            <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
              Analytics
            </h1>
            <p className="text-lg text-on-surface-variant">Deep dive into your course performance and audience behavior.</p>
          </div>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto">
          {/* KPIs */}
          <StaggerChildren className="grid grid-cols-4 gap-6 mb-14" stagger={0.08}>
            {[
              { icon: Eye, label: "Total Views", value: data.kpis.totalViews, color: "surface-tint" },
              { icon: Users, label: "Total Leads", value: data.kpis.totalLeads, color: "primary-container" },
              { icon: TrendingUp, label: "Conversion Rate", value: data.kpis.conversionRate, suffix: "%", decimals: 2, color: "success" },
              { icon: Clock, label: "Avg Time on Page", valueStr: data.kpis.avgTimeOnPage, color: "warning" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl p-7 ghost-border card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-${kpi.color}/10 flex items-center justify-center`}>
                    <kpi.icon className={`w-5 h-5 text-${kpi.color}`} />
                  </div>
                  <p className="label-caps text-on-surface-variant">{kpi.label}</p>
                </div>
                {"valueStr" in kpi && kpi.valueStr ? (
                  <p className="font-heading text-[2.5rem] font-extrabold text-on-surface leading-none">
                    {kpi.valueStr}
                  </p>
                ) : (
                  <p className="font-heading text-[2.5rem] font-extrabold text-on-surface leading-none">
                    <Counter value={kpi.value || 0} suffix={kpi.suffix || ""} decimals={kpi.decimals || 0} />
                  </p>
                )}
              </div>
            ))}
          </StaggerChildren>

          <div className="grid grid-cols-12 gap-8 mb-14">
            {/* Interest Over Time - Bar Chart */}
            <AnimatedSection className="col-span-8">
              <div className="bg-white rounded-2xl p-8 ghost-border h-full">
                <h2 className="font-heading text-xl font-bold text-on-surface mb-8">Interest Over Time</h2>
                <div className="flex items-end gap-5 h-56">
                  {data.interestOverTime.map((item) => {
                    const heightPct = (item.leads / maxLeads) * 100;
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-3 group">
                        <span className="text-xs font-bold text-on-surface opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.leads}
                        </span>
                        <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                          <div className="absolute inset-0 bg-surface-tint/10 rounded-lg" />
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-tint to-surface-tint/70 rounded-lg transition-all duration-500 group-hover:from-primary group-hover:to-primary-container"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-on-surface-variant">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>

            {/* Delivery Preference */}
            <AnimatedSection className="col-span-4" delay={0.15}>
              <div className="bg-white rounded-2xl p-8 ghost-border h-full">
                <h2 className="font-heading text-xl font-bold text-on-surface mb-8">Delivery Preference</h2>
                <div className="space-y-6">
                  {data.deliveryPreference.map((item, i) => {
                    const colors = ["bg-surface-tint", "bg-secondary-container", "bg-warning"];
                    return (
                      <div key={item.type}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-on-surface">{item.type}</span>
                          <span className="font-heading text-lg font-extrabold text-on-surface">{item.percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-surface-container-highest/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[i] || "bg-surface-tint"} rounded-full transition-all duration-700`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Course Performance Table */}
          <AnimatedSection className="mb-14">
            <div className="bg-white rounded-2xl ghost-border overflow-hidden">
              <div className="p-7 pb-5">
                <h2 className="font-heading text-xl font-bold text-on-surface">Course Performance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-container-low/40">
                      <th className="text-left px-7 py-3 label-caps text-on-surface-variant font-bold">Course</th>
                      <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Views</th>
                      <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Leads</th>
                      <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Conversion</th>
                      <th className="text-left px-4 py-3 label-caps text-on-surface-variant font-bold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.coursePerformance.map((course) => (
                      <tr key={course.id} className="table-row-hover group">
                        <td className="px-7 py-4 text-sm font-semibold text-on-surface group-hover:text-surface-tint transition-colors">
                          {course.title}
                        </td>
                        <td className="px-4 py-4 text-sm text-on-surface-variant font-medium">{course.views.toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm text-on-surface-variant font-medium">{course.leads}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-on-surface">{course.conversion}%</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                              course.trend === "up"
                                ? "bg-success/10 text-success"
                                : course.trend === "down"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            {course.trend === "up" ? <ChevronUp className="w-3 h-3" /> : course.trend === "down" ? <ChevronDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {course.trend === "up" ? "Up" : course.trend === "down" ? "Down" : "Stable"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>

          {/* Top Locations */}
          <AnimatedSection>
            <h2 className="font-heading text-xl font-bold text-on-surface mb-6">Top Locations</h2>
            <StaggerChildren className="grid grid-cols-5 gap-5" stagger={0.06}>
              {data.topLocations.map((loc, i) => (
                <div key={loc.city} className="bg-white rounded-2xl p-6 ghost-border card-hover text-center relative overflow-hidden">
                  {i === 0 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-surface-tint to-primary-container" />
                  )}
                  <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-5 h-5 text-surface-tint" />
                  </div>
                  <p className="font-heading text-2xl font-extrabold text-on-surface leading-none mb-1">
                    <Counter value={loc.leads} />
                  </p>
                  <p className="text-sm font-semibold text-on-surface">{loc.city}</p>
                  <p className="text-xs text-on-surface-variant">{loc.country}</p>
                </div>
              ))}
            </StaggerChildren>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
