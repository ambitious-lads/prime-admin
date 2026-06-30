"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function UpgradeNudge() {
  const { plan } = usePlan();
  if (plan !== "free") return null;

  return (
    <Card className="overflow-hidden border-brand/20 bg-gradient-to-br from-brand-50 to-white">
      <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-ink">
              Unlock the full Prime UAT
            </h3>
            <p className="max-w-md text-sm text-muted">
              Go Pro for unlimited mock exams, detailed analytics, and premium
              courses. Study smarter and track every gain.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/plans">Upgrade plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
