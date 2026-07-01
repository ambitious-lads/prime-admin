"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Layers } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PRACTICE_GROUPS, type PracticeGrouping } from "@/lib/practice-groups";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Card, CardContent } from "@/components/ui/card";

export default function PracticePage() {
  const [activeGrouping, setActiveGrouping] =
    useState<PracticeGrouping>("verbal");

  const { data, isLoading } = useQuery({
    queryKey: qk.topicsByGrouping(activeGrouping),
    queryFn: () => practiceApi.topicsByGrouping(activeGrouping),
  });

  const topics = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice"
        subtitle="Choose a section and sharpen your skills."
      />

      <div className="flex flex-wrap gap-2">
        {PRACTICE_GROUPS.map((group) => {
          const active = activeGrouping === group.key;
          return (
            <button
              key={group.key}
              type="button"
              onClick={() => setActiveGrouping(group.key)}
              className={
                active
                  ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              }
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : topics.length === 0 ? (
        <EmptyState
          icon={<Dumbbell />}
          title="No topics yet"
          message="Practice topics will appear here once they're added."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/practice/topic/${topic.id}`} className="group">
              <Card className="h-full transition-all group-hover:border-brand/40 group-hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${topic.accentColor ?? "#0c5bfe"}1a`,
                        color: topic.accentColor ?? "#0c5bfe",
                      }}
                    >
                      <Layers className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold font-display text-ink">
                      {topic.name}
                    </h3>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">
                    {topic.description ?? "Practice sets for this topic."}
                  </p>
                  <p className="text-xs font-medium text-muted">
                    {topic.setCount ?? topic.totalSets ?? 0} set
                    {(topic.setCount ?? topic.totalSets ?? 0) === 1 ? "" : "s"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
