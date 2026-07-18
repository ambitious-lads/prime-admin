"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Brain, Calculator, CheckCircle2, Layers, LockKeyhole } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PRACTICE_GROUPS, type PracticeGrouping } from "@/lib/practice-groups";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";

const groupIcons = { verbal: BookOpen, quantitative: Calculator, analytical: Brain };

export default function PracticePage() {
  const [activeGrouping, setActiveGrouping] = useState<PracticeGrouping>("verbal");
  const { data, isLoading } = useQuery({
    queryKey: qk.topicsByGrouping(activeGrouping),
    queryFn: () => practiceApi.topicsByGrouping(activeGrouping),
  });

  const topics = data ?? [];
  const activeGroup = PRACTICE_GROUPS.find((group) => group.key === activeGrouping)!;
  const totalSets = topics.reduce((sum, topic) => sum + (topic.totalSets ?? topic.setCount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
        <div>
          <div className="inline-flex max-w-full overflow-x-auto rounded-lg border border-line bg-white p-1">
            {PRACTICE_GROUPS.map((group) => {
              const active = activeGrouping === group.key;
              const Icon = groupIcons[group.key];
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setActiveGrouping(group.key)}
                  className={cn(
                    "flex min-h-10 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors",
                    active ? "bg-ink text-white" : "text-muted hover:bg-surface hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-l-2 pl-4" style={{ borderColor: activeGroup.accentColor }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Current section</p>
          <p className="mt-2 text-sm leading-6 text-ink">{topics.length} topics · {totalSets} sets ready to practice</p>
        </div>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : topics.length === 0 ? (
        <EmptyState icon={<Layers />} title="No topics yet" message="Practice topics will appear here once they are published." />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {topics.map((topic) => {
            const totalSets = topic.totalSets ?? topic.setCount ?? 0;
            const completedSets = topic.completedSets ?? 0;
            const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;
            const accent = topic.accentColor ?? activeGroup.accentColor;
            const href = topic.isLocked ? "/plans" : `/practice/topic/${topic.id}`;

            return (
              <Link key={topic.id} href={href} className="group block">
                <article className="relative grid min-h-[220px] overflow-hidden rounded-lg border border-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg hover:shadow-black/5 sm:grid-cols-[160px_minmax(0,1fr)]">
                  <div className="relative min-h-40 overflow-hidden border-b border-line bg-surface sm:min-h-full sm:border-b-0 sm:border-r">
                    {topic.imageUrl ? (
                      <Image
                        src={topic.imageUrl}
                        alt={topic.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full min-h-40 items-center justify-center" style={{ color: accent }}><Layers className="h-10 w-10" /></div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="flex min-w-0 flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: accent }}>{activeGroup.label}</p>
                        <h3 className="mt-2 text-lg font-black leading-6 text-ink">{topic.name}</h3>
                      </div>
                      {topic.isLocked ? (
                        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-bold text-muted"><LockKeyhole className="h-3 w-3" />{topic.minPlanLabel ?? "Upgrade"}</span>
                      ) : progress === 100 ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : null}
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{topic.description ?? "Focused practice sets for this topic."}</p>
                    <div className="mt-auto pt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted">{totalSets} set{totalSets === 1 ? "" : "s"} · {completedSets} complete</span>
                        <span className="font-bold tabular-nums text-ink">{progress}%</span>
                      </div>
                      <Progress value={progress} />
                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm font-bold text-ink">
                        <span>{topic.isLocked ? `Unlock with ${topic.minPlanLabel ?? "a plan"}` : completedSets ? "Continue topic" : "Start topic"}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: accent }} />
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return <div><p className="text-xl font-black tabular-nums text-ink">{value}</p><p className="mt-0.5 text-xs text-muted">{label}</p></div>;
}
