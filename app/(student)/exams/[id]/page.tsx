"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  FileQuestion,
  Lock,
  Sparkles,
  Trophy,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatClock, formatNumber, initialsOf } from "@/lib/utils/format";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { openSubscriptionPrompt } from "@/components/student/subscription-prompt-modal";
import { EXAM_UNLOCK_PLAN, planLabel } from "@/lib/utils/plans";
import type { ExamAttempt } from "@/lib/api/types";

const PAGE_SIZE = 50;

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

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [offset, setOffset] = useState(0);

  const examQuery = useQuery({
    queryKey: qk.exam(id),
    queryFn: () => examsApi.detail(id),
    enabled: Boolean(id),
  });

  const leaderboardQuery = useQuery({
    queryKey: [...qk.leaderboard(id), offset],
    queryFn: () => examsApi.leaderboard(id, { limit: PAGE_SIZE, offset }),
    enabled: Boolean(id),
  });

  const startMutation = useMutation({
    mutationFn: () => examsApi.start(id),
    onSuccess: (attempt: ExamAttempt) => {
      const nextAttemptId = attempt?.attemptId ?? attempt?.id;
      if (nextAttemptId) {
        router.push(`/exams/attempt/${nextAttemptId}`);
      } else {
        toastApiError(new Error("Could not start the exam. Please try again."));
      }
    },
    onError: toastApiError,
  });

  const exam = examQuery.data;
  const locked = Boolean(exam?.isLocked);

  const leaderboard = leaderboardQuery.data;
  const entries = leaderboard?.entries ?? [];
  const total = leaderboard?.total ?? 0;
  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  if (examQuery.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-44" />
        <RowsSkeleton count={6} />
      </div>
    );
  }

  if (examQuery.isError || !exam) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            Back to exams
          </Link>
        </Button>
        <EmptyState
          icon={<FileQuestion />}
          title="Exam not found"
          message="This exam may have been removed or is unavailable."
          action={
            <Button asChild>
              <Link href="/exams">Browse exams</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const difficulty = difficultyLabel(exam.difficulty);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/exams">
          <ArrowLeft className="h-4 w-4" />
          Back to exams
        </Link>
      </Button>

      <PageHeader
        title={exam.title}
        subtitle={exam.description ?? undefined}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {difficulty ? (
              <Badge variant={difficultyVariant(exam.difficulty)}>
                {difficulty}
              </Badge>
            ) : null}
            {exam.isPremium ? (
              <Badge variant="soft">
                <Sparkles className="h-3 w-3" /> Premium
              </Badge>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-surface/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <FileQuestion className="h-3.5 w-3.5" /> Questions
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">
                    {formatNumber(exam.questionCount ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-surface/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="h-3.5 w-3.5" /> Duration
                  </p>
                  <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">
                    {formatNumber(exam.durationMinutes ?? 0)}
                    <span className="ml-1 text-sm font-medium text-muted">
                      min
                    </span>
                  </p>
                </div>
              </div>

              {typeof exam.bestScore === "number" ? (
                <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 p-3">
                  <Trophy className="h-5 w-5 text-brand" />
                  <div>
                    <p className="text-xs text-brand-600">Your best score</p>
                    <p className="font-display text-lg font-bold tabular-nums text-ink">
                      {formatNumber(exam.bestScore)}
                    </p>
                  </div>
                </div>
              ) : null}

              {exam.description ? (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Instructions
                  </p>
                  <p className="text-sm leading-relaxed text-ink">
                    {exam.description}
                  </p>
                </div>
              ) : null}

              {locked ? (
                <Card className="border-brand-100 bg-brand-50/60">
                  <CardContent className="space-y-3 p-4 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-bold text-ink">
                        {planLabel(EXAM_UNLOCK_PLAN)} exam
                      </p>
                      <p className="text-sm text-muted">
                        Upgrade to {planLabel(EXAM_UNLOCK_PLAN)} to unlock this
                        exam and the full mock library.
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => openSubscriptionPrompt({
                        requiredPlan: exam.minPlan === "pro_plus" ? "pro_plus" : "pro",
                        title: `Unlock ${exam.title}`,
                        description: "Upgrade to start this mock exam and access its leaderboard and full performance report.",
                      })}
                    >
                      Upgrade to {planLabel(EXAM_UNLOCK_PLAN)}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  disabled={startMutation.isPending}
                  onClick={() => startMutation.mutate()}
                >
                  {startMutation.isPending ? <Spinner /> : null}
                  Start exam
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-brand" /> Leaderboard
              </CardTitle>
              <CardDescription>
                Top scores from students who took this exam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboardQuery.isLoading ? (
                <RowsSkeleton count={8} />
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={<Trophy />}
                  title="No scores yet"
                  message="Be the first to set a score on this exam."
                />
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={`${entry.userId}-${entry.rank}`}>
                          <TableCell className="font-display font-bold tabular-nums">
                            #{entry.rank}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                {entry.avatarUrl ? (
                                  <AvatarImage
                                    src={entry.avatarUrl}
                                    alt={entry.fullName}
                                  />
                                ) : null}
                                <AvatarFallback>
                                  {initialsOf(entry.fullName ?? "?")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-ink">
                                {entry.fullName ?? "Student"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold tabular-nums">
                            {formatNumber(entry.score ?? 0)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted">
                            {formatClock(entry.timeSpentSeconds ?? 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {(hasPrev || hasNext) && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-muted">
                        {offset + 1}–{offset + entries.length} of{" "}
                        {formatNumber(total)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasPrev || leaderboardQuery.isFetching}
                          onClick={() =>
                            setOffset((o) => Math.max(0, o - PAGE_SIZE))
                          }
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!hasNext || leaderboardQuery.isFetching}
                          onClick={() => setOffset((o) => o + PAGE_SIZE)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
