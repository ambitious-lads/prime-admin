"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { Exam } from "@/lib/api/types";

export default function AdminExamsPage() {
  const { data: exams = [], isLoading } = useQuery({
    queryKey: qk.exams({ tab: "latest" }),
    queryFn: () => examsApi.list({ tab: "latest" }),
  });

  const columns = useMemo<ColumnDef<Exam>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-semibold text-ink">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-sm text-muted">{row.original.category ?? "—"}</span>
        ),
      },
      {
        accessorKey: "questionCount",
        header: "Questions",
        cell: ({ row }) => (
          <span className="tabular-nums text-sm">
            {row.original.questionCount ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "durationMinutes",
        header: "Duration",
        cell: ({ row }) => (
          <span className="text-sm text-muted">
            {row.original.durationMinutes ? `${row.original.durationMinutes} min` : "—"}
          </span>
        ),
      },
      {
        id: "premium",
        header: "Access",
        cell: ({ row }) =>
          row.original.isPremium ? (
            <Badge variant="warning">Premium</Badge>
          ) : (
            <Badge variant="secondary">Free</Badge>
          ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" subtitle="All mock exams on the platform." />

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4 text-sm text-ink/80">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p>
          Exam authoring from the web console is coming soon. For now, this view
          lists exams sourced from the backend.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={exams}
        loading={isLoading}
        emptyMessage="No exams found."
      />
    </div>
  );
}
