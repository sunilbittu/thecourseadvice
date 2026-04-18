"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course } from "@/lib/types";
import { AnimatedSection, StaggerChildren } from "@/components/animated-section";
import MagneticButton from "@/components/magnetic-button";
import Counter from "@/components/counter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star, Users, Clock, Globe, BookOpen, Award, CheckCircle2,
  ChevronLeft, Heart, Share2, Play, Monitor, MapPin,
  Briefcase, UserCheck, BadgeCheck, GraduationCap,
  Target, FileText, MessagesSquare
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const deliveryIcon: Record<string, typeof Monitor> = {
  "Online": Monitor,
  "In-Person": MapPin,
  "Hybrid": Globe,
};

interface Props {
  course: Course;
  instituteSlug?: string | null;
  isEnrolled?: boolean;
  isShortlisted?: boolean;
  isSignedIn?: boolean;
}

const getModuleHighlights = (moduleTitle: string, lessons: number) => [
  `${lessons} guided lessons with practical demonstrations and examples.`,
  `Hands-on exercises focused on ${moduleTitle.toLowerCase()}.`,
  "Checkpoint quiz and recap notes to reinforce key concepts.",
];

const getPrerequisites = (course: Course) => {
  const levelPrerequisite: Record<Course["level"], string> = {
    Beginner: "No prior experience is required; basic computer literacy is enough.",
    Intermediate: "Foundational knowledge in this subject area is recommended.",
    Advanced: "Strong prior experience with core concepts is expected.",
  };

  return [
    levelPrerequisite[course.level],
    "Commitment of 5-7 hours per week for lessons, practice, and revision.",
    `Ability to follow instruction and coursework in ${course.language}.`,
    "Stable internet connection and a laptop or desktop for assignments.",
  ];
};

type FeatureHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const getCourseFeatureHighlights = (course: Course): FeatureHighlight[] => {
  const deliveryMode = course.delivery.toLowerCase();
  const topModules = course.curriculum.slice(0, 2).map((module) => module.title).join(" and ");
  const totalLessons = course.curriculum.reduce((sum, module) => sum + module.lessons, 0);

  return [
    {
      title: "Practical Curriculum",
      description: `${course.curriculum.length} modules and ${totalLessons} lessons built around real outcomes.`,
      icon: Briefcase,
    },
    {
      title: "Expert-Led Training",
      description: `Learn directly from ${course.instructor} through guided sessions and examples.`,
      icon: UserCheck,
    },
    {
      title: `${course.delivery} Learning`,
      description: `Flexible ${deliveryMode} delivery designed for working learners.`,
      icon: course.delivery === "Online" ? Monitor : course.delivery === "In-Person" ? MapPin : Globe,
    },
    {
      title: course.certification ? "Certification Track" : "Skill Mastery Track",
      description: course.certification
        ? "Complete assessments and earn a course certificate on graduation."
        : "Focus on practical capability building through projects and assessments.",
      icon: BadgeCheck,
    },
    {
      title: "Focused Learning Path",
      description: topModules
        ? `Deep dive into ${topModules.toLowerCase()} with structured progression.`
        : "Structured weekly progression with module-wise checkpoints.",
      icon: GraduationCap,
    },
    {
      title: "Performance Reviews",
      description: "Regular practice tasks and feedback checkpoints after each module.",
      icon: Target,
    },
    {
      title: "Career Assets",
      description: "Build portfolio-ready deliverables you can present in interviews.",
      icon: FileText,
    },
    {
      title: "Communication & Growth",
      description: "Improve collaboration, communication, and presentation confidence.",
      icon: MessagesSquare,
    },
  ];
};

const getAdditionalBenefits = (course: Course) => {
  const weeks = Number.parseInt(course.duration, 10);
  const accessMonths = Number.isNaN(weeks) ? 6 : Math.max(3, Math.ceil(weeks / 4));

  const dynamicItems = [
    `${course.duration} guided roadmap with milestone tracking`,
    `${course.studentCount.toLocaleString()}+ learner community access`,
    `${accessMonths}-${accessMonths + 3} months LMS content access`,
    `${course.delivery} support with flexible learning pace`,
    ...course.perks,
  ];

  return Array.from(new Set(dynamicItems)).slice(0, 6);
};

