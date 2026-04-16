"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ContentCategory } from "@/lib/types";
import { AnimatedSection } from "@/components/animated-section";
import MagneticButton from "@/components/magnetic-button";
import { FileText, Save, ArrowLeft, Tag, Search as SearchIcon, X } from "lucide-react";

export default function NewContentClient({ categories }: { categories: ContentCategory[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    coverImage: "",
    category: categories[0]?.name ?? "",
    tags: [] as string[],
    status: "draft" as "draft" | "review" | "published",
    seoTitle: "",
    seoDescription: "",
  });

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSlugify = (title: string) => {
    updateField("title", title);
    updateField(
      "slug",
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      updateField("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = crypto.randomUUID();
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id }),
      });
      if (res.ok) {
        router.push("/institution/content");
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-surface-container-low rounded-xl px-5 py-4 text-on-surface font-medium border border-outline-variant/20 focus:border-surface-tint focus:outline-none transition-colors";

  return (
    <main className="flex-1 page-enter">
      <section className="px-8 pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto editorial-margins">
          <Link
            href="/institution/content"
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Content
          </Link>
          <h1 className="font-heading text-[2.75rem] font-extrabold tracking-[-0.02em] text-on-surface mb-2">
            New Post
          </h1>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="px-8 py-10">
        <div className="max-w-[900px] mx-auto space-y-8">
          {/* Main Content */}
          <AnimatedSection>
            <div className="bg-white rounded-2xl p-8 ghost-border space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-tint/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-surface-tint" />
                </div>
                <h2 className="font-heading text-xl font-bold text-on-surface">Post Details</h2>
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleSlugify(e.target.value)}
                  placeholder="Enter your post title..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Excerpt</label>
                <textarea
                  required
                  value={form.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  rows={2}
                  placeholder="A brief summary of your post..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Body (Markdown)</label>
                <textarea
                  required
                  value={form.body}
                  onChange={(e) => updateField("body", e.target.value)}
                  rows={14}
                  placeholder="Write your content in Markdown..."
                  className={`${inputClass} resize-y font-mono text-sm`}
                />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => updateField("coverImage", e.target.value)}
                  placeholder="/images/content/your-image.jpg"
                  className={inputClass}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Category & Tags */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-2xl p-8 ghost-border space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-warning" />
                </div>
                <h2 className="font-heading text-xl font-bold text-on-surface">Organization</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-caps text-on-surface-variant block mb-2">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value as typeof form.status)}
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Submit for Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 bg-surface-tint/10 text-surface-tint rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* SEO */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-2xl p-8 ghost-border space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <SearchIcon className="w-5 h-5 text-success" />
                </div>
                <h2 className="font-heading text-xl font-bold text-on-surface">SEO</h2>
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="Custom title for search engines (optional)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="label-caps text-on-surface-variant block mb-2">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  rows={2}
                  placeholder="Meta description for search results (optional)"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </AnimatedSection>

          <div className="flex justify-end">
            <MagneticButton
              className="bg-surface-tint text-white font-heading font-bold text-sm px-8 py-4 rounded-xl hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
              strength={0.15}
              type="submit"
            >
              <Save className="w-4 h-4" /> {saving ? "Creating..." : "Create Post"}
            </MagneticButton>
          </div>
        </div>
      </form>
    </main>
  );
}
