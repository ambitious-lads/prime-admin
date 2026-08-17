"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold text-ink">
          Password reset temporarily unavailable
        </h1>
        <p className="text-sm text-muted">
          Password reset is temporarily unavailable while we fix an issue with
          SMS verification. Please try again later, or contact support for help
          recovering your account.
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
      >
        Back to sign in
      </Link>
    </div>
  );
}