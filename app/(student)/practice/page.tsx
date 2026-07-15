"use client";

import Link from "next/link";
import Image from "next/image";
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
import { Progress } from "@/components/ui/progress";

export default function PracticePage() {
  const [activeGrouping, setActiveGrouping] =
    useState<PracticeGrouping>("verbal");

  const { data, isLoading } = useQuery({
    queryKey: qk.topicsByGrouping(activeGrouping),
    queryFn: () => practiceApi.topicsByGrouping(activeGrouping),
  });

  const topics = data ?? [];
  const activeGroup = PRACTICE_GROUPS.find((group) => group.key === activeGrouping)!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice"
        subtitle="Build speed and confidence one focused set at a time."
      />

      <div
        className="relative overflow-hidden rounded-2xl px-5 py-6 text-white sm:px-7"
        style={{ backgroundColor: activeGroup.accentColor }}
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
            {activeGroup.label} practice
          </p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            {activeGroup.description}
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Choose a topic below and keep your daily streak moving.
          </p>
        </div>
        <div className="absolute -right-4 -top-10 h-40 w-40 rounded-full bg-white/15" />
        <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-black/10" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PRACTICE_GROUPS.map((group) => {
          const active = activeGrouping === group.key;
          return (
            <button
              key={group.key}
              type="button"
              onClick={() => setActiveGrouping(group.key)}
              className={
                active
                  ? "rounded-full px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
              }
              style={active ? { backgroundColor: group.accentColor } : undefined}
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
              <Card className="h-full overflow-hidden transition-all group-hover:-translate-y-0.5 group-hover:border-brand/40 group-hover:shadow-md">
                <div
                  className="relative h-32 overflow-hidden"
                  style={{ backgroundColor: `${topic.accentColor ?? activeGroup.accentColor}18` }}
                >
                  <Image
                    src={topicImage(topic.name)}
                    alt=""
                    fill
                    className="object-contain object-right-bottom p-2 transition-transform group-hover:scale-105"
                  />
                </div>
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
                  <p className="line-clamp-2 text-sm leading-6 text-muted">
                    {topic.description ?? "Practice sets designed to sharpen this skill."}
                  </p>
                  <p className="text-xs font-semibold text-muted">
                    {topic.setCount ?? topic.totalSets ?? 0} set
                    {(topic.setCount ?? topic.totalSets ?? 0) === 1 ? "" : "s"}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted">
                      <span>{topic.completedSets ?? 0} completed</span>
                      <span>
                        {topic.totalSets
                          ? Math.round(((topic.completedSets ?? 0) / topic.totalSets) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress
                      value={
                        topic.totalSets
                          ? ((topic.completedSets ?? 0) / topic.totalSets) * 100
                          : 0
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function topicImage(name: string) {
  const value = name.toLowerCase();
  if (value.includes("grammar") || value.includes("sentence")) {
    return "/illustrations/grammar.png";
  }
  if (value.includes("vocab") || value.includes("analogy") || value.includes("comprehension")) {
    return "/illustrations/vocab.png";
  }
  if (value.includes("ratio") || value.includes("algebra") || value.includes("geometry") || value.includes("probability")) {
    return "/illustrations/ratio.png";
  }
  return "/illustrations/plan.png";
}
