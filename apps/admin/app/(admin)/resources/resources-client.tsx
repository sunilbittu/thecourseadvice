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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@courseadvice/ui/tabs";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  assetCount: number;
}

interface FeaturedAsset {
  id: string;
  title: string;
  type: "guide" | "template" | "video" | "tool";
  description: string;
  image: string;
  downloadUrl: string;
}

interface ScholarlyTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
}

interface ResourcesClientProps {
  initialCategories: ResourceCategory[];
  initialAssets: FeaturedAsset[];
  initialTools: ScholarlyTool[];
}

const ASSET_TYPES = ["guide", "template", "video", "tool"] as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
      {message}
    </div>
  );
}

// ─── Resource Categories Tab ──────────────────────────────────────────────────

function CategoriesTab({
  initial,
}: {
  initial: ResourceCategory[];
}) {
  const [items, setItems] = useState<ResourceCategory[]>(initial);
  const [addForm, setAddForm] = useState({ name: "", description: "", assetCount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResourceCategory>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!addForm.name) { setError("Name is required."); return; }
    startTransition(async () => {
      try {
        const res = await fetch("/api/resources/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to create."); return; }
        const created: ResourceCategory = await res.json();
        setItems((prev) => [...prev, created]);
        setAddForm({ name: "", description: "", assetCount: 0 });
      } catch { setError("Network error."); }
    });
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to update."); return; }
        const updated: ResourceCategory = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        setEditingId(null);
      } catch { setError("Network error."); }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this resource category?")) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/categories/${id}`, { method: "DELETE" });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to delete."); return; }
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch { setError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add Resource Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Research Papers"
                className="w-48"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input
                value={addForm.description}
                onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
                className="w-64"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Asset Count</label>
              <Input
                type="number"
                value={addForm.assetCount}
                onChange={(e) => setAddForm((p) => ({ ...p, assetCount: Number(e.target.value) }))}
                className="w-24"
              />
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Asset Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No resource categories yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) =>
                editingId === item.id ? (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={String(editForm.name ?? "")}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-40"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={String(editForm.description ?? "")}
                        onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-56"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={String(editForm.assetCount ?? 0)}
                        onChange={(e) => setEditForm((p) => ({ ...p, assetCount: Number(e.target.value) }))}
                        className="w-20"
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
                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                    <TableCell>{item.assetCount}</TableCell>
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
    </div>
  );
}

// ─── Featured Assets Tab ──────────────────────────────────────────────────────

function AssetsTab({ initial }: { initial: FeaturedAsset[] }) {
  const [items, setItems] = useState<FeaturedAsset[]>(initial);
  const [addForm, setAddForm] = useState<Omit<FeaturedAsset, "id">>({
    title: "", type: "guide", description: "", image: "", downloadUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FeaturedAsset>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!addForm.title || !addForm.downloadUrl) { setError("Title and download URL are required."); return; }
    startTransition(async () => {
      try {
        const res = await fetch("/api/resources/assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to create."); return; }
        const created: FeaturedAsset = await res.json();
        setItems((prev) => [...prev, created]);
        setAddForm({ title: "", type: "guide", description: "", image: "", downloadUrl: "" });
      } catch { setError("Network error."); }
    });
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/assets/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to update."); return; }
        const updated: FeaturedAsset = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        setEditingId(null);
      } catch { setError("Network error."); }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this asset?")) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/assets/${id}`, { method: "DELETE" });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to delete."); return; }
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch { setError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add Featured Asset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Title *</label>
              <Input value={addForm.title} onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))} placeholder="Asset title" className="w-48" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Type</label>
              <select
                value={addForm.type}
                onChange={(e) => setAddForm((p) => ({ ...p, type: e.target.value as FeaturedAsset["type"] }))}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" className="w-56" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Image URL</label>
              <Input value={addForm.image} onChange={(e) => setAddForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." className="w-48" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Download URL *</label>
              <Input value={addForm.downloadUrl} onChange={(e) => setAddForm((p) => ({ ...p, downloadUrl: e.target.value }))} placeholder="https://..." className="w-48" />
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Download URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No featured assets yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) =>
                editingId === item.id ? (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input value={String(editForm.title ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className="w-40" />
                    </TableCell>
                    <TableCell>
                      <select
                        value={String(editForm.type ?? "guide")}
                        onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value as FeaturedAsset["type"] }))}
                        className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring"
                      >
                        {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input value={String(editForm.description ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} className="w-48" />
                    </TableCell>
                    <TableCell>
                      <Input value={String(editForm.downloadUrl ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, downloadUrl: e.target.value }))} className="w-40" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleSaveEdit(item.id)} disabled={isPending}><Check className="h-3.5 w-3.5 text-green-600" /></Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingId(null)}><X className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{item.type}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground max-w-xs truncate">{item.downloadUrl}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Scholarly Tools Tab ──────────────────────────────────────────────────────

