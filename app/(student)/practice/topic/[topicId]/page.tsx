"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  LockKeyhole,
  Play,
  Zap,
} from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import type { Difficulty, PracticeSet } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const difficultyStyle: Record<Difficulty, { label: string; color: string; background: string }> = {
  easy: { label: "Easy", color: "#059669", background: "#ECFDF5" },
  medium: { label: "Medium", color: "#D97706", background: "#FFFBEB" },
  hard: { label: "Hard", color: "#DC2626", background: "#FEF2F2" },
};

export default function TopicSetsPage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const [selectedSet, setSelectedSet] = useState<PracticeSet | null>(null);

  const topics = useQuery({
    queryKey: qk.topicsByGrouping(undefined),
    queryFn: () => practiceApi.topicsByGrouping(),
  });
  const sets = useQuery({
    queryKey: qk.sets(topicId),
    queryFn: () => practiceApi.sets(topicId),
    enabled: Boolean(topicId),
  });

  const topic = topics.data?.find((item) => item.id === topicId);
  const setList = useMemo(
    () => [...(sets.data ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
    [sets.data],
  );
  const completedSets = setList.filter((set) => set.status === "completed").length;
  const totalMinutes = setList.reduce((total, set) => total + (set.estimatedTimeMinutes ?? 0), 0);
  const totalQuestions = setList.reduce((total, set) => total + (set.totalQuestions ?? set.questionCount ?? 0), 0);
  const topicProgress = setList.length ? Math.round((completedSets / setList.length) * 100) : 0;
  const accent = topic?.accentColor ?? "#2D5BFF";

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <section className="border-b border-line pb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4">
          <Link href="/practice"><ArrowLeft className="h-4 w-4" /> Back to Practice</Link>
        </Button>

        <div className="grid gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-start">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-brand-50 sm:h-[88px] sm:w-[88px]">
            {topic?.imageUrl ? (
              <Image src={topic.imageUrl} alt={topic.name} fill unoptimized className="object-cover" />
            ) : (
              <BookOpenCheck className="h-9 w-9" style={{ color: accent }} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: accent }}>{topic?.grouping ?? "Practice"}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink sm:text-3xl">{topic?.name ?? "Practice Sets"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{topic?.description ?? "Practice with curated sets designed to strengthen your UAT skills."}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />{completedSets}/{setList.length} completed</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" style={{ color: accent }} />~{totalMinutes} min total</span>
              <span className="inline-flex items-center gap-1.5"><CircleHelp className="h-4 w-4" style={{ color: accent }} />{totalQuestions} questions</span>
            </div>
            <div className="mt-4 max-w-xl">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-muted"><span>Topic progress</span><span className="text-ink">{topicProgress}%</span></div>
              <Progress value={topicProgress} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 className="text-xl font-black text-ink">Practice Sets</h2><p className="mt-1 text-sm text-muted">Choose a set and continue your progress.</p></div>
          <span className="text-sm font-bold text-muted">{setList.length} set{setList.length === 1 ? "" : "s"}</span>
        </div>

        {sets.isLoading ? (
          <CardGridSkeleton count={4} />
        ) : setList.length === 0 ? (
          <EmptyState icon={<BookOpenCheck />} title="No practice sets yet" message="Sets for this topic will appear here once they're added." />
        ) : (
          <div className="space-y-4">
            {setList.map((set) => {
              const difficulty = set.difficulty ?? "medium";
              const difficultyInfo = difficultyStyle[difficulty];
              const locked = Boolean(set.isLocked || set.status === "locked");
              const completed = set.status === "completed";
              const questions = set.totalQuestions ?? set.questionCount ?? 0;
              const progress = completed ? 100 : Math.max(0, Math.min(100, set.progressPercentage ?? set.completionPercentage ?? 0));
              const iconColor = set.iconColor ?? difficultyInfo.color;
              const iconBackground = set.iconBackground ?? difficultyInfo.background;

              return (
                                <button
                  key={set.id}
                  type="button"
                  onClick={() =>
                    locked
                      ? window.location.assign("/plans")
                      : setSelectedSet(set)
                  }
                  className="group block w-full cursor-pointer text-left"
                >
                  <article className="overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: iconBackground, color: iconColor }}><BookOpenCheck className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-base font-black leading-6 text-ink sm:text-lg">{set.title}</h3>
                            <p className="mt-0.5 text-sm font-semibold text-muted">{difficultyInfo.label} difficulty</p>
                            {set.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{set.description}</p> : null}
                          </div>
                          <span className={cn("inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg px-3 text-xs font-black", completed ? "bg-emerald-50 text-emerald-700" : locked ? "bg-surface text-muted" : "bg-brand text-white")}>
                            {completed ? <CheckCircle2 className="h-4 w-4" /> : locked ? <LockKeyhole className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                            {completed ? "Completed" : locked ? set.minPlanLabel ?? "Locked" : progress > 0 ? "Continue" : "Start"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
                          <Meta icon={<BarChart3 />} value={difficultyInfo.label} label="Difficulty" color={difficultyInfo.color} />
                          <Meta icon={<CircleHelp />} value={`${questions} questions`} label="MCQ type" color={accent} />
                          <Meta icon={<Clock3 />} value={`${set.estimatedTimeMinutes ?? 0} min`} label="Est. time" color={accent} />
                        </div>

                        {!locked ? (
                          <div className="mt-4">
                            <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-muted"><span>{completed ? "Your progress" : "Progress"}</span><span className={completed ? "text-emerald-600" : "text-ink"}>{progress}%</span></div>
                            <Progress value={progress} />
                          </div>
                        ) : null}
                      </div>
                      <ChevronRight className="mt-3 hidden h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 sm:block" />
                    </div>
                  </article>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <Dialog
        open={Boolean(selectedSet)}
        onOpenChange={(open) => !open && setSelectedSet(null)}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Choose Practice Mode
            </DialogTitle>
            <DialogDescription>
              {selectedSet?.title} ·{" "}
              {selectedSet?.totalQuestions ?? selectedSet?.questionCount ?? 0}{" "}
              questions
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <ModeOption
              href={selectedSet ? `/practice/set/${selectedSet.id}?mode=review&title=${encodeURIComponent(selectedSet.title)}` : "#"}
              icon={<Clock3 />}
              title="Exam Mode"
              description="Review answers after finishing all questions"
              accent={selectedSet?.iconColor ?? accent}
            />
            <ModeOption
              href={selectedSet ? `/practice/set/${selectedSet.id}?mode=instant&title=${encodeURIComponent(selectedSet.title)}` : "#"}
              icon={<Zap />}
              title="Practice Mode"
              description="Get instant feedback after each answer"
              accent={selectedSet?.iconColor ?? accent}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ModeOption({ href, icon, title, description, accent }: { href: string; icon: React.ReactNode; title: string; description: string; accent: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-line p-3.5 transition hover:border-brand/30 hover:bg-brand-50/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 [&_svg]:h-5 [&_svg]:w-5" style={{ color: accent }}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-ink">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-muted">{description}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Meta({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return <div className="flex min-w-0 items-center gap-2"><span className="[&_svg]:h-4 [&_svg]:w-4" style={{ color }}>{icon}</span><span className="min-w-0"><span className="block truncate text-xs font-bold text-ink sm:text-sm">{value}</span><span className="block text-[11px] text-muted">{label}</span></span></div>;
}