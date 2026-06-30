"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { QuestionOption } from "@/lib/api/types";

export type OptionState = "idle" | "selected" | "correct" | "wrong";

export function OptionButton({
  option,
  state,
  disabled,
  onSelect,
}: {
  option: QuestionOption;
  state: OptionState;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-default",
        state === "idle" &&
          "border-line hover:border-brand/50 hover:bg-surface",
        state === "selected" && "border-brand bg-brand-50",
        state === "correct" && "border-emerald-500 bg-emerald-50",
        state === "wrong" && "border-red-500 bg-red-50",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
          state === "idle" && "border-line text-muted",
          state === "selected" && "border-brand text-brand",
          state === "correct" && "border-emerald-500 bg-emerald-500 text-white",
          state === "wrong" && "border-red-500 bg-red-500 text-white",
        )}
      >
        {state === "correct" ? (
          <Check className="h-4 w-4" />
        ) : state === "wrong" ? (
          <X className="h-4 w-4" />
        ) : (
          option.label
        )}
      </span>
      <span className="text-sm text-ink">{option.text}</span>
    </button>
  );
}
