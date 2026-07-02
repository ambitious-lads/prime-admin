"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { DateText } from "@/components/shared/formatting";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  QuestionReport,
  QuestionReportStatus,
} from "@/lib/api/types";

type ReportFilter = QuestionReportStatus | "all";

const STATUS_OPTIONS: { value: ReportFilter; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "reviewing", label: "Reviewing" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
];

const REPORT_STATUSES = STATUS_OPTIONS.filter(
  (item): item is { value: QuestionReportStatus; label: string } =>
    item.value !== "all",
);

const statusVariant: Record<QuestionReportStatus, "warning" | "soft" | "success" | "secondary"> = {
  open: "warning",
  reviewing: "soft",
  resolved: "success",
  dismissed: "secondary",
};

const reasonLabel: Record<string, string> = {
  incorrect_answer: "Incorrect answer",
  needs_correction: "Needs correction",
  unclear_question: "Unclear question",
  bad_explanation: "Bad explanation",
  other: "Other",
};

function StatusBadge({ status }: { status: QuestionReportStatus }) {
  return <Badge variant={statusVariant[status]}>{status.replace("_", " ")}</Badge>;
}

function sortReports(reports: QuestionReport[]) {
  return [...reports].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export default function QuestionReportsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<ReportFilter>("open");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: qk.questionReports(filter),
    queryFn: () =>
      practiceApi.questionReports(filter === "all" ? undefined : filter),
    refetchInterval: filter === "open" ? 30_000 : false,
  });

  const sorted = useMemo(() => sortReports(reports), [reports]);

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: QuestionReportStatus;
    }) => practiceApi.updateQuestionReportStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["practice", "question-reports"] });
      toast.success("Report status updated.");
    },
    onError: toastApiError,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question reports"
        subtitle="Review practice questions flagged by students and track content fixes."
      />

      <div className="max-w-xs">
        <Label className="mb-1.5 block">Status</Label>
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as ReportFilter)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter reports" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <RowsSkeleton count={6} />
            </div>
          ) : sorted.length === 0 ? (
            <EmptyState
              icon={<Flag />}
              title="No question reports"
              message="New reports from the mobile practice flow will appear here."
              className="border-0"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Question</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((report) => (
                  <TableRow key={report.id} className="hover:bg-surface/50">
                    <TableCell className="max-w-[28rem]">
                      <p className="whitespace-pre-wrap break-words font-medium leading-relaxed">
                        {report.questionText}
                      </p>
                      {report.explanation ? (
                        <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-muted">
                          Explanation: {report.explanation}
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted">
                        Correct answer: {report.correctOption}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[20rem]">
                      <p className="font-medium text-ink">
                        {reasonLabel[report.reason] ?? report.reason}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">
                        {report.comment || "No comment provided."}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {report.userFullName ?? "Unknown user"}
                      </p>
                      <p className="text-xs text-muted">
                        {report.userPhone ?? report.userId}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-40 flex-col gap-2">
                        <StatusBadge status={report.status} />
                        <Select
                          value={report.status}
                          onValueChange={(status) =>
                            updateStatus.mutate({
                              id: report.id,
                              status: status as QuestionReportStatus,
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {REPORT_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted">
                      <DateText value={report.createdAt} withTime />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
