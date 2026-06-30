"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, ListChecks, Target } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/utils/format";
import type { Difficulty } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const difficultyVariant: Record<Difficulty, "success" | "warning" | "destructive"> = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
};

export default function TopicSetsPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;

  const stats = useQuery({
    queryKey: qk.topicStats(topicId),
    queryFn: () => practiceApi.topicStats(topicId),
    enabled: Boolean(topicId),
  });

  const sets = useQuery({
    queryKey: qk.sets(topicId),
    queryFn: () => practiceApi.sets(topicId),
    enabled: Boolean(topicId),
  });

  const setList = sets.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice sets"
        subtitle="Work through a set and review instant feedback."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/practice">
              <ArrowLeft className="h-4 w-4" /> Practice
            </Link>
          </Button>
        }
      />

      {stats.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Accuracy"
            value={formatPercent(stats.data?.accuracy ?? 0)}
            icon={<Target />}
          />
          <StatCard
            label="Questions answered"
            value={formatNumber(stats.data?.questionsAnswered ?? 0)}
            icon={<ListChecks />}
          />
          <StatCard
            label="Time spent"
            value={formatDuration(stats.data?.timeSpentSeconds ?? 0)}
            icon={<Clock />}
          />
        </div>
      )}

      {sets.isLoading ? (
        <CardGridSkeleton count={6} />
      ) : setList.length === 0 ? (
        <EmptyState
          icon={<ListChecks />}
          title="No practice sets yet"
          message="Sets for this topic will appear here once they're added."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {setList.map((s) => {
            const completion = Math.max(
              0,
              Math.min(100, s.completionPercentage ?? 0),
            );
            return (
              <Link
                key={s.id}
                href={`/practice/set/${s.id}`}
                className="group"
              >
                <Card className="h-full transition-all group-hover:border-brand/40 group-hover:shadow-md">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold font-display text-ink">
                        {s.title}
                      </h3>
                      {s.difficulty ? (
                        <Badge variant={difficultyVariant[s.difficulty]}>
                          {s.difficulty}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {s.estimatedTimeMinutes ?? 0} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" />
                        {s.questionCount ?? 0} questions
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>Completion</span>
                        <span className="font-medium tabular-nums text-ink">
                          {formatPercent(completion)}
                        </span>
                      </div>
                      <Progress value={completion} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
