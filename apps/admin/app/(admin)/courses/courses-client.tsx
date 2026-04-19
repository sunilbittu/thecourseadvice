"use client";

import Link from "next/link";
import { Badge } from "@courseadvice/ui/badge";
import { buttonVariants } from "@courseadvice/ui/button";
import { DataTable, type ColumnConfig } from "@/components/data-table";
import type { Course } from "@courseadvice/types";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@courseadvice/ui/utils";

interface CoursesClientProps {
  courses: Course[];
}

const columns: ColumnConfig[] = [
  { key: "title", label: "Title" },
  { key: "institution", label: "Institution" },
  { key: "category", label: "Category" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => {
      const variant =
        value === "published"
          ? "default"
          : value === "draft"
          ? "secondary"
          : "outline";
      return <Badge variant={variant}>{value ?? "published"}</Badge>;
    },
  },
  {
    key: "price",
    label: "Price",
    render: (value: number) =>
      value === 0 ? "Free" : `$${value.toLocaleString()}`,
  },
];

export function CoursesClient({ courses }: CoursesClientProps) {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/courses/new" className={cn(buttonVariants())}>
          <Plus className="mr-1 h-4 w-4" />
          New Course
        </Link>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        searchKey="title"
        actions={(row: Course) => (
          <Link
            href={`/courses/${row.id}/edit`}
            aria-label="Edit course"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <Pencil className="h-4 w-4" />
          </Link>
        )}
      />
    </div>
  );
}
