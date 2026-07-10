"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Crown } from "lucide-react";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PLAN_LIST } from "@/lib/utils/plans";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/format";
import type { PlanKey } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlansPage() {
  const { data, isLoading } = useQuery({ queryKey: qk.plan, queryFn: plansApi.me });

  const currentPlan = data?.plan ?? "free";
  const latest = data?.latestPayment ?? null;
  const showPending = latest?.status === "pending";
  const showRejected = latest?.status === "rejected";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plans"
        subtitle="Pick the plan that fits how you study."
      />

      {showPending ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Your {latest?.plan === "pro_plus" ? "Pro Plus" : "Pro"} payment is still
          awaiting verification. New payments now verify live from the receipt
          link or reference.
        </div>
      ) : null}

      {showRejected ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          Your last payment was rejected
          {latest?.reviewNote ? `: ${latest.reviewNote}` : "."} You can submit a
          new payment below.
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PLAN_LIST.map((p) => {
            const isCurrent = p.key === currentPlan;
            const isPaid = p.key !== "free";
            const highlight = p.key === "pro";
            const upgrade = data?.availableUpgrades?.find(
              (item) => item.plan === p.key,
            );
            const ctaLabel = upgrade
              ? `Upgrade for ${formatMoney(upgrade.upgradePrice)}`
              : `Choose ${p.label}`;
            return (
              <Card
                key={p.key}
                className={cn(
                  "flex flex-col",
                  highlight && "border-brand/40 shadow-md",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {p.key === "pro_plus" ? (
                        <Crown className="h-5 w-5 text-brand" />
                      ) : null}
                      <h3 className="text-lg font-bold font-display text-ink">
                        {p.label}
                      </h3>
                    </div>
                    {isCurrent ? (
                      <Badge variant="success">Current</Badge>
                    ) : highlight ? (
                      <Badge variant="soft">Popular</Badge>
                    ) : null}
                  </div>
                  <p className="font-accent text-3xl font-black text-ink">
                    {p.price === 0 ? "Free" : formatMoney(p.price)}
                    {p.price > 0 ? (
                      <span className="text-sm font-medium text-muted">
                        {" "}one-time
                      </span>
                    ) : null}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-5">
                  <ul className="flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-ink"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Button variant="outline" disabled>
                      Your current plan
                    </Button>
                  ) : isPaid ? (
                    <Button asChild>
                      <Link
                        href={`/plans/checkout?plan=${p.key as Exclude<PlanKey, "free">}`}
                      >
                        {ctaLabel}
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Included
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
