"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/endpoints";
import { useAuth } from "@/hooks/use-auth";
import { toastApiError } from "@/hooks/use-api-error";
import { DeviceConflictError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/loading";
import { cn } from "@/lib/utils/cn";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const { setSession } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const code = digits.join("");

  function setDigit(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function verify() {
    if (code.length !== OTP_LENGTH) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    setSubmitting(true);
    try {
      const session = await authApi.verifyOtp({ phone, otpCode: code });
      setSession(session);
      router.push(session.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) {
      if (e instanceof DeviceConflictError) {
        router.push("/device?conflict=1");
        return;
      }
      toastApiError(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function resend() {
    try {
      await authApi.resendOtp({ phone });
      toast.success("A new code has been sent.");
      setCooldown(RESEND_SECONDS);
    } catch (e) {
      toastApiError(e);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink">
          Verify your phone
        </h1>
        <p className="text-sm text-muted">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-ink">{phone || "your phone"}</span>.
        </p>
      </div>

      <div className="flex justify-between gap-2" onPaste={onPaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "h-14 w-full rounded-xl border border-line bg-white text-center text-xl font-bold text-ink shadow-sm transition-colors focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20",
            )}
          />
        ))}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={verify}
        disabled={submitting || code.length !== OTP_LENGTH}
      >
        {submitting ? <Spinner /> : null} Verify & continue
      </Button>

      <div className="text-center text-sm text-muted">
        {cooldown > 0 ? (
          <span>Resend code in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="font-semibold text-brand hover:underline"
          >
            Resend code
          </button>
        )}
      </div>

      <p className="text-center text-sm text-muted">
        Wrong number?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Go back
        </Link>
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto" />}>
      <VerifyForm />
    </Suspense>
  );
}
