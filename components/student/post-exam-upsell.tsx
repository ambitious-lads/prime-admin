"use client";

import Link from "next/link";
import { ArrowRight, Diamond, Sparkles } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { PLANS } from "@/lib/utils/plans";
import { Card, CardContent } from "@/components/ui/card";

export function PostExamUpsell() {
  const { plan } = usePlan();

  if (plan === "pro_plus" || plan === null) return null;

  const targets = plan === "free" ? (["pro", "pro_plus"] as const) : (["pro_plus"] as const);

  return (
    <Card className="border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display font-bold text-ink">
              {plan === "free"
                ? "See this kind of score every time"
                : "Go further with Pro Plus"}
            </p>
            <p className="text-sm text-muted">
              {plan === "free"
                ? "Upgrade to unlock every mock exam, leaderboards, and detailed reports."
                : "Add full courses, AI tutor, and advanced analytics."}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {targets.map((key) => (
            <Link
              key={key}
              href="/plans"
              className="group flex items-center justify-between rounded-xl border border-line bg-white p-4 transition hover:border-brand"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                  <Diamond className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{PLANS[key].label}</span>
                  <span className="text-xs text-muted">
                    {new Intl.NumberFormat("en-ET").format(PLANS[key].price)} birr
                  </span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted">
          One-time payment. Yours until exam day.
        </p>
      </CardContent>
    </Card>
  );
}
