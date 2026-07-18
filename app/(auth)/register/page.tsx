"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { authApi } from "@/lib/api/endpoints";
import { toastApiError } from "@/hooks/use-api-error";
import { captureEvent } from "@/lib/observability/posthog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/loading";
import { clearPendingReferralCode, getPendingReferralCode, normalizeReferralCode, savePendingReferralCode } from "@/lib/referrals/attribution";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", phone: "", password: "", referralCode: "" },
  });

  useEffect(() => {
    const linkedCode = normalizeReferralCode(
      searchParams.get("referralCode") ?? searchParams.get("ref"),
    );
    const referralCode = linkedCode
      ? savePendingReferralCode(linkedCode)
      : getPendingReferralCode();
    if (referralCode) {
      form.setValue("referralCode", referralCode, { shouldValidate: true });
    }
  }, [form, searchParams]);
  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    captureEvent("web_register_attempt");
    try {
      await authApi.register({ ...values, referralCode: normalizeReferralCode(values.referralCode) || undefined });
      clearPendingReferralCode();
      captureEvent("web_register_success");
      toast.success("Account created. Verify your phone to continue.");
      router.push(`/verify?phone=${encodeURIComponent(values.phone)}`);
    } catch (e) {
      captureEvent("web_register_failure");
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink">
          Create your account
        </h1>
        <p className="text-sm text-muted">
          Start practicing for the University Entrance Exam in minutes.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Abebe Kebede"
            autoComplete="name"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            inputMode="tel"
            placeholder="09xxxxxxxx"
            autoComplete="tel"
            {...form.register("phone")}
          />
          {form.formState.errors.phone ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="referralCode">Invite code <span className="font-normal text-muted">(optional)</span></Label>
          <Input
            id="referralCode"
            placeholder="Enter invite code"
            autoCapitalize="characters"
            autoComplete="off"
            {...form.register("referralCode", {
              onChange: (event) => {
                event.target.value = normalizeReferralCode(event.target.value);
              },
            })}
          />
          {form.formState.errors.referralCode ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.referralCode.message}
            </p>
          ) : null}
        </div>        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? <Spinner /> : null} Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto" />}>
      <RegisterForm />
    </Suspense>
  );
}
