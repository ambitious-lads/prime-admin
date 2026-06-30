"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatClock } from "@/lib/utils/format";

export function ExamTimer({ seconds }: { seconds: number }) {
  const warn = seconds <= 60;
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-accent text-xl tabular-nums",
        warn
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-line bg-white text-ink",
      )}
    >
      <Clock className={cn("h-4 w-4", warn ? "text-red-500" : "text-muted")} />
      {formatClock(seconds)}
    </div>
  );
}
