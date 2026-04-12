"use client";

import Link from "next/link";
import { Course } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import MagneticButton from "@/components/magnetic-button";
import Counter from "@/components/counter";
import {
  Star, Users, Clock, Globe, BookOpen, Award, CheckCircle2,
  ChevronLeft, Heart, Share2, Play, Monitor, MapPin
} from "lucide-react";

const deliveryIcon: Record<string, typeof Monitor> = {
  "Online": Monitor,
  "In-Person": MapPin,
  "Hybrid": Globe,
};

export default function CourseDetailClient({ course }: { course: Course }) {
  const DeliveryIcon = deliveryIcon[course.delivery] || Globe;

  return (
    <main className="flex-1 page-enter">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-surface-tint" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 pt-8 pb-16">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </Link>

          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-8">
              <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
                {course.category}
              </span>
              <h1 className="font-heading text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/70 leading-[1.7] max-w-2xl mb-8">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {course.duration}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> {course.level}
                </span>
                <span className="flex items-center gap-2">
                  <DeliveryIcon className="w-4 h-4" /> {course.delivery}
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> {course.language}
                </span>
              </div>
            </div>

            <div className="col-span-4 text-right">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-white font-bold">{course.rating}</span>
                <span className="text-white/60 text-sm">({course.reviewCount} reviews)</span>
              </div>
              <p className="text-white/60 text-sm">
                <Users className="w-4 h-4 inline mr-1" />
                {course.studentCount.toLocaleString()} students enrolled
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="col-span-8">
            {/* Curriculum */}
            <AnimatedSection>
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-surface-tint" />
                  </div>
                  <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                    Curriculum
                  </h2>
                  <span className="ml-auto text-sm text-on-surface-variant">
                    {course.curriculum.length} modules
                  </span>
                </div>

                <StaggerChildren className="space-y-3" stagger={0.06}>
                  {course.curriculum.map((module, i) => (
                    <div
                      key={i}
                      className="group bg-white rounded-2xl p-6 ghost-border card-hover cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <span className="font-heading text-3xl font-extrabold text-surface-container-highest group-hover:text-surface-tint transition-colors duration-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-heading text-[1.1rem] font-bold text-on-surface group-hover:text-surface-tint transition-colors duration-300">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-on-surface-variant mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {module.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Play className="w-3.5 h-3.5" /> {module.lessons} lessons
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </StaggerChildren>
              </div>
            </AnimatedSection>

            {/* Instructor */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 ghost-border mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                    Instructor
                  </h2>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center">
                    <span className="font-heading text-2xl font-extrabold text-primary/30">
                      {course.instructor.split(" ").map(w => w[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-on-surface">{course.instructor}</h3>
                    <p className="text-sm text-on-surface-variant">{course.institution}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            <div className="sticky top-24">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-3xl p-8 shadow-floating ghost-border">
                  <div className="mb-6">
                    <p className="font-heading text-[3rem] font-extrabold text-on-surface leading-none">
                      ${course.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-on-surface-variant mt-2">One-time payment</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <MagneticButton
                      className="w-full bg-surface-tint text-white font-heading font-bold text-[15px] py-4 rounded-xl hover:brightness-110 transition-all"
                      strength={0.15}
                    >
                      Enroll Now
                    </MagneticButton>
                    <button className="w-full ghost-border text-surface-tint font-heading font-bold text-[15px] py-4 rounded-xl hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4" /> Add to Shortlist
                    </button>
                    <button className="w-full text-on-surface-variant font-medium text-sm py-3 rounded-xl hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" /> Share Course
                    </button>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                    {[
                      { icon: Clock, label: "Duration", value: course.duration },
                      { icon: BookOpen, label: "Level", value: course.level },
                      { icon: DeliveryIcon, label: "Delivery", value: course.delivery },
                      { icon: Globe, label: "Language", value: course.language },
                      { icon: Award, label: "Certificate", value: course.certification ? "Yes" : "No" },
                    ].map((info) => (
                      <div key={info.label} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-on-surface-variant">
                          <info.icon className="w-4 h-4" /> {info.label}
                        </span>
                        <span className="text-sm font-semibold text-on-surface">{info.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Perks */}
                  {course.perks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-outline-variant/10">
                      <p className="label-caps text-on-surface-variant mb-4">What You Get</p>
                      <ul className="space-y-3">
                        {course.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-3 text-sm text-on-surface-variant">
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
