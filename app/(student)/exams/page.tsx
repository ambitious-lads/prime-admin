"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Clock, FileQuestion, Heart, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { LockBadge } from "@/components/shared/lock-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { toastApiError } from "@/hooks/use-api-error";
import { EXAM_UNLOCK_PLAN } from "@/lib/utils/plans";
import type { Exam } from "@/lib/api/types";

const TABS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "solved", label: "Solved" },
  { value: "topic-wise", label: "Topic-wise" },
  { value: "saved", label: "Saved" },
] as const;

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

const ALL = "all";

function difficultyLabel(value: string | null | undefined) {
  if (!value) return null;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function difficultyVariant(value: string | null | undefined) {
  switch ((value ?? "").toLowerCase()) {
    case "easy":
      return "success" as const;
    case "medium":
      return "warning" as const;
    case "hard":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function ExamCard({
  exam,
  locked,
  saving,
  onToggleSave,
}: {
  exam: Exam;
  locked: boolean;
  saving: boolean;
  onToggleSave: () => void;
}) {
  const difficulty = difficultyLabel(exam.difficulty);
  return (
    <Card className="group relative overflow-hidden border-t-4 border-t-brand transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/exams/${exam.id}`} className="block">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {difficulty ? (
                <Badge variant={difficultyVariant(exam.difficulty)}>
                  {difficulty}
                </Badge>
              ) : null}
              {locked ? <LockBadge plan={EXAM_UNLOCK_PLAN} /> : null}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-base font-bold leading-snug text-ink">
              {exam.title}
            </h3>
            {exam.description ? (
              <p className="line-clamp-2 text-sm text-muted">
                {exam.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4" />
              {formatNumber(exam.questionCount ?? 0)} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatNumber(exam.durationMinutes ?? 0)} min
            </span>
          </div>
        </CardContent>
      </Link>
      <button
        type="button"
        aria-label={exam.isSaved ? "Unsave exam" : "Save exam"}
        disabled={saving}
        onClick={onToggleSave}
        className={cn(
          "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-muted shadow-sm transition-colors hover:text-red-500 disabled:opacity-60",
          exam.isSaved && "text-red-500",
        )}
      >
        <Heart className={cn("h-4 w-4", exam.isSaved && "fill-red-500")} />
      </button>
    </Card>
  );
}

export default function ExamsPage() {
  const [tab, setTab] = useState<string>("latest");
  const [difficulty, setDifficulty] = useState<string>(ALL);
  const queryClient = useQueryClient();
  const { can } = usePlan();

  const filters = {
    tab,
    difficulty: difficulty === ALL ? undefined : difficulty,
  };

  const query = useQuery({
    queryKey: qk.exams(filters),
    queryFn: () => examsApi.list(filters),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, saved }: { id: string; saved: boolean }) =>
      saved ? examsApi.unsave(id) : examsApi.save(id),
    onMutate: async ({ id, saved }) => {
      const key = qk.exams(filters);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Exam[]>(key);
      queryClient.setQueryData<Exam[]>(key, (old) =>
        (old ?? []).map((exam) =>
          exam.id === id ? { ...exam, isSaved: !saved } : exam,
        ),
      );
      return { previous, key };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
      toastApiError(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  const exams = query.data ?? [];

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap">
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All difficulties</SelectItem>
            {DIFFICULTIES.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {query.isLoading ? (
        <CardGridSkeleton count={6} />
      ) : exams.length === 0 ? (
        <EmptyState
          icon={<ListChecks />}
          title="No exams here yet"
          message={
            tab === "saved"
              ? "Save exams with the heart icon to find them again quickly."
              : "Try a different tab or difficulty filter."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              locked={exam.isPremium && !can(EXAM_UNLOCK_PLAN)}
              saving={
                saveMutation.isPending &&
                saveMutation.variables?.id === exam.id
              }
              onToggleSave={() =>
                saveMutation.mutate({
                  id: exam.id,
                  saved: Boolean(exam.isSaved),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
