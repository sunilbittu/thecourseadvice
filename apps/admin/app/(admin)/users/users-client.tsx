"use client";

import React, { useState, useTransition } from "react";
import { DataTable } from "@/components/data-table";
import type { ColumnConfig } from "@/components/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@courseadvice/ui/select";
import { Badge } from "@courseadvice/ui/badge";

type UserRole = "student" | "institution-admin" | "superadmin";

interface DBUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  institutionId: string | null;
  createdAt: Date;
}

interface UsersClientProps {
  initialUsers: DBUser[];
}

const ROLE_OPTIONS: UserRole[] = ["student", "institution-admin", "superadmin"];

function RoleBadge({ role }: { role: UserRole }) {
  const variants: Record<UserRole, string> = {
    superadmin: "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
    "institution-admin": "inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400",
    student: "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
  };
  return <span className={variants[role]}>{role}</span>;
}

function RoleSelector({
  userId,
  currentRole,
  onRoleChanged,
}: {
  userId: string;
  currentRole: UserRole;
  onRoleChanged: (userId: string, newRole: UserRole) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(value: UserRole | null) {
    const newRole = value as UserRole;
    if (!newRole || newRole === currentRole) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        if (!res.ok) {
          setError((await res.json().catch(() => ({}))).error ?? "Failed to update role.");
          return;
        }
        onRoleChanged(userId, newRole);
      } catch { setError("Network error."); }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Select value={currentRole} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<DBUser[]>(initialUsers);

  function handleRoleChanged(userId: string, newRole: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  }

  const columns: ColumnConfig[] = [
    {
      key: "name",
      label: "Name",
      render: (value: string, row: DBUser) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{value}</span>
          <span className="text-xs text-muted-foreground">{row.id}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (_value: UserRole, row: DBUser) => (
        <RoleSelector
          userId={row.id}
          currentRole={row.role}
          onRoleChanged={handleRoleChanged}
        />
      ),
    },
    {
      key: "institutionId",
      label: "Institution ID",
      render: (value: string | null) =>
        value ? (
          <span className="text-xs font-mono text-muted-foreground">{value}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value: Date) => (
        <span className="text-xs text-muted-foreground">
          {new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={users as unknown as Record<string, unknown>[]}
      columns={columns}
      searchKey="name"
    />
  );
}
