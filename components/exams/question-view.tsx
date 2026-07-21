"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Question } from "@/lib/api/types";
import { RichDocumentView } from "@/components/student/rich-document-view";

export function QuestionView({
  question,
  index,
  total,
  selected,
  onSelect,
}: {
  question: Question;
  index: number;
  total: number;
  selected: string | null;
  onSelect: (option: string) => void;
}) {
  const options = question.options ?? [];
  return (
    <div className="protected-content space-y-6" onCopy={(event) => event.preventDefault()} onCut={(event) => event.preventDefault()} onContextMenu={(event) => event.preventDefault()} onDragStart={(event) => event.preventDefault()}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Question {index + 1} of {total}
        </p>
        {question.visual?.type !== "rich_document" ? (
          <p className="text-lg font-medium leading-relaxed text-ink">
            {question.questionText}
          </p>
        ) : null}

        {question.visual?.type === "rich_document" ? (
          <RichDocumentView document={question.visual.prompt} />
        ) : null}
      </div>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selected === option.label;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onSelect(option.label)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                isSelected
                  ? "border-brand bg-brand-50"
                  : "border-line bg-white hover:border-brand/40 hover:bg-surface",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                  isSelected
                    ? "bg-brand text-white"
                    : "bg-surface text-muted",
                )}
              >
                {isSelected ? <Check className="h-4 w-4" /> : option.label}
              </span>
              <span className="text-sm text-ink">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
