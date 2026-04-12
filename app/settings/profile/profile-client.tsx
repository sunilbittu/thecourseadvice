"use client";

import { User } from "@/lib/types";
import { AnimatedSection } from "@/components/animated-section";
import MagneticButton from "@/components/magnetic-button";
import { Mail, Globe, Link as LinkIcon, AtSign, BookOpen, Heart, Edit3, Camera, Shield } from "lucide-react";

export default function ProfileClient({ user }: { user: User }) {
  return (
    <main className="flex-1 page-enter">
      {/* Header */}
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto editorial-margins">
          <p className="label-caps text-surface-tint mb-3 tracking-[0.3em]">Account</p>
          <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
            Profile Settings
          </h1>
          <p className="text-lg text-on-surface-variant">Manage your personal information and preferences.</p>
        </div>
      </section>

      <div className="px-8 py-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="col-span-8 space-y-8">
            {/* Personal Info */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-8 ghost-border">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-surface-tint" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-on-surface">Personal Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-caps text-on-surface-variant block mb-2.5">Full Name</label>
                      <div className="bg-surface-container-low rounded-xl px-5 py-4 text-on-surface font-medium">
                        {user.name}
                      </div>
                    </div>
                    <div>
                      <label className="label-caps text-on-surface-variant block mb-2.5">Email</label>
                      <div className="bg-surface-container-low rounded-xl px-5 py-4 text-on-surface font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-on-surface-variant" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-on-surface-variant block mb-2.5">Bio</label>
                    <div className="bg-surface-container-low rounded-xl px-5 py-4 text-on-surface leading-[1.7]">
                      {user.bio}
                    </div>
                  </div>
                  <div>
                    <label className="label-caps text-on-surface-variant block mb-2.5">Role</label>
                    <div className="inline-flex items-center gap-2 bg-surface-tint/10 text-surface-tint text-sm font-bold px-4 py-2 rounded-full capitalize">
                      {user.role.replace("-", " ")}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Social Links */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-2xl p-8 ghost-border">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-success" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-on-surface">Social Links</h2>
                </div>
                <div className="space-y-4">
                  {user.socialLinks.linkedin && (
                    <div className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-4 group hover:bg-surface-container transition-colors">
                      <LinkIcon className="w-5 h-5 text-on-surface-variant group-hover:text-surface-tint transition-colors" />
                      <span className="text-surface-tint font-medium text-sm">{user.socialLinks.linkedin}</span>
                    </div>
                  )}
                  {user.socialLinks.twitter && (
                    <div className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-4 group hover:bg-surface-container transition-colors">
                      <AtSign className="w-5 h-5 text-on-surface-variant group-hover:text-surface-tint transition-colors" />
                      <span className="text-surface-tint font-medium text-sm">{user.socialLinks.twitter}</span>
                    </div>
                  )}
                  {user.socialLinks.website && (
                    <div className="flex items-center gap-4 bg-surface-container-low rounded-xl px-5 py-4 group hover:bg-surface-container transition-colors">
                      <Globe className="w-5 h-5 text-on-surface-variant group-hover:text-surface-tint transition-colors" />
                      <span className="text-surface-tint font-medium text-sm">{user.socialLinks.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="col-span-4">
            <AnimatedSection delay={0.2}>
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl p-8 ghost-border">
                  {/* Avatar */}
                  <div className="text-center mb-8">
                    <div className="relative inline-block">
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-surface-container to-surface-container-high mx-auto flex items-center justify-center">
                        <span className="font-heading text-3xl font-extrabold text-primary/30">
                          {user.name.split(" ").map(w => w[0]).join("")}
                        </span>
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-surface-tint text-white flex items-center justify-center shadow-floating hover:brightness-110 transition-all">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-on-surface mt-5">{user.name}</h3>
                    <p className="text-sm text-on-surface-variant capitalize mt-1">{user.role.replace("-", " ")}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <BookOpen className="w-4 h-4" /> Enrolled Courses
                      </span>
                      <span className="font-heading text-lg font-extrabold text-on-surface">{user.enrolledCourses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <Heart className="w-4 h-4" /> Shortlisted
                      </span>
                      <span className="font-heading text-lg font-extrabold text-on-surface">{user.shortlist.length}</span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="mt-8">
                    <MagneticButton
                      className="w-full bg-surface-tint text-white font-heading font-bold text-sm py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      strength={0.15}
                    >
                      <Edit3 className="w-4 h-4" /> Edit Profile
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
}
