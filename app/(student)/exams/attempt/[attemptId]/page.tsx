"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FullPageSpinner } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExamTimer } from "@/components/exams/exam-timer";
import {
  ExamIntegrityGuard,
  type IntegrityReason,
} from "@/components/exams/exam-integrity-guard";
import { FlagButton } from "@/components/exams/flag-button";
import { QuestionPalette } from "@/components/exams/question-palette";
import { QuestionView } from "@/components/exams/question-view";
import { SubmitDialog } from "@/components/exams/submit-dialog";
import { examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import type { ExamAnswer, Question } from "@/lib/api/types";

type AnswerMap = Record<string, ExamAnswer>;

function emptyAnswer(questionId: string): ExamAnswer {
  return {
    questionId,
    selectedOption: null,
    isFlagged: false,
    timeSpentSeconds: 0,
  };
}

export default function ExamAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = params.attemptId;
  const router = useRouter();

  const questionsQuery = useQuery({
    queryKey: qk.attemptQuestions(attemptId),
    queryFn: () => examsApi.questions(attemptId),
    enabled: Boolean(attemptId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const attemptData = questionsQuery.data;

  const questions = useMemo<Question[]>(
    () => attemptData?.questions ?? [],
    [attemptData],
  );

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [integrityStrike, setIntegrityStrike] = useState(0);
  const [securityAccepted, setSecurityAccepted] = useState(false);

  const elapsedRef = useRef(0);
  const submittedRef = useRef(false);
  const integrityStrikeRef = useRef(0);
  const answersRef = useRef<AnswerMap>({});
  const secondsLeftRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    if (questions.length === 0) return;
    setAnswers((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const next: AnswerMap = {};
      const saved = new Map(
        (attemptData?.savedAnswers ?? []).map((answer) => [
          answer.questionId,
          answer,
        ]),
      );
      for (const question of questions) {
        const savedAnswer = saved.get(question.id);
        next[question.id] = savedAnswer
          ? {
              ...emptyAnswer(question.id),
              ...savedAnswer,
              questionId: question.id,
            }
          : emptyAnswer(question.id);
      }
      return next;
    });
    setSecondsLeft((prev) =>
      prev === null
        ? attemptData?.timeLeftSeconds || questions.length * 60
        : prev,
    );
  }, [questions, attemptData]);

  const buildSyncBody = useCallback(() => {
    const left = secondsLeftRef.current ?? 0;
    return {
      timeLeftSeconds: Math.max(0, Math.floor(left)),
      timeSpentSeconds: Math.floor(elapsedRef.current),
      answers: Object.values(answersRef.current),
    };
  }, []);

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      await examsApi.sync(attemptId, buildSyncBody()).catch(() => {});
      await examsApi.submit(attemptId);
      router.replace(`/exams/report/${attemptId}`);
    } catch (error) {
      submittedRef.current = false;
      setSubmitting(false);
      toastApiError(error);
    }
  }, [attemptId, buildSyncBody, router]);

  const registerIntegrityViolation = useCallback(
    (_reason: IntegrityReason) => {
      if (submittedRef.current) return;
      const next = Math.min(3, integrityStrikeRef.current + 1);
      integrityStrikeRef.current = next;
      setIntegrityStrike(next);
      if (next >= 3) void submit();
    },
    [submit],
  );

  const ready = questions.length > 0 && secondsLeft !== null;

  useEffect(() => {
    if (!ready || !securityAccepted) return;
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = Math.max(0, Math.round((now - lastTickRef.current) / 1000));
      lastTickRef.current = now;
      if (delta > 0) {
        elapsedRef.current += delta;
        setAnswers((prev) => {
          const active = questions[current];
          if (!active) return prev;
          const entry = prev[active.id] ?? emptyAnswer(active.id);
          return {
            ...prev,
            [active.id]: {
              ...entry,
              timeSpentSeconds: entry.timeSpentSeconds + delta,
            },
          };
        });
      }
      setSecondsLeft((prev) => {
        if (prev === null) return prev;
        const next = prev - 1;
        if (next <= 0) {
          void submit();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [ready, securityAccepted, current, questions, submit]);

  useEffect(() => {
    if (!ready || !securityAccepted) return;
    const interval = setInterval(() => {
      examsApi.sync(attemptId, buildSyncBody()).catch(() => {});
    }, 15_000);
    return () => clearInterval(interval);
  }, [ready, securityAccepted, attemptId, buildSyncBody]);

  useEffect(() => {
    if (!ready || !securityAccepted) return;
    let hiddenViolationRecorded = false;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !hiddenViolationRecorded) {
        hiddenViolationRecorded = true;
        registerIntegrityViolation("tab");
      } else if (document.visibilityState === "visible") {
        hiddenViolationRecorded = false;
      }
    };
    const onCopy = (event: ClipboardEvent) => {
      event.preventDefault();
      registerIntegrityViolation("copy");
    };
    const onCut = (event: ClipboardEvent) => {
      event.preventDefault();
      registerIntegrityViolation("copy");
    };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        (event.ctrlKey || event.metaKey) &&
        ["c", "x", "a", "u", "s"].includes(key)
      ) {
        event.preventDefault();
        if (key === "c" || key === "x") registerIntegrityViolation("copy");
      }
      if (event.key === "PrintScreen") {
        event.preventDefault();
        registerIntegrityViolation("copy");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ready, registerIntegrityViolation]);

  useEffect(() => {
    if (!ready || !securityAccepted) return;
    const handler = () => {
      examsApi.sync(attemptId, buildSyncBody()).catch(() => {});
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [ready, securityAccepted, attemptId, buildSyncBody]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return;
      examsApi.sync(attemptId, buildSyncBody()).catch(() => {});
      setCurrent(index);
    },
    [questions.length, attemptId, buildSyncBody],
  );

  const selectOption = useCallback(
    (option: string) => {
      const active = questions[current];
      if (!active) return;
      setAnswers((prev) => {
        const entry = prev[active.id] ?? emptyAnswer(active.id);
        return { ...prev, [active.id]: { ...entry, selectedOption: option } };
      });
    },
    [questions, current],
  );

  const toggleFlag = useCallback(() => {
    const active = questions[current];
    if (!active) return;
    setAnswers((prev) => {
      const entry = prev[active.id] ?? emptyAnswer(active.id);
      return { ...prev, [active.id]: { ...entry, isFlagged: !entry.isFlagged } };
    });
  }, [questions, current]);

  if (questionsQuery.isLoading) {
    return <FullPageSpinner />;
  }

  if (questionsQuery.isError || questions.length === 0) {
    return (
      <EmptyState
        title="Couldn't load this attempt"
        message="The exam questions are unavailable. Please head back and try starting again."
        action={
          <Button onClick={() => router.replace("/exams")}>
            Back to exams
          </Button>
        }
      />
    );
  }

  const activeQuestion = questions[current];
  const activeAnswer =
    answers[activeQuestion.id] ?? emptyAnswer(activeQuestion.id);

  const paletteStates = questions.map((question) => {
    const entry = answers[question.id];
    return {
      answered: Boolean(entry?.selectedOption),
      flagged: Boolean(entry?.isFlagged),
    };
  });

  const unanswered = paletteStates.filter((state) => !state.answered).length;

  return (
    <div className="exam-guard space-y-6">
      <ExamIntegrityGuard
        ready={ready}
        submitting={submitting}
        strikeCount={integrityStrike}
        onViolation={registerIntegrityViolation}
        onAccepted={() => setSecurityAccepted(true)}
      />
      <div className="flex flex-col gap-3 lg:hidden">
        <ExamTimer seconds={secondsLeft ?? 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-6 p-6">
              <QuestionView
                question={activeQuestion}
                index={current}
                total={questions.length}
                selected={activeAnswer.selectedOption}
                onSelect={selectOption}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                <FlagButton
                  flagged={activeAnswer.isFlagged}
                  onToggle={toggleFlag}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={current === 0}
                    onClick={() => goTo(current - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {current === questions.length - 1 ? (
                    <SubmitDialog
                      unanswered={unanswered}
                      total={questions.length}
                      submitting={submitting}
                      onConfirm={() => void submit()}
                      trigger={<Button>Submit</Button>}
                    />
                  ) : (
                    <Button onClick={() => goTo(current + 1)}>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <div className="hidden lg:block">
            <ExamTimer seconds={secondsLeft ?? 0} />
          </div>
          <Card>
            <CardContent className="space-y-4 p-5">
              <QuestionPalette
                states={paletteStates}
                current={current}
                onSelect={goTo}
              />
              <SubmitDialog
                unanswered={unanswered}
                total={questions.length}
                submitting={submitting}
                onConfirm={() => void submit()}
                trigger={
                  <Button className="w-full" variant="outline">
                    Submit exam
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
