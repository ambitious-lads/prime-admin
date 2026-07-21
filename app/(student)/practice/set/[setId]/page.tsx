"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks } from "lucide-react";
import { practiceApi, streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { useSessionLeaveGuard } from "@/hooks/use-session-leave-guard";
import type { SubmitAnswerResult } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
import { LeaveSessionDialog } from "@/components/shared/leave-session-dialog";
import { QuestionCard } from "@/components/student/question-card";
import { PracticeQuestionTools } from "@/components/practice/practice-question-tools";
import { SetSummary } from "@/components/student/set-summary";
import { SubscribeWall } from "@/components/student/subscribe-wall";
import { ExamTimer } from "@/components/exams/exam-timer";
import { SubmitDialog } from "@/components/exams/submit-dialog";
import { usePlan } from "@/hooks/use-plan";
import { Button } from "@/components/ui/button";

export default function PracticeRunnerPage() {
  const params = useParams<{ setId: string }>();
  const searchParams = useSearchParams();
  const setId = params.setId;
  const isExamMode = searchParams.get("mode") === "review";

  const { can, isSuccess: planReady } = usePlan();
  const isPaid = can("pro");

  const setMeta = useQuery({
    queryKey: qk.set(setId),
    queryFn: () => practiceApi.set(setId),
    enabled: Boolean(setId),
  });
  const { data, isLoading } = useQuery({
    queryKey: qk.setQuestions(setId),
    queryFn: () => practiceApi.questions(setId),
    enabled: Boolean(setId),
  });
  const setTitle =
    setMeta.data?.title ?? searchParams.get("title") ?? "Practice set";
  const questions = useMemo(() => data ?? [], [data]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitAnswerResult | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [gated, setGated] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const totalTimeRef = useRef(0);
  const questionStartRef = useRef(0);
  const examSubmittedRef = useRef(false);

  const current = questions[index];
  const total = questions.length;
  const answeredCount = Object.keys(examAnswers).length;
  const unansweredCount = Math.max(0, total - answeredCount);
  const configuredExamSeconds =
    (setMeta.data?.estimatedTimeMinutes ?? Math.max(1, total)) * 60;
  const leaveGuard = useSessionLeaveGuard({
    enabled: total > 0 && !finished && !finishing,
    fallbackHref: "/practice",
  });

  useEffect(() => {
    questionStartRef.current = performance.now();
  }, [index]);

  useEffect(() => {
    if (!isExamMode || total === 0 || secondsLeft !== null) return;
    const initializeTimer = window.setTimeout(() => {
      setSecondsLeft(configuredExamSeconds);
    }, 0);
    return () => window.clearTimeout(initializeTimer);
  }, [configuredExamSeconds, isExamMode, secondsLeft, total]);

  useEffect(() => {
    if (!isExamMode || finished || finishing || secondsLeft === null) return;
    if (secondsLeft <= 0) return;

    const timer = window.setInterval(() => {
      totalTimeRef.current += 1;
      setTotalTime(totalTimeRef.current);
      setSecondsLeft((currentSeconds) =>
        currentSeconds === null ? null : Math.max(0, currentSeconds - 1),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, finishing, isExamMode, secondsLeft]);

  useEffect(() => {
    if (
      !isExamMode ||
      secondsLeft !== 0 ||
      finishing ||
      finished ||
      examSubmittedRef.current
    ) {
      return;
    }
    void submitExam();
  });

  async function handleSelect(label: string) {
    if (!current || result || submitting) return;
    setSelected(label);
    setSubmitting(true);
    const elapsed = Math.round(
      (performance.now() - questionStartRef.current) / 1000,
    );
    try {
      const res = await practiceApi.submitAnswer(setId, {
        questionId: current.id,
        selectedOption: label,
        timeSpentSeconds: elapsed,
      });
      totalTimeRef.current += elapsed;
      setTotalTime(totalTimeRef.current);
      setResult(res);
      if (res.gated) setGated(true);
      if (res.isCorrect) setCorrectCount((count) => count + 1);
    } catch (error) {
      setSelected(null);
      toastApiError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function selectExamAnswer(questionId: string, label: string) {
    if (finishing) return;
    setExamAnswers((answers) => ({ ...answers, [questionId]: label }));
  }

  function goNext() {
    setIndex((currentIndex) => currentIndex + 1);
    setSelected(null);
    setResult(null);
    questionStartRef.current = performance.now();
  }

  async function completeSession(questionCount: number) {
    await practiceApi.complete(setId, {
      timeSpentSeconds: totalTimeRef.current,
    });
    try {
      await streaksApi.record({
        activityType: "practice",
        questionsAnswered: questionCount,
      });
    } catch {}
    setFinished(true);
  }

  async function finishPractice() {
    setFinishing(true);
    try {
      await completeSession(total);
    } catch (error) {
      toastApiError(error);
    } finally {
      setFinishing(false);
    }
  }

  async function submitExam() {
    if (examSubmittedRef.current) return;
    examSubmittedRef.current = true;
    setFinishing(true);

    try {
      const elapsedPerAnswer = Math.max(
        1,
        Math.round(totalTimeRef.current / Math.max(1, answeredCount)),
      );
      const results = await Promise.all(
        questions.flatMap((question) => {
          const selectedOption = examAnswers[question.id];
          if (!selectedOption) return [];
          return practiceApi.submitAnswer(setId, {
            questionId: question.id,
            selectedOption,
            timeSpentSeconds: elapsedPerAnswer,
          });
        }),
      );

      setCorrectCount(results.filter((answer) => answer.isCorrect).length);
      setGated(results.some((answer) => answer.gated));
      await completeSession(answeredCount);
    } catch (error) {
      examSubmittedRef.current = false;
      toastApiError(error);
    } finally {
      setFinishing(false);
    }
  }

  const isLast = index >= total - 1;

  if (isLoading) return <FullPageSpinner />;

  if (total === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title={setTitle} />
        <EmptyState
          icon={<ListChecks />}
          title="No questions yet"
          message="This set doesn't have any questions to practice right now."
          action={
            <Button asChild variant="outline">
              <Link href="/practice">Back to practice</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (finished) {
    if (gated || (planReady && !isPaid)) {
      return <SubscribeWall total={total} backHref="/practice" />;
    }
    return (
      <SetSummary
        correct={correctCount}
        total={total}
        timeSpentSeconds={totalTime}
        backHref="/practice"
      />
    );
  }

  return (
    <div
      className={
        isExamMode
          ? "mx-auto max-w-4xl space-y-6"
          : "mx-auto max-w-3xl space-y-6"
      }
    >
      <PageHeader
        title={setTitle}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => leaveGuard.requestLeave("/practice")}
          >
            <ArrowLeft className="h-4 w-4" /> Exit
          </Button>
        }
      />

      {isExamMode ? (
        <>
          <div className="sticky top-3 z-20 flex flex-col gap-3 rounded-xl border border-line bg-white/95 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <span>
                <strong className="text-ink">{answeredCount}</strong> of {total}
                {" "}answered
              </span>
            </div>
            <ExamTimer seconds={secondsLeft ?? configuredExamSeconds} />
          </div>

          <div className="space-y-5">
            {questions.map((question, questionIndex) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={questionIndex}
                total={total}
                selected={examAnswers[question.id] ?? null}
                result={null}
                revealResult={false}
                pending={finishing}
                onSelect={(label) => selectExamAnswer(question.id, label)}
              />
            ))}
          </div>

          <div className="flex justify-end border-t border-line pt-5">
            <SubmitDialog
              unanswered={unansweredCount}
              total={total}
              submitting={finishing}
              onConfirm={() => void submitExam()}
              trigger={
                <Button size="lg">
                  {finishing ? <Spinner /> : null}
                  Submit exam
                </Button>
              }
            />
          </div>
        </>
      ) : (
        <>
          {current ? (
            <>
              <QuestionCard
                question={current}
                index={index}
                total={total}
                selected={selected}
                result={result}
                pending={submitting}
                onSelect={handleSelect}
              />
              <PracticeQuestionTools question={current} />
            </>
          ) : null}

          <div className="flex justify-end">
            {isLast ? (
              <Button
                onClick={finishPractice}
                disabled={!result || finishing}
              >
                {finishing ? <Spinner /> : null}
                Finish set
              </Button>
            ) : (
              <Button onClick={goNext} disabled={!result}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}

      <LeaveSessionDialog
        open={leaveGuard.open}
        leaving={leaveGuard.leaving}
        description={
          isExamMode
            ? `You still have ${unansweredCount} unanswered ${unansweredCount === 1 ? "question" : "questions"}. Your exam will not be submitted if you leave.`
            : "Your current question progress may be incomplete. Stay and finish the set, or leave the session now."
        }
        onCancel={leaveGuard.cancelLeave}
        onConfirm={leaveGuard.confirmLeave}
      />
    </div>
  );
}