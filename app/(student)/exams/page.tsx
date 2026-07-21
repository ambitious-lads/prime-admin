"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  Diamond,
  FileQuestion,
  Flame,
  LockKeyhole,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton, Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openSubscriptionPrompt } from "@/components/student/subscription-prompt-modal";
import { cn } from "@/lib/utils/cn";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import type { Exam, ExamAttempt } from "@/lib/api/types";

const TABS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "solved", label: "Solved" },
  { value: "topic-wise", label: "Topic Wise" },
  { value: "saved", label: "Saved" },
] as const;

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return `rgba(45, 91, 255, ${alpha})`;
  const value = Number.parseInt(clean, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function titleCase(value?: string | null) {
  if (!value) return "General";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function useExamCountdown(exam: Exam) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!exam.scheduledAt || !exam.isScheduleRestricted) return;

    function update() {
      const remaining = new Date(exam.scheduledAt as string).getTime() - Date.now();
      if (remaining <= 0) {
        setLabel(null);
        return false;
      }
      const hours = Math.floor(remaining / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1_000);
      setLabel(`${hours}h ${minutes}m ${seconds}s`);
      return true;
    }

    if (!update()) return;
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [exam.isScheduleRestricted, exam.scheduledAt]);

  return label;
}

export default function ExamsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("latest");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const query = useQuery({
    queryKey: qk.exams({ tab }),
    queryFn: () => examsApi.list({ tab }),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, saved }: { id: string; saved: boolean }) =>
      saved ? examsApi.unsave(id) : examsApi.save(id),
    onMutate: async ({ id, saved }) => {
      const key = qk.exams({ tab });
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Exam[]>(key);
      queryClient.setQueryData<Exam[]>(key, (old) =>
        (old ?? [])
          .map((exam) => (exam.id === id ? { ...exam, isSaved: !saved } : exam))
          .filter((exam) => tab !== "saved" || exam.isSaved),
      );
      return { previous, key };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(context.key, context.previous);
      toastApiError(error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["exams"] }),
  });

  const startMutation = useMutation({
    mutationFn: (examId: string) => examsApi.start(examId),
    onSuccess: (attempt: ExamAttempt) => {
      const attemptId = attempt.attemptId ?? attempt.id;
      if (!attemptId) {
        toastApiError(new Error("Could not start the exam. Please try again."));
        return;
      }
      setSelectedExam(null);
      router.push(`/exams/attempt/${attemptId}`);
    },
    onError: toastApiError,
  });

  function chooseExam(exam: Exam) {
    if (exam.isLocked) {
      openSubscriptionPrompt({
        requiredPlan: exam.minPlan === "pro_plus" ? "pro_plus" : "pro",
        title: `Unlock ${exam.title}`,
        description: "Upgrade to open this mock assessment, join its leaderboard, and review your full result report.",
      });
      return;
    }
    setSelectedExam(exam);
  }

  const exams = query.data ?? [];
  const isSolved = Boolean(selectedExam?.userProgress?.isSolved);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border-b border-line pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-max">
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {query.isLoading ? (
        <CardGridSkeleton count={4} />
      ) : exams.length === 0 ? (
        <EmptyState
          icon={<FileQuestion />}
          title="No mock tests found"
          message={tab === "saved" ? "Bookmark a mock test to keep it here." : "Try another mock-test filter."}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              saving={saveMutation.isPending && saveMutation.variables?.id === exam.id}
              onSave={() => saveMutation.mutate({ id: exam.id, saved: Boolean(exam.isSaved) })}
              onStart={() => chooseExam(exam)}
            />
          ))}
        </div>
      )}

      <Dialog open={Boolean(selectedExam)} onOpenChange={(open) => !open && setSelectedExam(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>{isSolved ? "Retake mock test?" : "Start mock test?"}</DialogTitle>
            <DialogDescription className="leading-6">
              {isSolved
                ? `Retaking "${selectedExam?.title}" creates a new practice attempt without changing your first leaderboard rank.`
                : `You are about to start "${selectedExam?.title}". Make sure you have ${selectedExam?.durationMinutes ?? 0} uninterrupted minutes.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-4 text-center">
            <div><p className="text-lg font-black text-ink">{selectedExam?.questionCount ?? 0}</p><p className="text-xs text-muted">Questions</p></div>
            <div><p className="text-lg font-black text-ink">{selectedExam?.durationMinutes ?? 0} min</p><p className="text-xs text-muted">Time limit</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExam(null)}>Cancel</Button>
            <Button disabled={!selectedExam || startMutation.isPending} onClick={() => selectedExam && startMutation.mutate(selectedExam.id)}>
              {startMutation.isPending ? <Spinner /> : isSolved ? <RefreshCw /> : <Play />}
              {isSolved ? "Retake now" : "Start now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExamCard({ exam, saving, onSave, onStart }: { exam: Exam; saving: boolean; onSave: () => void; onStart: () => void }) {
  const color = exam.primaryColor || "#2D5BFF";
  const background = hexToRgba(color, 0.055);
  const border = hexToRgba(color, 0.18);
  const countdown = useExamCountdown(exam);
  const solved = Boolean(exam.userProgress?.isSolved);
  const locked = Boolean(exam.isLocked);
  const participants = exam.totalParticipants ?? exam.participantsCount ?? 0;
  const activity = participants === 0 ? "New" : participants < 10 ? "Growing" : participants < 50 ? "Popular" : "Community pick";

  const metadata = solved
    ? [
        ["Questions", exam.questionCount],
        ["Best score", exam.userProgress?.bestScore ?? "-"],
        ["Percentile", exam.userProgress?.percentile != null ? Math.round(exam.userProgress.percentile) : "-"],
        ["Rank", exam.userProgress?.firstTrialRank != null ? `#${exam.userProgress.firstTrialRank}` : "-"],
      ]
    : [
        ["Questions", exam.questionCount],
        ["Time", `${exam.durationMinutes}m`],
        ["Level", titleCase(exam.difficulty)],
        ["Type", exam.type || "Mock"],
      ];

  return (
    <article className="overflow-hidden rounded-2xl border p-4 shadow-[0_6px_22px_rgba(15,23,42,0.055)] sm:p-5" style={{ backgroundColor: background, borderColor: border }}>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-white" style={{ borderColor: border, color }}>
          {locked ? <LockKeyhole className="h-5 w-5" /> : <FileQuestion className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color }}>{exam.type || exam.category || "Mock exam"}</span>
            {exam.isPremium ? <Badge color={color} icon={<Diamond />}>Pro</Badge> : exam.isRecommended ? <Badge color={color} icon={<Sparkles />}>Recommended</Badge> : <span className="inline-flex items-center gap-1 rounded-full border bg-white px-2 py-1 text-[10px] font-bold text-muted"><Flame className="h-3 w-3" />{activity}</span>}
          </div>
          <h2 className="mt-1 text-base font-black leading-6 text-ink sm:text-lg">{exam.title}</h2>
        </div>
        <button type="button" disabled={saving} onClick={onSave} aria-label={exam.isSaved ? "Remove bookmark" : "Bookmark exam"} className={cn("flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white text-muted transition hover:text-brand disabled:opacity-50", exam.isSaved && "text-brand")}>
          <Bookmark className={cn("h-5 w-5", exam.isSaved && "fill-current")} />
        </button>
      </div>

      {exam.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{exam.description}</p> : null}

      <div className="mt-4 grid grid-cols-4 divide-x divide-line rounded-xl border border-line bg-white px-1 py-3">
        {metadata.map(([label, value]) => (
          <div key={String(label)} className="min-w-0 px-1 text-center sm:px-2">
            <p className="truncate text-[9px] font-bold uppercase text-muted">{label}</p>
            <p className="mt-1 truncate text-xs font-black text-ink sm:text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {solved && exam.userProgress?.firstTrialRank != null ? <p className="inline-flex items-center gap-1.5 text-xs font-bold text-muted"><Trophy className="h-4 w-4" style={{ color }} />Best rank <span style={{ color }}>#{exam.userProgress.firstTrialRank}</span></p> : <span />}
        {countdown ? (
          <div className="text-right"><p className="text-[10px] font-bold text-muted">Starts in</p><p className="font-black tabular-nums" style={{ color }}>{countdown}</p></div>
        ) : (
          <Button type="button" onClick={onStart} style={{ backgroundColor: color }}>
            {locked ? <LockKeyhole /> : solved ? <RefreshCw /> : <Play />}
            {locked ? "Unlock" : solved ? "Retake" : "Take challenge"}
          </Button>
        )}
      </div>
    </article>
  );
}

function Badge({ color, icon, children }: { color: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-white [&_svg]:h-3 [&_svg]:w-3" style={{ backgroundColor: color }}>{icon}{children}</span>;
}
