"use client";

import { useQuery } from "@tanstack/react-query";
import { Target, CheckCircle2, Trophy, FileText } from "lucide-react";
import { analyticsApi, examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import type { AnalyticsOverview } from "@/lib/api/types";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewStats() {
  const overview = useQuery({
    queryKey: qk.analyticsOverview,
    queryFn: analyticsApi.overview,
  });
  const performance = useQuery({
    queryKey: ["user", "performance"] as const,
    queryFn: examsApi.performance,
  });

  if (overview.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const data: Partial<AnalyticsOverview> = {
    ...(performance.data ?? {}),
    ...(overview.data ?? {}),
  };

  const accuracy = data.accuracy ?? 0;
  const solved = data.questionsSolved ?? 0;
  const rank = data.rank ?? null;
  const examsTaken = data.examsTaken ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Accuracy"
        value={formatPercent(accuracy)}
        icon={<Target />}
      />
      <StatCard
        label="Questions solved"
        value={formatNumber(solved)}
        icon={<CheckCircle2 />}
      />
      <StatCard
        label="Rank"
        value={rank ? `#${formatNumber(rank)}` : "—"}
        icon={<Trophy />}
      />
      <StatCard
        label="Exams taken"
        value={formatNumber(examsTaken)}
        icon={<FileText />}
      />
    </div>
  );
}
