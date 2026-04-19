"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@courseadvice/ui/button";
import { Input } from "@courseadvice/ui/input";
import type { Institution } from "@courseadvice/types";

interface InstitutionFormClientProps {
  initialData?: Partial<Institution>;
  institutionId?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function InstitutionFormClient({
  initialData,
  institutionId,
}: InstitutionFormClientProps) {
  const router = useRouter();
  const isEdit = !!institutionId;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    logo: initialData?.logo ?? "",
    location: initialData?.location ?? "",
    description: initialData?.description ?? "",
    website: initialData?.website ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    founded: initialData?.founded ?? "",
    featured: initialData?.featured ?? false,
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    const payload = {
      name: form.name,
      slug: form.slug,
      logo: form.logo,
      location: form.location,
      description: form.description,
      website: form.website || null,
      email: form.email || null,
      phone: form.phone || null,
      founded: form.founded || null,
      featured: form.featured,
    };

    try {
      const url = isEdit
        ? `/api/institutions/${institutionId}`
        : "/api/institutions";
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
        throw new Error(
          data.error ?? `Request failed with status ${res.status}`
        );
      }

      router.push("/institutions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!institutionId) return;
    if (
      !confirm(
        "Are you sure you want to delete this institution? This cannot be undone."
      )
    )
      return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/institutions/${institutionId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/institutions");
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

        <FormField label="Name" required>
          <Input
            name="name"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Institution name"
            required
          />
        </FormField>

        <FormField label="Slug" required>
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="institution-slug"
            required
          />
        </FormField>

        <FormField label="Logo URL" required>
          <Input
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
        </FormField>

        <FormField label="Location" required>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="City, Country"
            required
          />
        </FormField>

        <FormField label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="About the institution"
            rows={4}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
          />
        </FormField>
      </fieldset>

      <fieldset className="space-y-4" disabled={submitting}>
        <legend className="text-base font-semibold text-foreground mb-2">
          Contact &amp; Links
        </legend>

        <FormField label="Website">
          <Input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.edu"
          />
        </FormField>

        <FormField label="Email">
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contact@example.edu"
          />
        </FormField>

        <FormField label="Phone">
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 555 000 0000"
          />
        </FormField>

        <FormField label="Founded">
          <Input
            name="founded"
            value={form.founded}
            onChange={handleChange}
            placeholder="e.g. 1887"
          />
        </FormField>

        <FormField label="Featured">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Show as a featured institution
          </label>
        </FormField>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : isEdit
            ? "Save Changes"
            : "Create Institution"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/institutions")}
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
            Delete Institution
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
