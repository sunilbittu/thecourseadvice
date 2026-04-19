"use client";

import Link from "next/link";
import { Badge } from "@courseadvice/ui/badge";
import { buttonVariants } from "@courseadvice/ui/button";
import { DataTable, type ColumnConfig } from "@/components/data-table";
import type { Institution } from "@courseadvice/types";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@courseadvice/ui/utils";

interface InstitutionsClientProps {
  institutions: Institution[];
  isSuperadmin: boolean;
}

const columns: ColumnConfig[] = [
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "courseCount", label: "Courses" },
  {
    key: "featured",
    label: "Featured",
    render: (value: boolean) =>
      value ? (
        <Badge variant="default">Yes</Badge>
      ) : (
        <Badge variant="outline">No</Badge>
      ),
  },
];

export function InstitutionsClient({
  institutions,
  isSuperadmin,
}: InstitutionsClientProps) {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institutions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {institutions.length} institution{institutions.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {isSuperadmin && (
          <Link href="/institutions/new" className={cn(buttonVariants())}>
            <Plus className="mr-1 h-4 w-4" />
            New Institution
          </Link>
        )}
      </div>

      <DataTable
        data={institutions}
        columns={columns}
        searchKey="name"
        actions={(row: Institution) => (
          <Link
            href={`/institutions/${row.id}/edit`}
            aria-label="Edit institution"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        )}
      />
    </div>
  );
}
