"use client";

import { cn } from "@/lib/utils/cn";

export type PaletteState = {
  answered: boolean;
  flagged: boolean;
};

export function QuestionPalette({
  states,
  current,
  onSelect,
}: {
  states: PaletteState[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {states.map((state, index) => {
          const isCurrent = index === current;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "relative flex h-9 w-full items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors",
                isCurrent
                  ? "border-brand bg-brand text-white"
                  : state.answered
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-line bg-white text-muted hover:bg-surface",
              )}
            >
              {index + 1}
              {state.flagged ? (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Flagged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand" /> Current
        </span>
      </div>
    </div>
  );
}
