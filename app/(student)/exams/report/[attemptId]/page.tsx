"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  Check,
  Clock,
  RotateCcw,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner } from "@/components/shared/loading";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/utils/format";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";

const BRAND = "#0c5bfe";
const GRID = "#e8ebf3";

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default function ExamReportPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;

  const reportQuery = useQuery({
    queryKey: qk.report(attemptId),
    queryFn: () => examsApi.report(attemptId),
    enabled: Boolean(attemptId),
  });

  if (reportQuery.isLoading) {
    return <FullPageSpinner />;
  }

  const report = reportQuery.data;

  if (reportQuery.isError || !report) {
    return (
      <EmptyState
        icon={<Trophy />}
        title="Report unavailable"
        message="We couldn't load the results for this attempt."
        action={
          <Button asChild>
            <Link href="/exams">Back to exams</Link>
          </Button>
        }
      />
    );
  }

  const totalQuestions = report.totalQuestions ?? report.questions?.length ?? 0;
  const correctCount = report.correctCount ?? 0;
  const accuracy = clampPercent(report.accuracy ?? 0);
  const score = report.score ?? 0;
  const topicBreakdown = report.topicBreakdown ?? [];
  const reviewQuestions = report.questions ?? [];

  const gaugeData = [{ name: "score", value: accuracy, fill: BRAND }];
  const topicData = topicBreakdown.map((item) => ({
    topic: item.topic ?? "—",
    accuracy: clampPercent(item.accuracy ?? 0),
  }));

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
        <Link href="/exams">
          <ArrowLeft className="h-4 w-4" />
          Back to exams
        </Link>
      </Button>

      <PageHeader
        title="Exam results"
        subtitle={report.examTitle ?? undefined}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/exams/${report.examId}`}>
                <RotateCcw className="h-4 w-4" />
                Retake
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/exams/${report.examId}`}>
                <Trophy className="h-4 w-4" />
                View leaderboard
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Score</CardTitle>
            <CardDescription>Your overall accuracy this attempt.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={gaugeData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                  />
                  <RadialBar background dataKey="value" cornerRadius={999} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-accent text-4xl font-bold tabular-nums text-ink">
                  {formatNumber(score)}
                </span>
                <span className="text-sm text-muted">
                  {formatPercent(accuracy)} accuracy
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-rows-2">
          <StatCard
            label="Correct"
            value={`${formatNumber(correctCount)} / ${formatNumber(totalQuestions)}`}
            icon={<Check />}
          />
          <StatCard
            label="Accuracy"
            value={formatPercent(accuracy)}
            icon={<Target />}
          />
          <StatCard
            label="Time spent"
            value={formatDuration(report.timeSpentSeconds ?? 0)}
            icon={<Clock />}
          />
          <StatCard
            label="Questions"
            value={formatNumber(totalQuestions)}
            icon={<Trophy />}
          />
        </div>
      </div>

      {topicData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Accuracy by topic</CardTitle>
            <CardDescription>Where you were strong and where to focus.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topicData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
                >
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis
                    dataKey="topic"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: GRID }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(12,91,254,0.06)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${GRID}`,
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value}%`, "Accuracy"]}
                  />
                  <Bar dataKey="accuracy" fill={BRAND} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Question review</CardTitle>
          <CardDescription>
            Compare your answers with the correct ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewQuestions.length === 0 ? (
            <EmptyState
              title="No review available"
              message="There are no questions to review for this attempt."
            />
          ) : (
            reviewQuestions.map((question, index) => {
              const options = question.options ?? [];
              const correct = question.correctOption;
              const selected = question.selectedOption;
              const isCorrect = question.isCorrect;
              return (
                <div
                  key={question.questionId ?? index}
                  className="space-y-3 rounded-2xl border border-line p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                        isCorrect
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600",
                      )}
                    >
                      {isCorrect ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </span>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Question {index + 1}
                      </p>
                      <p className="font-medium leading-relaxed text-ink">
                        {question.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pl-10">
                    {options.map((option) => {
                      const isAnswerCorrect = option.label === correct;
                      const isPicked = option.label === selected;
                      return (
                        <div
                          key={option.label}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm",
                            isAnswerCorrect
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : isPicked
                                ? "border-red-200 bg-red-50 text-red-800"
                                : "border-line bg-white text-ink",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                              isAnswerCorrect
                                ? "bg-emerald-100 text-emerald-700"
                                : isPicked
                                  ? "bg-red-100 text-red-700"
                                  : "bg-surface text-muted",
                            )}
                          >
                            {option.label}
                          </span>
                          <span className="flex-1">{option.text}</span>
                          {isAnswerCorrect ? (
                            <span className="text-xs font-semibold text-emerald-600">
                              Correct
                            </span>
                          ) : isPicked ? (
                            <span className="text-xs font-semibold text-red-600">
                              Your answer
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                    {!selected ? (
                      <p className="text-xs font-medium text-amber-600">
                        You did not answer this question.
                      </p>
                    ) : null}
                  </div>

                  {question.explanation ? (
                    <div className="ml-10 rounded-xl bg-surface/70 p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Explanation
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink">
                        {question.explanation}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Button variant="outline" asChild>
          <Link href="/exams">Back to exams</Link>
        </Button>
      </div>
    </div>
  );
}
