"use client";

import Link from "next/link";
import { Brand } from "@/components/shared/brand";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <Brand href="/" />
      <h1 className="mt-10 font-display text-2xl font-bold text-ink">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
