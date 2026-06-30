"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Bucket = { day: string; questions: number; active: boolean };

export function StreakCard({ className }: { className?: string }) {
  const summary = useQuery({ queryKey: qk.streak, queryFn: streaksApi.me });
  const weekly = useQuery({ queryKey: qk.weekly, queryFn: streaksApi.weekly });

  const current = summary.data?.currentStreak ?? 0;
  const longest = summary.data?.longestStreak ?? 0;

  const data: Bucket[] = (weekly.data?.days ?? []).map((d) => ({
    day: formatDate(d.date, "EEEEE"),
    questions: d.questionsAnswered ?? 0,
    active: Boolean(d.active),
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Your streak</CardTitle>
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          <Flame className="h-4 w-4" />
          <span className="tabular-nums">{current} day{current === 1 ? "" : "s"}</span>
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted">
          Longest streak{" "}
          <span className="font-semibold text-ink tabular-nums">{longest}</span>{" "}
          days. Keep practicing daily to grow it.
        </p>
        <div className="h-32">
          {weekly.isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              No activity yet this week.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="30%">
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#7a839b" }}
                />
                <Tooltip
                  cursor={{ fill: "#e8ebf3", radius: 6 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e8ebf3",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} questions`, "Solved"]}
                />
                <Bar dataKey="questions" radius={[6, 6, 6, 6]}>
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.active ? "#0c5bfe" : "#dbe2f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
