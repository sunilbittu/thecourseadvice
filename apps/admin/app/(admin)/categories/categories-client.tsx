"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@courseadvice/ui/button";
import { Input } from "@courseadvice/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@courseadvice/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@courseadvice/ui/table";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  featured: boolean;
  sortOrder: number;
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

const emptyForm = {
  name: "",
  slug: "",
  icon: "",
  image: "",
  description: "",
  featured: false,
  sortOrder: 0,
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [addForm, setAddForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const field = target.name;
    setAddForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name") {
        updated.slug = slugify(updated.name);
      }
      return updated;
    });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const field = target.name;
    setEditForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name") {
        updated.slug = slugify(String(updated.name ?? ""));
      }
      return updated;
    });
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditForm({ ...cat });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!addForm.name || !addForm.slug || !addForm.icon) {
      setError("Name, slug, and icon are required.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to create category.");
          return;
        }
        const created: Category = await res.json();
        setCategories((prev) =>
          [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder)
        );
        setAddForm({ ...emptyForm });
      } catch {
        setError("Network error.");
      }
    });
  }

  async function handleSaveEdit(id: string) {
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to update category.");
          return;
        }
        const updated: Category = await res.json();
        setCategories((prev) =>
          prev
            .map((c) => (c.id === id ? updated : c))
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
        setEditingId(null);
        setEditForm({});
      } catch {
        setError("Network error.");
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to delete category.");
          return;
        }
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch {
        setError("Network error.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input
                name="name"
                placeholder="e.g. Business"
                value={addForm.name}
                onChange={handleAddChange}
                className="w-36"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Slug *</label>
              <Input
                name="slug"
                placeholder="e.g. business"
                value={addForm.slug}
                onChange={handleAddChange}
                className="w-36"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Icon *</label>
              <Input
                name="icon"
                placeholder="e.g. briefcase"
                value={addForm.icon}
                onChange={handleAddChange}
                className="w-32"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Image URL</label>
              <Input
                name="image"
                placeholder="https://..."
                value={addForm.image}
                onChange={handleAddChange}
                className="w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
              <Input
                name="sortOrder"
                type="number"
                placeholder="0"
                value={addForm.sortOrder}
                onChange={handleAddChange}
                className="w-20"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Featured</label>
              <div className="flex items-center h-8">
                <input
                  type="checkbox"
                  name="featured"
                  checked={addForm.featured}
                  onChange={handleAddChange}
                  className="h-4 w-4 rounded border border-input accent-primary cursor-pointer"
                />
              </div>
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No categories yet. Add one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) =>
                    editingId === cat.id ? (
                      <TableRow key={cat.id}>
                        <TableCell>
                          <Input
                            name="name"
                            value={String(editForm.name ?? "")}
                            onChange={handleEditChange}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="slug"
                            value={String(editForm.slug ?? "")}
                            onChange={handleEditChange}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="icon"
                            value={String(editForm.icon ?? "")}
                            onChange={handleEditChange}
                            className="w-28"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name="sortOrder"
                            type="number"
                            value={String(editForm.sortOrder ?? 0)}
                            onChange={handleEditChange}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="checkbox"
                            name="featured"
                            checked={Boolean(editForm.featured)}
                            onChange={handleEditChange}
                            className="h-4 w-4 rounded border border-input accent-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleSaveEdit(cat.id)}
                              disabled={isPending}
                              aria-label="Save"
                            >
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={cancelEdit}
                              aria-label="Cancel"
                            >
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={cat.id}>
                        <TableCell className="font-medium">{cat.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">{cat.slug}</TableCell>
                        <TableCell>{cat.icon}</TableCell>
                        <TableCell>{cat.sortOrder}</TableCell>
                        <TableCell>
                          {cat.featured ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => startEdit(cat)}
                              aria-label="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(cat.id)}
                              disabled={isPending}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
