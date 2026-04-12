"use client";

import { ResourcesData } from "@/lib/types";
import { AnimatedSection, StaggerChildren, ParallaxElement } from "@/components/animated-section";
import HeroText from "@/components/hero-text";
import { BookOpen, FileText, Video, Wrench, Download, ArrowRight, Sparkles } from "lucide-react";

const typeIcons: Record<string, typeof BookOpen> = {
  guide: BookOpen,
  template: FileText,
  video: Video,
  tool: Wrench,
};

const typeColors: Record<string, string> = {
  guide: "bg-surface-tint/10 text-surface-tint",
  template: "bg-success/10 text-success",
  video: "bg-warning/10 text-warning",
  tool: "bg-secondary/10 text-secondary",
};

export default function ResourcesClient({ data }: { data: ResourcesData }) {
  return (
    <main className="flex-1 page-enter">
      {/* Hero */}
      <section className="relative py-24 px-8 overflow-hidden">
        <ParallaxElement className="absolute top-10 right-[20%] w-[400px] h-[400px] bg-surface-tint/[0.05] blur-orb" speed={-20}><span /></ParallaxElement>
        <ParallaxElement className="absolute bottom-0 left-[15%] w-[300px] h-[300px] bg-secondary-container/[0.08] blur-orb" speed={-15}><span /></ParallaxElement>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="editorial-margins">
            <AnimatedSection y={0}>
              <p className="label-caps text-surface-tint mb-5 tracking-[0.3em]">Resources</p>
            </AnimatedSection>
            <h1 className="font-heading text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-on-surface mb-6 max-w-3xl">
              <HeroText text="The Scholarly Hub" />
            </h1>
            <AnimatedSection delay={0.4} y={30}>
              <p className="text-xl leading-[1.7] text-on-surface-variant max-w-xl">
                Guides, templates, tools, and insights to help you make informed decisions about your education.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="px-8 pb-20">
        <div className="max-w-[1440px] mx-auto">
          <StaggerChildren className="grid grid-cols-4 gap-5" stagger={0.08}>
            {data.categories.map((cat, i) => {
              const icons = [BookOpen, FileText, Sparkles, Video];
              const Icon = icons[i] || BookOpen;
              return (
                <div
                  key={cat.id}
                  className="group bg-white rounded-2xl p-7 ghost-border card-hover relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-surface-tint/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-surface-tint/[0.06] transition-colors duration-500" />
                  <div className="w-12 h-12 rounded-xl bg-surface-tint/10 flex items-center justify-center mb-5 group-hover:bg-surface-tint/15 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-surface-tint" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-on-surface mb-2 group-hover:text-surface-tint transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{cat.description}</p>
                  <p className="text-xs font-semibold text-surface-tint">{cat.assetCount} resources</p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Featured Assets */}
      <section className="px-8 py-20 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Featured</p>
                <h2 className="font-heading text-[2.25rem] font-extrabold tracking-[-0.02em] text-on-surface">
                  Editor&apos;s Picks
                </h2>
              </div>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-2 gap-8" stagger={0.1}>
            {data.featuredAssets.map((asset) => {
              const Icon = typeIcons[asset.type] || BookOpen;
              const colorClass = typeColors[asset.type] || "bg-surface-tint/10 text-surface-tint";
              return (
                <div
                  key={asset.id}
                  className="group bg-white rounded-2xl ghost-border card-hover overflow-hidden"
                >
                  <div className="h-52 bg-gradient-to-br from-primary-container/30 to-surface-tint/15 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-editorial">
                        <Icon className="w-7 h-7 text-surface-tint" />
                      </div>
                    </div>
                  </div>
                  <div className="p-7">
                    <span className={`inline-flex items-center gap-1.5 ${colorClass} text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4`}>
                      <Icon className="w-3 h-3" />
                      {asset.type}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-on-surface mb-2 group-hover:text-surface-tint transition-colors">
                      {asset.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-[1.7] mb-5">{asset.description}</p>
                    <button className="flex items-center gap-2 text-sm font-semibold text-surface-tint hover:gap-3 transition-all duration-300">
                      <Download className="w-4 h-4" /> Download Resource
                    </button>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Scholarly Tools */}
      <section className="px-8 py-20">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection>
            <div className="mb-12">
              <p className="label-caps text-surface-tint mb-4 tracking-[0.3em]">Interactive</p>
              <h2 className="font-heading text-[2.25rem] font-extrabold tracking-[-0.02em] text-on-surface">
                Scholarly Tools
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-3 gap-7" stagger={0.1}>
            {data.scholarlyTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative bg-gradient-to-br from-primary via-primary-container to-surface-tint rounded-3xl p-10 overflow-hidden card-hover"
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-white rounded-full blur-[60px]" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-6">
                    <Wrench className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">{tool.name}</h3>
                  <p className="text-white/60 text-[15px] leading-[1.7] mb-6">{tool.description}</p>
                  <button className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white hover:gap-3 transition-all duration-300">
                    Launch Tool <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </main>
  );
}
