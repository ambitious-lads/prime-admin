"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { site } from "@/config/site";
import { PLANS } from "@/lib/utils/plans";
import { formatMoney } from "@/lib/utils/format";
import { subscribeSchema, type SubscribeInput } from "@/lib/validation/plans";
import { toastApiError } from "@/hooks/use-api-error";
import { ApiError } from "@/lib/api/client";
import type { PlanKey } from "@/lib/api/types";
import { PageHeader } from "@/components/shared/page-header";
import { Dropzone } from "@/components/shared/dropzone";
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
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const planParam = searchParams.get("plan");
  const plan: PaidPlan = isPaidPlan(planParam) ? planParam : "pro";
  const planInfo = PLANS[plan];

  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pendingBlocked, setPendingBlocked] = useState(false);

  const me = useQuery({
    queryKey: qk.plan,
    queryFn: plansApi.me,
    refetchInterval: submitted ? 8000 : false,
  });

  const status = me.data?.latestPayment?.status;

  const form = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { plan, transactionRef: "", note: "" },
  });

  async function onSubmit(values: SubscribeInput) {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("plan", values.plan);
      if (values.transactionRef) fd.append("transactionRef", values.transactionRef);
      if (values.note) fd.append("note", values.note);
      if (file) fd.append("proof", file);
      await plansApi.subscribe(fd);
      setSubmitted(true);
      await queryClient.invalidateQueries({ queryKey: qk.plan });
    } catch (e) {
      if (e instanceof ApiError && (e.status === 409 || e.status === 400)) {
        setPendingBlocked(true);
      }
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  const showPendingBanner = pendingBlocked || status === "pending";

  if (submitted && status !== "rejected") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display text-ink">
                Submitted!
              </h2>
              <p className="text-sm text-muted">
                An admin will verify your payment soon. Your{" "}
                {planInfo.label} plan activates as soon as it&apos;s approved.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/plans">Back to plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Checkout"
        subtitle={`Subscribe to ${planInfo.label}`}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/plans">
              <ArrowLeft className="h-4 w-4" /> Plans
            </Link>
          </Button>
        }
      />

      {showPendingBanner ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          You already have a payment under review. Please wait for an admin to
          verify it before submitting another.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{planInfo.label} plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
            <span className="text-sm text-muted">Total due</span>
            <span className="font-accent text-2xl font-black text-ink">
              {formatMoney(planInfo.price)}
            </span>
          </div>
          <div className="space-y-3 rounded-xl border border-line p-4">
            <p className="text-sm font-semibold text-ink">Payment instructions</p>
            <p className="flex items-start gap-2 text-sm text-muted">
              <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {site.paymentAccount}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Phone className="h-4 w-4 shrink-0 text-brand" />
              Questions? Call support at {site.supportPhone}
            </p>
            <p className="text-xs text-muted">
              Send the exact amount, then upload your payment screenshot below.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit payment proof</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Payment screenshot</Label>
              <Dropzone
                accept="image/*"
                maxSizeMb={5}
                onFile={setFile}
                label="Upload payment proof"
                hint="Screenshot of your transfer · up to 5MB"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionRef">Transaction reference (optional)</Label>
              <Input
                id="transactionRef"
                placeholder="e.g. FT2406221234"
                {...form.register("transactionRef")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Anything we should know about your payment"
                {...form.register("note")}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || showPendingBanner}
            >
              {submitting ? <Spinner /> : null}
              Submit for review
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
