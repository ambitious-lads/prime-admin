"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function SetSummary({
  correct,
  total,
  timeSpentSeconds,
  backHref,
}: {
  correct: number;
  total: number;
  timeSpentSeconds: number;
  backHref: string;
}) {
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand">
          <PartyPopper className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-ink">Set complete</h2>
          <p className="text-sm text-muted">Nice work — here&apos;s how you did.</p>
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          <div className="rounded-xl border border-line p-4">
            <p className="text-2xl font-bold font-accent tabular-nums text-ink">
              {formatNumber(correct)}/{formatNumber(total)}
            </p>
            <p className="mt-1 text-xs text-muted">Score</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-2xl font-bold font-accent tabular-nums text-ink">
              {formatPercent(accuracy)}
            </p>
            <p className="mt-1 text-xs text-muted">Accuracy</p>
          </div>
          <div className="rounded-xl border border-line p-4">
            <p className="text-2xl font-bold font-accent tabular-nums text-ink">
              {formatDuration(timeSpentSeconds)}
            </p>
            <p className="mt-1 text-xs text-muted">Time</p>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link href={backHref}>Back to topic</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
