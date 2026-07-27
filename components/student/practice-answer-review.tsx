"use client";

import { Check, ChevronDown, Minus, X } from "lucide-react";
import type {
  Question,
  SubmitAnswerResult,
} from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";
import { RichDocumentView } from "@/components/student/rich-document-view";
import { QuestionVisualView } from "@/components/student/question-visual-view";
import { QuestionPrompt } from "@/components/student/question-prompt";
import { QuestionExplanationView } from "@/components/student/question-explanation-view";
import { PracticeQuestionTools } from "@/components/practice/practice-question-tools";

export function PracticeAnswerReview({
  questions,
  answers,
  results,
}: {
  questions: Question[];
  answers: Record<string, string>;
  results: Record<string, SubmitAnswerResult>;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">
          Answer review
        </h2>
        <p className="mt-1 text-sm text-muted">
          Open a question to compare your answer and review the explanation.
        </p>
      </div>

      {questions.map((question, index) => {
        const selected = answers[question.id] ?? null;
        const result = results[question.id];
        const correctOption = result?.correctOption ?? question.correctOption;
        const isCorrect = result?.isCorrect === true;
        const unanswered = !selected;

        return (
          <details
            key={question.id}
            open={index === 0}
            className="group overflow-hidden rounded-xl border border-line bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 marker:content-none sm:px-5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  unanswered
                    ? "bg-amber-50 text-amber-600"
                    : isCorrect
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600",
                )}
              >
                {unanswered ? (
                  <Minus className="h-4 w-4" />
                ) : isCorrect ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase text-muted">
                  Question {index + 1}
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-ink">
                  {question.questionText}
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
            </summary>

            <div className="space-y-5 border-t border-line px-4 py-5 sm:px-5">
              {question.visual?.type === "rich_document" ? (
                <RichDocumentView document={question.visual.prompt} />
              ) : (
                <QuestionPrompt
                  text={question.questionText}
                  className="font-semibold"
                />
              )}
              <QuestionVisualView visual={question.visual} />

              <div className="space-y-2">
                {question.options.map((option) => {
                  const correct = option.label === correctOption;
                  const picked = option.label === selected;
                  return (
                    <div
                      key={option.label}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-3.5 py-3 text-sm",
                        correct
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : picked
                            ? "border-red-200 bg-red-50 text-red-800"
                            : "border-line bg-white text-ink",
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold">
                        {option.label}
                      </span>
                      <span className="min-w-0 flex-1 whitespace-pre-wrap leading-6">
                        {option.text}
                      </span>
                      {correct ? (
                        <span className="text-xs font-bold">Correct</span>
                      ) : picked ? (
                        <span className="text-xs font-bold">Your answer</span>
                      ) : null}
                    </div>
                  );
                })}
                {unanswered ? (
                  <p className="text-sm font-medium text-amber-700">
                    You did not answer this question.
                  </p>
                ) : null}
              </div>

              {result?.explanation ||
              question.explanation ||
              (question.visual?.type === "rich_document" &&
                question.visual.explanation) ? (
                <div className="rounded-lg bg-surface p-4">
                  <p className="mb-2 text-xs font-bold uppercase text-muted">
                    Explanation
                  </p>
                  <QuestionExplanationView
                    explanation={result?.explanation ?? question.explanation}
                    visual={question.visual}
                  />
                </div>
              ) : null}

              <PracticeQuestionTools question={question} />
            </div>
          </details>
        );
      })}
    </section>
  );
}
