"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validation/auth";
import { authApi } from "@/lib/api/endpoints";
import { toastApiError } from "@/hooks/use-api-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/shared/loading";
import { isSafaricomEthiopiaPhone } from "@/lib/auth/phone-network";
import { EthioTelecomRequiredDialog } from "@/components/auth/ethio-telecom-required-dialog";

const RESEND_SECONDS = 60;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [ethioTelecomDialogOpen, setEthioTelecomDialogOpen] = useState(false);

  const phoneForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phone: "" },
  });
  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otpCode: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function sendCode(values: ForgotPasswordInput) {
    if (isSafaricomEthiopiaPhone(values.phone)) {
      setEthioTelecomDialogOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      await authApi.forgotPassword({ phone: values.phone });
      setPhone(values.phone);
      setCodeSent(true);
      setCooldown(RESEND_SECONDS);
      toast.success("Reset code sent to your phone.");
    } catch (error) {
      toastApiError(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function resendCode() {
    if (resending || cooldown > 0) return;
    setResending(true);
    try {
      await authApi.forgotPassword({ phone });
      setCooldown(RESEND_SECONDS);
      toast.success("A new reset code has been sent.");
    } catch (error) {
      toastApiError(error);
    } finally {
      setResending(false);
    }
  }

  async function resetPassword(values: ResetPasswordInput) {
    setSubmitting(true);
    try {
      await authApi.resetPassword({
        phone,
        otpCode: values.otpCode,
        newPassword: values.newPassword,
      });
      toast.success("Password reset successfully. Sign in with your new password.");
      router.replace("/login");
    } catch (error) {
      toastApiError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function changePhone() {
    setCodeSent(false);
    setCooldown(0);
    resetForm.reset();
  }

  return (
    <div className="space-y-7">
      <EthioTelecomRequiredDialog
        open={ethioTelecomDialogOpen}
        onOpenChange={setEthioTelecomDialogOpen}
      />

      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink">
          {codeSent ? "Set a new password" : "Forgot your password?"}
        </h1>
        <p className="text-sm text-muted">
          {codeSent ? (
            <>
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-ink">{phone}</span>.
            </>
          ) : (
            "Enter your account phone number to receive a reset code."
          )}
        </p>
      </div>

      {!codeSent ? (
        <form onSubmit={phoneForm.handleSubmit(sendCode)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              inputMode="tel"
              placeholder="09xxxxxxxx"
              autoComplete="tel"
              {...phoneForm.register("phone")}
            />
            {phoneForm.formState.errors.phone ? (
              <p className="text-xs text-red-600">
                {phoneForm.formState.errors.phone.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? <Spinner /> : null} Send reset code
          </Button>
        </form>
      ) : (
        <form onSubmit={resetForm.handleSubmit(resetPassword)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otpCode">Reset code</Label>
            <Input
              id="otpCode"
              inputMode="numeric"
              placeholder="6-digit code"
              autoComplete="one-time-code"
              maxLength={6}
              className="text-center text-lg font-bold tracking-[0.3em]"
              {...resetForm.register("otpCode", {
                onChange: (event) => {
                  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
                },
              })}
            />
            {resetForm.formState.errors.otpCode ? (
              <p className="text-xs text-red-600">
                {resetForm.formState.errors.otpCode.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              {...resetForm.register("newPassword")}
            />
            {resetForm.formState.errors.newPassword ? (
              <p className="text-xs text-red-600">
                {resetForm.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              {...resetForm.register("confirmPassword")}
            />
            {resetForm.formState.errors.confirmPassword ? (
              <p className="text-xs text-red-600">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? <Spinner /> : null} Reset password
          </Button>

          <div className="flex items-center justify-between gap-3 text-sm">
            <button
              type="button"
              onClick={changePhone}
              className="font-semibold text-brand hover:underline"
            >
              Change phone
            </button>
            {cooldown > 0 ? (
              <span className="text-muted">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={resendCode}
                disabled={resending}
                className="font-semibold text-brand hover:underline disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>
        </form>
      )}

      <p className="text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}