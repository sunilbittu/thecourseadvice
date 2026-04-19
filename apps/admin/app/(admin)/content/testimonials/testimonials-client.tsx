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
import { Pencil, Trash2, Plus, Check, X, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  featured: boolean;
  sortOrder: number;
}

interface TestimonialsClientProps {
  initialTestimonials: Testimonial[];
}

const emptyForm = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  rating: 5,
  featured: false,
  sortOrder: 0,
};

export function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials);
  const [addForm, setAddForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value) : target.value;
    setAddForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value) : target.value;
    setEditForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!addForm.name || !addForm.quote) { setError("Name and quote are required."); return; }
    startTransition(async () => {
      try {
        const res = await fetch("/api/content/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to create."); return; }
        const created: Testimonial = await res.json();
        setItems((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
        setAddForm({ ...emptyForm });
      } catch { setError("Network error."); }
    });
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/content/testimonials/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to update."); return; }
        const updated: Testimonial = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)).sort((a, b) => a.sortOrder - b.sortOrder));
        setEditingId(null);
      } catch { setError("Network error."); }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/content/testimonials/${id}`, { method: "DELETE" });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to delete."); return; }
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch { setError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Name *</label>
                <Input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Student name" className="w-40" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Input name="role" value={addForm.role} onChange={handleAddChange} placeholder="e.g. MBA Student" className="w-40" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Avatar URL</label>
                <Input name="avatar" value={addForm.avatar} onChange={handleAddChange} placeholder="https://..." className="w-48" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Rating (1-5)</label>
                <Input name="rating" type="number" min={1} max={5} value={addForm.rating} onChange={handleAddChange} className="w-20" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
                <Input name="sortOrder" type="number" value={addForm.sortOrder} onChange={handleAddChange} className="w-20" />
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
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Quote *</label>
              <textarea
                name="quote"
                value={addForm.quote}
                onChange={handleAddChange}
                placeholder="Testimonial quote..."
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </div>
            <div>
              <Button type="submit" disabled={isPending} size="sm">
                <Plus className="h-3.5 w-3.5" />
                Add Testimonial
              </Button>
            </div>
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
          <CardTitle className="text-base">All Testimonials ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sort</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No testimonials yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) =>
                    editingId === item.id ? (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input name="name" value={String(editForm.name ?? "")} onChange={handleEditChange} className="w-32" />
                        </TableCell>
                        <TableCell>
                          <Input name="role" value={String(editForm.role ?? "")} onChange={handleEditChange} className="w-32" />
                        </TableCell>
                        <TableCell>
                          <textarea
                            name="quote"
                            value={String(editForm.quote ?? "")}
                            onChange={handleEditChange}
                            rows={2}
                            className="w-56 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring resize-none"
                          />
                        </TableCell>
                        <TableCell>
                          <Input name="rating" type="number" min={1} max={5} value={String(editForm.rating ?? 5)} onChange={handleEditChange} className="w-16" />
                        </TableCell>
                        <TableCell>
                          <Input name="sortOrder" type="number" value={String(editForm.sortOrder ?? 0)} onChange={handleEditChange} className="w-16" />
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
                            <Button variant="ghost" size="icon-sm" onClick={() => handleSaveEdit(item.id)} disabled={isPending}>
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.role}</TableCell>
                        <TableCell className="max-w-xs">
                          <span className="line-clamp-2 text-sm">{item.quote}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{item.sortOrder}</TableCell>
                        <TableCell>
                          {item.featured ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Yes</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)} disabled={isPending}>
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
