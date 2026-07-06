"use client";

import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Shown at the end of a free-plan practice attempt in place of the score
 * summary. Free users may practice, but their results, explanations, and
 * review stay behind a paid plan — this prompts them to subscribe.
 */
export function SubscribeWall({
  total,
  backHref,
}: {
  total: number;
  backHref: string;
}) {
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand">
          <Lock className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-display text-ink">
            You answered all {total} questions
          </h2>
          <p className="text-sm text-muted">
            Subscribe to reveal your score, see which answers were right, and
            unlock detailed explanations for every question.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/plans">
            <Sparkles className="h-4 w-4" /> Subscribe to see your results
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link href={backHref}>Back to practice</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
