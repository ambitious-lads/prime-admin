"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Link2,
  LockKeyhole,
  Phone,
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
import {
  isPaymentMethodId,
  PaymentMethodSelector,
  type PaymentMethodId,
} from "@/components/student/payment-method-selector";

type PaidPlan = Exclude<PlanKey, "free">;

function isPaidPlan(value: string | null): value is PaidPlan {
  return value === "pro" || value === "pro_plus";
}

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const planParam = searchParams.get("plan");
  const methodParam = searchParams.get("method");
  const plan: PaidPlan = isPaidPlan(planParam) ? planParam : "pro";
  const planInfo = PLANS[plan];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>(
    isPaymentMethodId(methodParam) ? methodParam : "telebirr",
  );
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);
  const { data: myPlan } = useQuery({
    queryKey: qk.plan,
    queryFn: plansApi.me,
  });
  const upgrade = myPlan?.availableUpgrades?.find((item) => item.plan === plan);
  const amountDue = upgrade?.upgradePrice ?? planInfo.price;
  const isUpgrade = Boolean(upgrade && upgrade.upgradePrice < planInfo.price);

  const form = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { plan, receiptUrl: "" },
  });
  const receiptValue = useWatch({
    control: form.control,
    name: "receiptUrl",
  });
  const receiptReady = receiptValue.trim().length >= 4;

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
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-10 text-center">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${pendingReview ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
          {pendingReview ? <Clock3 className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            {pendingReview ? "Payment saved for review" : "Payment verified"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {pendingReview
              ? "Receipt verification is temporarily delayed. Your payment is saved; do not pay again."
              : `Your ${planInfo.label} plan is active. Taking you back to your dashboard.`}
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href={pendingReview ? "/plans" : "/dashboard"}>
            {pendingReview ? "View payment status" : "Go to dashboard"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Complete your payment"
        subtitle={`${planInfo.label} · One-time payment`}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/plans">
              <ArrowLeft className="h-4 w-4" /> Plans
            </Link>
          </Button>
        }
      />

      <section className="flex items-center justify-between border-b border-line pb-6">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            {planInfo.label}
          </p>
          <p className="mt-1 text-sm text-muted">
            {isUpgrade ? "Pro to Pro Plus upgrade" : "Yours until exam day"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-accent text-2xl font-black text-brand">
            {formatMoney(amountDue)}
          </p>
          {isUpgrade ? (
            <p className="text-xs text-muted line-through">
              {formatMoney(planInfo.price)}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-bold text-ink">Choose where to pay</h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Pay {formatMoney(amountDue)} or more to the selected account.
          </p>
        </div>
        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          compact
        />
      </section>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="receiptUrl">Receipt link or Telebirr reference</Label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
            <Input
              id="receiptUrl"
              className="h-12 pl-10"
              placeholder="Paste your receipt link or reference"
              autoComplete="off"
              {...form.register("receiptUrl")}
            />
          </div>
          {form.formState.errors.receiptUrl ? (
            <p className="text-xs font-medium text-red-600">
              {form.formState.errors.receiptUrl.message}
            </p>
          ) : (
            <p className="text-xs leading-5 text-muted">
              Paste the full receipt URL from Telebirr, CBE, Zemen, Bank of
              Abyssinia, or Awash. A Telebirr reference can also be entered
              directly, including when you paid from another supported bank.
            </p>
          )}
        </div>

        {submitting ? (
          <div className="flex items-center gap-3 border-y border-brand/15 bg-brand-50 px-3 py-3">
            <Spinner />
            <p className="text-sm font-medium text-ink">
              Verifying your receipt and activating your plan...
            </p>
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || !receiptReady}
        >
          {submitting ? <Spinner /> : <LockKeyhole className="h-4 w-4" />}
          Verify payment
        </Button>

        <p className="text-center text-xs text-muted">
          One-time payment. No recurring charges.
        </p>
      </form>

      <Link
        href={site.supportTelegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline"
      >
        <Phone className="h-4 w-4" />
        Need help? Message {site.supportTelegram}
      </Link>
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
