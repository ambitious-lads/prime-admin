"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Flame, Target, Trophy } from "lucide-react";
import { notificationsApi } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

function iconFor(type: string) {
  if (type.includes("streak")) return <Flame className="h-4 w-4" />;
  if (type.includes("topic")) return <Target className="h-4 w-4" />;
  if (type.includes("100")) return <Trophy className="h-4 w-4" />;
  return <Award className="h-4 w-4" />;
}

export function AchievementsCard({ className }: { className?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "achievements"],
    queryFn: () => notificationsApi.list(30),
  });

  const achievements = useMemo(
    () => (data ?? []).filter((item) => item.type.startsWith("achievement_")).slice(0, 3),
    [data],
  );

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <Award className="h-4 w-4" />
          </span>
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface/60 p-3"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm shadow-brand/10">
                  {iconFor(item.type)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-surface/50 p-4 text-sm text-muted">
            Badges appear here after milestones like 100 solved questions, a
            7-day streak, or completing every set in a topic.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