function ToolsTab({ initial }: { initial: ScholarlyTool[] }) {
  const [items, setItems] = useState<ScholarlyTool[]>(initial);
  const [addForm, setAddForm] = useState<Omit<ScholarlyTool, "id">>({
    name: "", description: "", icon: "", url: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ScholarlyTool>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!addForm.name || !addForm.url) { setError("Name and URL are required."); return; }
    startTransition(async () => {
      try {
        const res = await fetch("/api/resources/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to create."); return; }
        const created: ScholarlyTool = await res.json();
        setItems((prev) => [...prev, created]);
        setAddForm({ name: "", description: "", icon: "", url: "" });
      } catch { setError("Network error."); }
    });
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/tools/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to update."); return; }
        const updated: ScholarlyTool = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        setEditingId(null);
      } catch { setError("Network error."); }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tool?")) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resources/tools/${id}`, { method: "DELETE" });
        if (!res.ok) { setError((await res.json().catch(() => ({}))).error ?? "Failed to delete."); return; }
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch { setError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add Scholarly Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Name *</label>
              <Input value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} placeholder="Tool name" className="w-40" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short description" className="w-56" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Icon</label>
              <Input value={addForm.icon} onChange={(e) => setAddForm((p) => ({ ...p, icon: e.target.value }))} placeholder="e.g. search" className="w-28" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">URL *</label>
              <Input value={addForm.url} onChange={(e) => setAddForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." className="w-48" />
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <ErrorMessage message={error} />}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No scholarly tools yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) =>
                editingId === item.id ? (
                  <TableRow key={item.id}>
                    <TableCell><Input value={String(editForm.name ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="w-36" /></TableCell>
                    <TableCell><Input value={String(editForm.icon ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, icon: e.target.value }))} className="w-24" /></TableCell>
                    <TableCell><Input value={String(editForm.description ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} className="w-48" /></TableCell>
                    <TableCell><Input value={String(editForm.url ?? "")} onChange={(e) => setEditForm((p) => ({ ...p, url: e.target.value }))} className="w-48" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleSaveEdit(item.id)} disabled={isPending}><Check className="h-3.5 w-3.5 text-green-600" /></Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditingId(null)}><X className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.icon}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground max-w-xs truncate">{item.url}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setEditingId(item.id); setEditForm({ ...item }); }}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(item.id)} disabled={isPending}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export function ResourcesClient({
  initialCategories,
  initialAssets,
  initialTools,
}: ResourcesClientProps) {
  return (
    <Tabs defaultValue="categories">
      <TabsList>
        <TabsTrigger value="categories">Resource Categories</TabsTrigger>
        <TabsTrigger value="assets">Featured Assets</TabsTrigger>
        <TabsTrigger value="tools">Scholarly Tools</TabsTrigger>
      </TabsList>

      <TabsContent value="categories" className="mt-4">
        <CategoriesTab initial={initialCategories} />
      </TabsContent>

      <TabsContent value="assets" className="mt-4">
        <AssetsTab initial={initialAssets} />
      </TabsContent>

      <TabsContent value="tools" className="mt-4">
        <ToolsTab initial={initialTools} />
      </TabsContent>
    </Tabs>
  );
}
