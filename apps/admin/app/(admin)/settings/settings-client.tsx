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
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

interface Setting {
  key: string;
  value: string;
}

interface SettingsClientProps {
  initialSettings: Setting[];
}

function SettingRow({
  setting,
  onSaved,
  onDeleted,
}: {
  setting: Setting;
  onSaved: (updated: Setting) => void;
  onDeleted: (key: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(setting.value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/settings/${encodeURIComponent(setting.key)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        if (!res.ok) {
          setError((await res.json().catch(() => ({}))).error ?? "Failed to save.");
          return;
        }
        const updated: Setting = await res.json();
        onSaved(updated);
        setEditing(false);
      } catch { setError("Network error."); }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete setting "${setting.key}"? This cannot be undone.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/settings/${encodeURIComponent(setting.key)}`, { method: "DELETE" });
        if (!res.ok) {
          setError((await res.json().catch(() => ({}))).error ?? "Failed to delete.");
          return;
        }
        onDeleted(setting.key);
      } catch { setError("Network error."); }
    });
  }

  function handleCancel() {
    setValue(setting.value);
    setEditing(false);
    setError(null);
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-48 flex-shrink-0">
        <span className="text-xs font-mono font-medium text-muted-foreground break-all">{setting.key}</span>
      </div>
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex flex-col gap-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              autoFocus
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>
        ) : (
          <span className="text-sm text-foreground break-words">
            {setting.value || <span className="text-muted-foreground italic">empty</span>}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {editing ? (
          <>
            <Button variant="ghost" size="icon-sm" onClick={handleSave} disabled={isPending} aria-label="Save">
              <Check className="h-3.5 w-3.5 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleCancel} aria-label="Cancel">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)} aria-label="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);
  const [addKey, setAddKey] = useState("");
  const [addValue, setAddValue] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (!addKey.trim()) { setAddError("Key is required."); return; }
    if (settings.some((s) => s.key === addKey.trim())) {
      setAddError("A setting with this key already exists.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: addKey.trim(), value: addValue }),
        });
        if (!res.ok) {
          setAddError((await res.json().catch(() => ({}))).error ?? "Failed to create.");
          return;
        }
        const created: Setting = await res.json();
        setSettings((prev) => [...prev, created].sort((a, b) => a.key.localeCompare(b.key)));
        setAddKey("");
        setAddValue("");
      } catch { setAddError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            Add New Setting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Key *</label>
              <Input
                value={addKey}
                onChange={(e) => setAddKey(e.target.value)}
                placeholder="e.g. site_title"
                className="w-48 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Value</label>
              <Input
                value={addValue}
                onChange={(e) => setAddValue(e.target.value)}
                placeholder="Setting value"
                className="w-72"
              />
            </div>
            <Button type="submit" disabled={isPending} size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add Setting
            </Button>
          </form>
          {addError && (
            <p className="mt-2 text-sm text-destructive">{addError}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Settings ({settings.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {settings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No settings configured. Add one above.
            </div>
          ) : (
            settings.map((setting) => (
              <SettingRow
                key={setting.key}
                setting={setting}
                onSaved={(updated) =>
                  setSettings((prev) =>
                    prev.map((s) => (s.key === updated.key ? updated : s))
                  )
                }
                onDeleted={(key) =>
                  setSettings((prev) => prev.filter((s) => s.key !== key))
                }
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
