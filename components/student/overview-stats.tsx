"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi, examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import type { AnalyticsOverview } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, CheckCircle2, ListChecks, Trophy } from "lucide-react";

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
      <div className="grid grid-cols-2 divide-x divide-y divide-line border-y border-line lg:grid-cols-4 lg:divide-y-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-none" />
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

  const stats = [
    { label: "Questions solved", value: formatNumber(solved), icon: ListChecks },
    { label: "Accuracy", value: formatPercent(accuracy), icon: CheckCircle2 },
    { label: "Rank", value: rank ? `#${formatNumber(rank)}` : "—", icon: Trophy },
    { label: "Exams taken", value: formatNumber(examsTaken), icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-lg border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted">{label}</p>
            <Icon className="h-4 w-4 text-brand" />
          </div>
          <p className="mt-4 text-2xl font-bold tabular-nums text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}
