"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi, examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import type { AnalyticsOverview } from "@/lib/api/types";
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
    ["Questions solved", formatNumber(solved)],
    ["Accuracy", formatPercent(accuracy)],
    ["Rank", rank ? `#${formatNumber(rank)}` : "—"],
    ["Exams taken", formatNumber(examsTaken)],
  ];

  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-line border-y border-line lg:grid-cols-4 lg:divide-y-0">
      {stats.map(([label, value]) => (
        <div key={label} className="px-4 py-5 first:pl-0 lg:px-6 lg:first:pl-0">
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}
