"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Brain, Calculator, CheckCircle2, Layers, LockKeyhole } from "lucide-react";
import { plansApi, practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PRACTICE_GROUPS, type PracticeGrouping } from "@/lib/practice-groups";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { PLAN_LIST } from "@/lib/utils/plans";
import { formatMoney } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

type PracticeFilter = PracticeGrouping | "all";
const practiceFilters = [{ key: "all" as const, label: "All" }, ...PRACTICE_GROUPS];
const groupIcons = { all: Layers, verbal: BookOpen, quantitative: Calculator, analytical: Brain };

export default function PracticePage() {
  const searchParams = useSearchParams();
  const [activeGrouping, setActiveGrouping] = useState<PracticeFilter>("all");
  const [subscriptionOpen, setSubscriptionOpen] = useState(searchParams.get("onboarding") === "1");
  const plan = useQuery({ queryKey: qk.plan, queryFn: plansApi.me });
  const { data, isLoading } = useQuery({
    queryKey: qk.topicsByGrouping(activeGrouping === "all" ? undefined : activeGrouping),
    queryFn: () => practiceApi.topicsByGrouping(activeGrouping === "all" ? undefined : activeGrouping),
  });

  const topics = useMemo(() => data ?? [], [data]);
  const activeGroup = activeGrouping === "all"
    ? { key: "all" as const, label: "All", accentColor: "#2D5BFF" }
    : PRACTICE_GROUPS.find((group) => group.key === activeGrouping)!;
  const orderedTopics = useMemo(() => {
    const groupRank: Record<string, number> = {
      verbal: 0,
      quantitative: 1,
      analytical: 2,
    };
    return [...topics].sort((a, b) => {
      if (activeGrouping === "all") {
        const groupDifference = (groupRank[a.grouping] ?? 3) - (groupRank[b.grouping] ?? 3);
        if (groupDifference !== 0) return groupDifference;
      }
      const orderDifference = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      return orderDifference || a.name.localeCompare(b.name);
    });
  }, [activeGrouping, topics]);

  return (
    <div className="space-y-6">
      <Dialog open={subscriptionOpen && plan.data?.plan !== "pro_plus"} onOpenChange={setSubscriptionOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-3xl rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Choose your access</DialogTitle>
            <DialogDescription>
              Start free or unlock the full Addis Ababa University UAT preparation experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {PLAN_LIST.filter((item) => item.key !== "free").map((item) => (
              <div key={item.key} className={cn("flex flex-col rounded-xl border p-5", item.key === "pro" ? "border-brand/40 bg-brand-50/40" : "border-line bg-white")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-ink">{item.label}</h3>
                    <p className="mt-2 text-2xl font-black text-ink">{formatMoney(item.price)} <span className="text-xs font-semibold text-muted">one-time</span></p>
                  </div>
                  {item.key === "pro" ? <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">Popular</span> : null}
                </div>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
                  {item.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-brand">✓</span>{feature}</li>)}
                </ul>
                <Button asChild className="mt-5 w-full">
                  <Link href={`/plans/checkout?plan=${item.key}`} onClick={() => setSubscriptionOpen(false)}>Choose {item.label}</Link>
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => setSubscriptionOpen(false)}>Continue with Free</Button>
        </DialogContent>
      </Dialog>
      <div className="relative z-50 -mx-3 border-b border-line bg-white px-3 py-2.5 sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 lg:-mt-[76px] lg:mb-3 lg:w-fit lg:max-w-[calc(100%-360px)]">
        <div className="flex max-w-full snap-x gap-2 overflow-x-auto bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-0 sm:rounded-xl sm:border sm:border-line sm:p-1">
          {practiceFilters.map((group) => {
            const active = activeGrouping === group.key;
            const Icon = groupIcons[group.key];
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => setActiveGrouping(group.key)}
                className={cn(
                  "flex min-h-9 shrink-0 snap-start items-center gap-2 rounded-[14px] px-3 text-sm font-bold transition-colors sm:min-h-10 sm:rounded-lg sm:px-4 sm:font-semibold",
                  active ? "bg-ink text-white sm:bg-brand sm:shadow-sm" : "bg-surface text-ink hover:bg-brand-50 sm:bg-transparent sm:text-muted sm:hover:bg-surface sm:hover:text-ink",
                )}
              >
                <Icon className="hidden h-4 w-4 sm:block" />
                {group.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : orderedTopics.length === 0 ? (
        <EmptyState icon={<Layers />} title="No topics yet" message="Practice topics will appear here once they are published." />
      ) : (
        <>
        <section className="grid grid-cols-2 gap-2.5 pt-3 sm:hidden">
          {orderedTopics.map((topic) => {
            const total = topic.totalQuestions ?? topic.totalSets ?? topic.setCount ?? 0;
            const solved = topic.totalAnswered ?? topic.completedSets ?? 0;
            const accent = topic.accentColor ?? activeGroup.accentColor;
            const href = topic.isLocked ? "/plans" : `/practice/topic/${topic.id}`;
            return (
              <Link
                key={topic.id}
                href={href}
                onClick={(event) => {
                  if (topic.isLocked) {
                    event.preventDefault();
                    setSubscriptionOpen(true);
                  }
                }}
                className="min-w-0 overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] active:opacity-95"
              >
                <div className="relative aspect-[1.28/1] overflow-hidden bg-surface">
                  {topic.imageUrl ? (
                    <Image src={topic.imageUrl} alt={topic.name} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center" style={{ color: accent }}>
                      <Layers className="h-10 w-10" />
                    </div>
                  )}
                  {topic.isLocked ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <LockKeyhole className="h-6 w-6 text-white" />
                    </div>
                  ) : null}
                </div>
                <div className="p-3">
                  <h2 className="line-clamp-2 min-h-10 text-[15px] font-extrabold leading-5 text-ink">{topic.name}</h2>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-xs font-bold text-muted">
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: topic.isLocked ? "#9CA3AF" : accent }} />
                      <span className="truncate">{solved}/{total}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-bold",
                        topic.isLocked ? "bg-surface text-muted" : "text-white",
                      )}
                      style={topic.isLocked ? undefined : { backgroundColor: accent }}
                    >
                      {topic.isLocked ? topic.minPlanLabel ?? "Unlock" : "Practice"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
        <section className="hidden gap-4 sm:grid xl:grid-cols-2">
          {orderedTopics.map((topic) => {
            const totalSets = topic.totalSets ?? topic.setCount ?? 0;
            const completedSets = topic.completedSets ?? 0;
            const progress = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;
            const accent = topic.accentColor ?? activeGroup.accentColor;
            const href = topic.isLocked ? "/plans" : `/practice/topic/${topic.id}`;

            return (
              <Link key={topic.id} href={href} onClick={(event) => { if (topic.isLocked) { event.preventDefault(); setSubscriptionOpen(true); } }} className="group block">
                <article className="relative grid min-h-0 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 sm:min-h-[220px] sm:grid-cols-[160px_minmax(0,1fr)] sm:rounded-lg sm:shadow-none sm:hover:-translate-y-0.5 sm:hover:border-black/20 sm:hover:shadow-lg sm:hover:shadow-black/5">
                  <div className="relative hidden min-h-40 overflow-hidden border-b border-line bg-surface sm:block sm:min-h-full sm:border-b-0 sm:border-r">
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

                  <div className="flex min-w-0 flex-col p-4 sm:p-5">
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
        </>
      )}
    </div>
  );
}
