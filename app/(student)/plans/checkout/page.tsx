"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock3,
  Flashlight,
  Link2,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { site } from "@/config/site";
import { PLANS } from "@/lib/utils/plans";
import { formatMoney } from "@/lib/utils/format";
import { subscribeSchema, type SubscribeInput } from "@/lib/validation/plans";
import { toastApiError } from "@/hooks/use-api-error";
import { captureEvent } from "@/lib/observability/posthog";
import type { PlanKey } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { FullPageSpinner, Spinner } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaidPlan = Exclude<PlanKey, "free">;

function isPaidPlan(value: string | null): value is PaidPlan {
  return value === "pro" || value === "pro_plus";
}

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const planParam = searchParams.get("plan");
  const plan: PaidPlan = isPaidPlan(planParam) ? planParam : "pro";
  const planInfo = PLANS[plan];
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const [verbIndex, setVerbIndex] = useState(0);
  const { data: myPlan } = useQuery({
    queryKey: qk.plan,
    queryFn: plansApi.me,
  });
  const upgrade = myPlan?.availableUpgrades?.find((item) => item.plan === plan);
  const amountDue = upgrade?.upgradePrice ?? planInfo.price;
  const isUpgrade = Boolean(upgrade && upgrade.upgradePrice < planInfo.price);

  const verbs = ["checking", "matching", "locking", "activating"];
  const form = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { plan, receiptUrl: "", note: "" },
  });
  const receiptValue = form.watch("receiptUrl");
  const receiptReady = receiptValue.trim().length >= 4;

  useEffect(() => {
    if (!submitting) return;
    const timer = window.setInterval(() => {
      setVerbIndex((value) => (value + 1) % verbs.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, [submitting, verbs.length]);

  async function onSubmit(values: SubscribeInput) {
    setSubmitting(true);
    captureEvent("web_checkout_submit", {
      plan,
      amountDue,
      isUpgrade,
    });
    try {
      const result = await plansApi.subscribe({
        plan: values.plan,
        receiptUrl: values.receiptUrl.trim(),
        note: values.note?.trim() || undefined,
      });
      setPendingReview(result.status === "pending");
      setVerified(true);
      captureEvent("web_checkout_verified", {
        plan: result.plan,
        status: result.status,
        amountDue,
        isUpgrade,
      });
      await queryClient.invalidateQueries({ queryKey: qk.plan });
      if (result.status === "active") {
        window.setTimeout(() => router.push("/dashboard"), 1100);
      }
    } catch (e) {
      captureEvent("web_checkout_failure", {
        plan,
        amountDue,
        isUpgrade,
      });
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  if (verified) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${pendingReview ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
              {pendingReview ? <Clock3 className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-ink">
                {pendingReview ? "Payment saved for review" : "Payment verified"}
              </h2>
              <p className="text-sm text-muted">
                {pendingReview
                  ? "Telebirr is temporarily limiting receipt checks. Your payment is saved; do not pay again. We will review it shortly."
                  : `Your ${planInfo.label} plan is active. Taking you back to your dashboard.`}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={pendingReview ? "/plans" : "/dashboard"}>
                {pendingReview ? "View payment status" : "Go to dashboard"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Secure checkout"
        subtitle={`Subscribe to ${planInfo.label}`}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/plans">
              <ArrowLeft className="h-4 w-4" /> Plans
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{planInfo.label} plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <div>
              <span className="text-sm text-muted">Total due</span>
              {isUpgrade ? (
                <p className="mt-0.5 text-xs font-medium text-brand">
                  Pro to Pro Plus upgrade price
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <span className="font-accent text-2xl font-black text-ink">
                {formatMoney(amountDue)}
              </span>
              {isUpgrade ? (
                <p className="text-xs text-muted line-through">
                  Full price {formatMoney(planInfo.price)}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-line p-4">
            <p className="text-sm font-semibold text-ink">Payment accounts</p>
            <div className="grid gap-3">
              {site.paymentAccounts.map((account) => {
                const Icon = account.method === "Telebirr" ? Smartphone : Banknote;
                return (
                  <div
                    key={account.method}
                    className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3"
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-ink">
                        {account.method}
                      </p>
                      <p className="break-all text-sm text-muted">
                        Account:{" "}
                        <span className="font-semibold text-ink">
                          {account.account}
                        </span>
                      </p>
                      <p className="text-sm text-muted">
                        Name:{" "}
                        <span className="font-semibold text-ink">
                          {account.name}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4 shrink-0 text-brand" />
              Questions? Message us on Telegram at {site.supportTelegram}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-brand/20">
        <div className="border-b border-brand/15 bg-brand-50 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm shadow-brand/10">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-ink">
                Live Odit verification
              </p>
              <p className="mt-1 text-sm leading-6 text-muted">
                We verify the receipt with the provider, match the Prime account,
                confirm the amount, and block reused receipt references.
              </p>
            </div>
          </div>
        </div>
        <CardContent className="pt-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="receiptUrl">Receipt link or Telebirr reference</Label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
                <Input
                  id="receiptUrl"
                  className="h-12 pl-10"
                  placeholder="https://transactioninfo.ethiotelecom.et/receipt/... or ABCD1234EF"
                  autoComplete="off"
                  {...form.register("receiptUrl")}
                />
              </div>
              {form.formState.errors.receiptUrl ? (
                <p className="text-xs font-medium text-red-600">
                  {form.formState.errors.receiptUrl.message}
                </p>
              ) : (
                <p className="text-xs text-muted">
                  Use the receipt URL from your bank or SMS. Telebirr references
                  can be pasted directly.
                </p>
              )}
            </div>

            <div className="grid gap-2 rounded-xl bg-surface p-4 text-sm text-muted sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Provider check
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Duplicate lock
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Instant unlock
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Example: paid from another phone"
                {...form.register("note")}
              />
            </div>

            {submitting ? (
              <div className="flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-50 px-4 py-3">
                <Spinner />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    We are {verbs[verbIndex]} your receipt live
                  </p>
                  <p className="text-xs text-muted">
                    Secure checks prevent fake, incomplete, or already-used
                    receipts from unlocking a plan.
                  </p>
                </div>
              </div>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !receiptReady}
            >
              {submitting ? <Spinner /> : <Flashlight className="h-4 w-4" />}
              Verify & activate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <CheckoutInner />
    </Suspense>
  );
}
