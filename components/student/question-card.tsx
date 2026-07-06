"use client";

import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Question, SubmitAnswerResult } from "@/lib/api/types";
import { OptionButton, type OptionState } from "@/components/student/option-button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function QuestionCard({
  question,
  index,
  total,
  selected,
  result,
  pending,
  onSelect,
}: {
  question: Question;
  index: number;
  total: number;
  selected: string | null;
  result: SubmitAnswerResult | null;
  pending: boolean;
  onSelect: (label: string) => void;
}) {
  const answered = result !== null;
  const gated = result?.gated === true;
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0;

  function stateFor(label: string): OptionState {
    if (answered) {
      // Free/gated attempts never reveal the correct answer — keep the picked
      // option highlighted as "selected" without grading it.
      if (gated) return label === selected ? "selected" : "idle";
      if (label === result?.correctOption) return "correct";
      if (label === selected) return "wrong";
      return "idle";
    }
    return label === selected ? "selected" : "idle";
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-muted">
            <span>
              Question {index + 1} of {total}
            </span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <h2 className="text-lg font-semibold font-display text-ink">
          {question.questionText}
        </h2>

        <div className="space-y-3">
          {(question.options ?? []).map((opt) => (
            <OptionButton
              key={opt.label}
              option={opt}
              state={stateFor(opt.label)}
              disabled={answered || pending}
              onSelect={() => onSelect(opt.label)}
            />
          ))}
        </div>

        {answered ? (
          gated ? (
            <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="text-sm font-semibold text-brand">
                Answer recorded
              </p>
              <p className="mt-1 text-sm text-muted">
                Subscribe to see if you got it right and read the explanation.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-xl border p-4",
                result.isCorrect
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-red-200 bg-red-50",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  result.isCorrect ? "text-emerald-700" : "text-red-700",
                )}
              >
                {result.isCorrect ? "Correct!" : "Not quite."}
              </p>
              {result.explanation ? (
                <div className="mt-2 flex gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-sm text-ink">{result.explanation}</p>
                </div>
              ) : null}
            </div>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
