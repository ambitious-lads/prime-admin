"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { practiceApi, streaksApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import type { SubmitAnswerResult } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
import { QuestionCard } from "@/components/student/question-card";
import { SetSummary } from "@/components/student/set-summary";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";

export default function PracticeRunnerPage() {
  const params = useParams<{ setId: string }>();
  const setId = params.setId;

  const { data, isLoading } = useQuery({
    queryKey: qk.setQuestions(setId),
    queryFn: () => practiceApi.questions(setId),
    enabled: Boolean(setId),
  });

  const questions = useMemo(() => data ?? [], [data]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitAnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const totalTimeRef = useRef(0);
  const questionStartRef = useRef(0);

  const current = questions[index];
  const total = questions.length;

  useEffect(() => {
    questionStartRef.current = performance.now();
  }, [index]);

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
      if (res.isCorrect) setCorrectCount((c) => c + 1);
    } catch (e) {
      setSelected(null);
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    setIndex((i) => i + 1);
    setSelected(null);
    setResult(null);
    questionStartRef.current = performance.now();
  }

  async function finish() {
    setFinishing(true);
    try {
      await practiceApi.complete(setId, {
        timeSpentSeconds: totalTimeRef.current,
      });
      try {
        await streaksApi.record({
          activityType: "practice",
          questionsAnswered: total,
        });
      } catch {}
      setFinished(true);
    } catch (e) {
      toastApiError(e);
    } finally {
      setFinishing(false);
    }
  }

  const isLast = index >= total - 1;

  if (isLoading) return <FullPageSpinner />;

  if (total === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Practice set" />
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
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Practice set"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/practice">
              <ArrowLeft className="h-4 w-4" /> Exit
            </Link>
          </Button>
        }
      />

      {current ? (
        <QuestionCard
          question={current}
          index={index}
          total={total}
          selected={selected}
          result={result}
          pending={submitting}
          onSelect={handleSelect}
        />
      ) : null}

      <div className="flex justify-end">
        {isLast ? (
          <Button onClick={finish} disabled={!result || finishing}>
            {finishing ? <Spinner /> : null}
            Finish set
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!result}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
