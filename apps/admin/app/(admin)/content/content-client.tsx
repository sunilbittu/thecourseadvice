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
import { Check, Pencil, X } from "lucide-react";

interface ContentRow {
  id: string;
  section: string;
  key: string;
  value: string;
  metadata?: Record<string, unknown> | null;
  sortOrder: number;
}

interface ContentClientProps {
  initialGrouped: Record<string, ContentRow[]>;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  stats: "Stats Section",
  "how-it-works": "How It Works",
  "partner-banner": "Partner Banner",
};

function getSectionLabel(section: string): string {
  return SECTION_LABELS[section] ?? section;
}

function FieldRow({
  row,
  onSaved,
}: {
  row: ContentRow;
  onSaved: (updated: ContentRow) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(row.value);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/content/${row.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to save.");
          return;
        }
        const updated: ContentRow = await res.json();
        onSaved(updated);
        setEditing(false);
      } catch {
        setError("Network error.");
      }
    });
  }

  function handleCancel() {
    setValue(row.value);
    setEditing(false);
    setError(null);
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-muted-foreground mb-1">{row.key}</div>
        {editing ? (
          <div className="flex flex-col gap-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              autoFocus
            />
            {error && (
              <span className="text-xs text-destructive">{error}</span>
            )}
          </div>
        ) : (
          <div className="text-sm text-foreground break-words">{row.value || <span className="text-muted-foreground italic">empty</span>}</div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 mt-4">
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSave}
              disabled={isPending}
              aria-label="Save"
            >
              <Check className="h-3.5 w-3.5 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCancel}
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditing(true)}
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function ContentClient({ initialGrouped }: ContentClientProps) {
  const [grouped, setGrouped] = useState<Record<string, ContentRow[]>>(initialGrouped);

  const sections = Object.keys(grouped).sort((a, b) => {
    const order = ["hero", "stats", "how-it-works", "partner-banner"];
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  function handleSaved(section: string, updated: ContentRow) {
    setGrouped((prev) => ({
      ...prev,
      [section]: prev[section].map((r) => (r.id === updated.id ? updated : r)),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No content records found. Seed the database to get started.
        </div>
      ) : (
        sections.map((section) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="text-base">{getSectionLabel(section)}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {grouped[section].map((row) => (
                <FieldRow
                  key={row.id}
                  row={row}
                  onSaved={(updated) => handleSaved(section, updated)}
                />
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
