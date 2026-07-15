"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Flame, Target, Trophy } from "lucide-react";
import { notificationsApi } from "@/lib/api/endpoints";
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
    <section className={cn("border-t border-line py-6 lg:border-t-0 lg:pl-8", className)}>
      <h2 className="text-base font-bold text-ink">Achievements</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((item) => (
              <div key={item.id} className="flex items-start gap-3 border-b border-line py-3 last:border-0">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-brand">
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
          <p className="py-4 text-sm leading-6 text-muted">
            Badges appear here after milestones like 100 solved questions, a
            7-day streak, or completing every set in a topic.
          </p>
        )}
      </div>
    </section>
  );
}
