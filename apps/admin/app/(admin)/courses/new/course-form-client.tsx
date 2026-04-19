"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@courseadvice/ui/button";
import { Input } from "@courseadvice/ui/input";
import { cn } from "@courseadvice/ui/utils";
import type { Course, Category, Institution } from "@courseadvice/types";

interface CourseFormClientProps {
  categories: Pick<Category, "id" | "name">[];
  institutions: Pick<Institution, "id" | "name">[];
  initialData?: Partial<Course>;
  courseId?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const DELIVERIES = ["Online", "In-Person", "Hybrid"] as const;
const STATUSES = ["draft", "published", "archived"] as const;

export function CourseFormClient({
  categories,
  institutions,
  initialData,
  courseId,
}: CourseFormClientProps) {
  const router = useRouter();
  const isEdit = !!courseId;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    instructor: initialData?.instructor ?? "",
    price: initialData?.price?.toString() ?? "0",
    category: initialData?.category ?? "",
    level: initialData?.level ?? ("Beginner" as Course["level"]),
    duration: initialData?.duration ?? "",
    language: initialData?.language ?? "English",
    delivery: initialData?.delivery ?? ("Online" as Course["delivery"]),
    certification: initialData?.certification ?? false,
    image: initialData?.image ?? "",
    institution: initialData?.institution ?? "",
    status: (initialData?.status ?? "draft") as Course["status"],
    curriculum: initialData?.curriculum
      ? JSON.stringify(initialData.curriculum, null, 2)
      : "",
    perks: initialData?.perks?.join(", ") ?? "",
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : slugify(title),
    }));
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    let parsedCurriculum: Course["curriculum"] = [];
    if (form.curriculum.trim()) {
      try {
        parsedCurriculum = JSON.parse(form.curriculum);
      } catch {
        setError("Curriculum JSON is invalid. Please check the format.");
        setSubmitting(false);
        return;
      }
    }

    const perks = form.perks
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      instructor: form.instructor,
      price: Number(form.price),
      category: form.category,
      level: form.level,
      duration: form.duration,
      language: form.language,
      delivery: form.delivery,
      certification: form.certification,
      image: form.image,
      institution: form.institution,
      status: form.status,
      curriculum: parsedCurriculum,
      perks,
    };

    try {
      const url = isEdit ? `/api/courses/${courseId}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? `Request failed with status ${res.status}`);
      }

      router.push("/courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!courseId) return;
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/courses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <fieldset className="space-y-4" disabled={submitting}>
        <legend className="text-base font-semibold text-foreground mb-2">
          Basic Information
        </legend>

        <FormField label="Title" required>
          <Input
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Course title"
            required
          />
        </FormField>

        <FormField label="Slug" required>
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="course-slug"
            required
          />
        </FormField>

        <FormField label="Description" required>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Course description"
            rows={4}
            required
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          />
        </FormField>

        <FormField label="Instructor" required>
          <Input
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
            placeholder="Instructor name"
            required
          />
        </FormField>

        <FormField label="Image URL" required>
          <Input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </FormField>
      </fieldset>

      <fieldset className="space-y-4" disabled={submitting}>
        <legend className="text-base font-semibold text-foreground mb-2">
          Classification
        </legend>

        <FormField label="Institution" required>
          <select
            name="institution"
            value={form.institution}
            onChange={handleChange}
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="" disabled>
              Select institution
            </option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.name}>
                {inst.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Category" required>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Level" required>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Delivery" required>
          <select
            name="delivery"
            value={form.delivery}
            onChange={handleChange}
            required
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            {DELIVERIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Status">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </fieldset>

      <fieldset className="space-y-4" disabled={submitting}>
        <legend className="text-base font-semibold text-foreground mb-2">
          Details
        </legend>

        <FormField label="Price (USD)" required>
          <Input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </FormField>

        <FormField label="Duration">
          <Input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="e.g. 12 weeks"
          />
        </FormField>

        <FormField label="Language">
          <Input
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="English"
          />
        </FormField>

        <FormField label="Certification">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="certification"
              checked={form.certification}
              onChange={handleChange}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Provides certification on completion
          </label>
        </FormField>
      </fieldset>

      <fieldset className="space-y-4" disabled={submitting}>
        <legend className="text-base font-semibold text-foreground mb-2">
          Curriculum &amp; Perks
        </legend>

        <FormField label="Curriculum (JSON)">
          <textarea
            name="curriculum"
            value={form.curriculum}
            onChange={handleChange}
            placeholder={`[\n  { "title": "Module 1", "duration": "2h", "lessons": 5 }\n]`}
            rows={6}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          />
        </FormField>

        <FormField label="Perks (comma-separated)">
          <Input
            name="perks"
            value={form.perks}
            onChange={handleChange}
            placeholder="Lifetime access, Certificate, Live sessions"
          />
        </FormField>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/courses")}
          disabled={submitting}
        >
          Cancel
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
            className="ml-auto"
          >
            Delete Course
          </Button>
        )}
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-start gap-4">
      <label className="pt-1.5 text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}
