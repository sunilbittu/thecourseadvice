"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatedSection } from "@/components/animated-section";
import MagneticButton from "@/components/magnetic-button";
import { BookOpen, Save, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const levels = ["Beginner", "Intermediate", "Advanced"] as const;
const deliveryOptions = ["Online", "In-Person", "Hybrid"] as const;

interface CourseData {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  category: string;
  level: string;
  duration: string;
  language: string;
  delivery: string;
  certification: boolean;
  image: string;
  institution: string;
  curriculum: { title: string; duration: string; lessons: number }[];
  perks: string[];
}

export default function EditCourseClient({
  course,
  categories,
}: {
  course: CourseData;
  categories: string[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ ...course });

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/institution");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/courses/${course.slug}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/institution");
      }
    } finally {
      setDeleting(false);
    }
  };

  const inputClass =
    "w-full bg-surface-container-low rounded-xl px-5 py-4 text-on-surface font-medium border border-outline-variant/20 focus:border-surface-tint focus:outline-none transition-colors";

  return (
    <main className="flex-1 page-enter">
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto editorial-margins">
          <Link
            href="/institution"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
            {course.title}
          </h1>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="px-8 py-10">
        <div className="max-w-[900px] mx-auto space-y-8">
          <AnimatedSection>
            <div className="bg-white rounded-2xl p-8 ghost-border space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-surface-tint" />
                </div>
                <h2 className="font-heading text-xl font-bold text-on-surface">Course Details</h2>
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Title</label>
                <input type="text" required value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Description</label>
                <textarea required value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} className={`${inputClass} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Instructor</label>
                  <input type="text" required value={form.instructor} onChange={(e) => updateField("instructor", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Price (USD)</label>
                  <input type="number" required min={0} value={form.price} onChange={(e) => updateField("price", parseInt(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Category</label>
                  <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className={inputClass}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Level</label>
                  <select value={form.level} onChange={(e) => updateField("level", e.target.value)} className={inputClass}>
                    {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Delivery</label>
                  <select value={form.delivery} onChange={(e) => updateField("delivery", e.target.value)} className={inputClass}>
                    {deliveryOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Duration</label>
                <input type="text" required value={form.duration} onChange={(e) => updateField("duration", e.target.value)} className={inputClass} />
              </div>
            </div>
          </AnimatedSection>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-error font-heading font-bold text-sm px-6 py-4 rounded-xl hover:bg-error/10 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Delete Course"}
            </button>
            <MagneticButton
              className="bg-surface-tint text-white font-heading font-bold text-sm px-8 py-4 rounded-xl hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
              strength={0.15}
              type="submit"
            >
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
            </MagneticButton>
          </div>
        </div>
      </form>
    </main>
  );
}
