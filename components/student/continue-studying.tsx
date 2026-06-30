"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Dumbbell, FileQuestion } from "lucide-react";
import { practiceApi, examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ContinueStudying({ className }: { className?: string }) {
  const categories = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });
  const exams = useQuery({
    queryKey: qk.exams({ tab: "latest" }),
    queryFn: () => examsApi.list({ tab: "latest" }),
  });

  const quickLinks = (categories.data ?? []).slice(0, 4);
  const recommended = (exams.data ?? []).slice(0, 3);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Continue studying</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Practice categories
          </p>
          {categories.isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : quickLinks.length === 0 ? (
            <p className="text-sm text-muted">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {quickLinks.map((c) => (
                <Link
                  key={c.id}
                  href={`/practice/${c.id}`}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-brand/40 hover:bg-surface"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand"
                  >
                    <Dumbbell className="h-4 w-4" />
                  </span>
                  <span className="truncate text-sm font-medium text-ink">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Recommended mock exams
          </p>
          {exams.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : recommended.length === 0 ? (
            <p className="text-sm text-muted">No exams available yet.</p>
          ) : (
            <div className="space-y-2">
              {recommended.map((e) => (
                <Link
                  key={e.id}
                  href={`/exams/${e.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line p-3 transition-colors hover:border-brand/40 hover:bg-surface"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
                      <FileQuestion className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {e.title}
                      </p>
                      <p className="text-xs text-muted">
                        {e.questionCount ?? 0} questions · {e.durationMinutes ?? 0} min
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.isPremium ? <Badge variant="soft">Pro</Badge> : null}
                    <ArrowRight className="h-4 w-4 text-muted" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
