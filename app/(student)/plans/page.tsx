"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Check, Crown } from "lucide-react";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PLAN_LIST } from "@/lib/utils/plans";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/format";
import type { PlanKey } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FullPageSpinner } from "@/components/shared/loading";
import {
  PaymentMethodSelector,
  type PaymentMethodId,
} from "@/components/student/payment-method-selector";
import { site } from "@/config/site";
import { useState } from "react";

export default function PlansPage() {
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("telebirr");
  const onboarding = searchParams.get("onboarding") === "1";
  const { data, isLoading } = useQuery({ queryKey: qk.plan, queryFn: plansApi.me });

  const currentPlan = data?.plan ?? "free";
  const latest = data?.latestPayment ?? null;
  const showPending = latest?.status === "pending";
  const showRejected = latest?.status === "rejected";

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="lg:hidden">
        <p className="text-xs font-bold uppercase text-[#2D5BFF]">Choose your access</p>
        <h1 className="mt-1 text-2xl font-black text-[#1A1A1A]">Prime UAT Plans</h1>
        <p className="mt-2 text-sm leading-6 text-[#6B7280]">One payment unlocks focused preparation across web and mobile.</p>
      </div>

      {onboarding ? (
        <div className="rounded-lg border border-brand/20 bg-brand-50 px-5 py-4 text-sm leading-6 text-ink">
          Your account is ready. Paid plans continue to secure checkout, while
          the Free plan is already active. Need payment help?{" "}
          <Link
            href={site.supportTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand hover:underline"
          >
            Message {site.supportTelegram}
          </Link>
          .
        </div>
      ) : null}

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

      <section className="space-y-3 border-y border-line py-5">
        <div>
          <h2 className="text-sm font-bold text-ink">Choose a payment account</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Select where you plan to send the payment. Both account numbers stay
            visible so you can check them before choosing a plan.
          </p>
        </div>
        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </section>

      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
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
                  "flex flex-col overflow-hidden",
                  highlight && "border-brand/40 shadow-[0_10px_30px_rgba(45,91,255,0.12)] lg:shadow-md",
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
                        href={`/plans/checkout?plan=${p.key as Exclude<PlanKey, "free">}&method=${paymentMethod}`}
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