export default function CourseDetailClient({
  course,
  instituteSlug,
  isEnrolled = false,
  isShortlisted = false,
  isSignedIn = false,
}: Props) {
  const DeliveryIcon = deliveryIcon[course.delivery] || Globe;
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const featureHighlights = getCourseFeatureHighlights(course);
  const benefitItems = getAdditionalBenefits(course);

  const handleEnroll = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleShortlist = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setShortlistLoading(true);
    try {
      if (shortlisted) {
        await fetch("/api/shortlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id }),
        });
        setShortlisted(false);
      } else {
        await fetch("/api/shortlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id }),
        });
        setShortlisted(true);
      }
    } finally {
      setShortlistLoading(false);
    }
  };

  return (
    <main className="flex-1 page-enter">
      {/* Hero Banner */}
      <section className="bg-primary">
        <div className="max-w-[1440px] mx-auto px-8 pt-8 pb-16">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Courses
          </Link>

          <div className="grid grid-cols-12 gap-8 items-end">
            <div className="col-span-8">
              <span className="inline-block bg-white/15 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
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
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 mb-4">
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
            {/* Course Overview */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 ghost-border mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                    Course Overview
                  </h2>
                </div>

                <p className="text-on-surface-variant leading-[1.8] mb-6">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-surface-container-low px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant mb-1">Level</p>
                    <p className="font-semibold text-on-surface">{course.level}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-low px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant mb-1">Duration</p>
                    <p className="font-semibold text-on-surface">{course.duration}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-low px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant mb-1">Delivery</p>
                    <p className="font-semibold text-on-surface">{course.delivery}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-low px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant mb-1">Language</p>
                    <p className="font-semibold text-on-surface">{course.language}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

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

                <StaggerChildren stagger={0.06}>
                  <Accordion
                    type="single"
                    defaultValue="module-0"
                    className="space-y-3"
                  >
                    {course.curriculum.map((module, i) => (
                      <AccordionItem
                        key={i}
                        value={`module-${i}`}
                        className="group bg-white rounded-2xl px-6 py-4 ghost-border card-hover"
                      >
                        <AccordionTrigger className="hover:no-underline py-1">
                          <div className="flex items-center gap-5 w-full pr-3">
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
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-1">
                          <ul className="space-y-2 pl-2">
                            {getModuleHighlights(module.title, module.lessons).map((point) => (
                              <li
                                key={point}
                                className="text-sm text-on-surface-variant flex items-start gap-2"
                              >
                                <span className="text-surface-tint mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </StaggerChildren>
              </div>
            </AnimatedSection>

            {/* Prerequisites */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 ghost-border mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-warning" />
                  </div>
                  <h2 className="font-heading text-[1.75rem] font-bold tracking-[-0.015em] text-on-surface">
                    Prerequisites
                  </h2>
                </div>

                <ul className="space-y-3">
                  {getPrerequisites(course).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Course Features & Highlights */}
            <AnimatedSection>
              <div className="mb-14">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-[1.9rem] font-bold tracking-[-0.015em] text-on-surface mb-2">
                    Course Features & Highlights
                  </h2>
                  <p className="text-on-surface-variant">
                    Everything you need to build practical skills and become job-ready.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                  {featureHighlights.map((feature) => (
                    <div
                      key={feature.title}
                      className="bg-white rounded-2xl border border-outline-variant/30 p-5"
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                        <feature.icon className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant leading-6">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-surface-container-low ghost-border p-6">
                  <h3 className="font-heading text-2xl font-bold text-on-surface text-center mb-5">
                    Additional Benefits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {benefitItems.map((benefit) => (
                      <div
                        key={benefit}
                        className="rounded-xl border border-outline-variant/40 bg-surface-container px-4 py-3 text-sm font-medium text-on-surface"
                      >
                        <span className="mr-2 text-surface-tint">•</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
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
                    {instituteSlug ? (
                      <Link
                        href={`/institutes/${instituteSlug}`}
                        className="text-sm text-surface-tint font-semibold hover:opacity-80 transition-opacity"
                      >
                        {course.institution}
                      </Link>
                    ) : (
                      <p className="text-sm text-on-surface-variant">{course.institution}</p>
                    )}
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
                    {isEnrolled ? (
                      <Link
                        href="/my-courses"
                        className="w-full bg-success text-white font-heading font-bold text-[15px] py-4 rounded-xl flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Enrolled — Go to My Courses
                      </Link>
                    ) : (
                      <MagneticButton
                        className="w-full bg-surface-tint text-white font-heading font-bold text-[15px] py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                        strength={0.15}
                        onClick={handleEnroll}
                      >
                        {enrolling ? "Redirecting..." : "Enroll Now"}
                      </MagneticButton>
                    )}
                    <button
                      onClick={handleShortlist}
                      disabled={shortlistLoading}
                      className={`w-full font-heading font-bold text-[15px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                        shortlisted
                          ? "bg-surface-tint/10 text-surface-tint"
                          : "ghost-border text-surface-tint hover:bg-surface-container-low"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${shortlisted ? "fill-current" : ""}`} />
                      {shortlisted ? "Shortlisted" : "Add to Shortlist"}
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
