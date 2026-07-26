"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalendarDays, X } from "lucide-react";
import { createPortal } from "react-dom";
import {
  ANDROID_DOWNLOAD_URL,
  fetchMobileRelease,
} from "@/lib/mobile-release";

type StoreInstallButtonProps = {
  platform: "android" | "ios";
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

const FALLBACK_EXPECTED_DATE = "2026-07-27T00:00:00.000Z";

function displayDate(value: string | null) {
  const date = new Date(value || FALLBACK_EXPECTED_DATE);
  if (Number.isNaN(date.getTime())) return "Coming soon";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function StoreInstallButton({
  platform,
  className = "",
  children,
  ariaLabel,
}: StoreInstallButtonProps) {
  const [open, setOpen] = useState(false);
  const [expectedAt, setExpectedAt] = useState<string | null>(
    platform === "android" ? FALLBACK_EXPECTED_DATE : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleClick() {
    if (loading) return;
    if (platform === "android") {
      window.location.assign(ANDROID_DOWNLOAD_URL);
      return;
    }

    setLoading(true);
    try {
      const config = await fetchMobileRelease();
      const release = config[platform];
      const installUrl =
        release.storeAvailable && release.storeUrl
          ? release.storeUrl
          : platform === "ios"
            ? release.downloadUrl
            : null;

      if (installUrl) {
        window.location.assign(installUrl);
        return;
      }
      setExpectedAt(release.storeExpectedAt);
    } catch {
      // The waiting modal remains usable when the release API is waking up.
    } finally {
      setLoading(false);
    }
    setOpen(true);
  }

  const isAndroid = platform === "android";
  const modal = open ? (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${platform}-store-dialog-title`}
    >
      <button
        type="button"
        aria-label="Close store dialog"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl shadow-ink/20 sm:p-6">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:bg-surface hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="pr-12 text-xs font-bold uppercase text-brand">
          {isAndroid ? "Google Play" : "Prime UAT for iPhone"}
        </p>
        <h2
          id={`${platform}-store-dialog-title`}
          className="mt-2 pr-12 font-accent text-2xl font-black text-ink"
        >
          {isAndroid ? "Approval is almost complete" : "iOS access is coming soon"}
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-muted">
          {isAndroid
            ? "The Android app is available directly while Google Play finishes its review."
            : "Public iPhone installation will use TestFlight or the App Store as soon as access is available."}
        </p>
        {expectedAt ? (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-50 p-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-brand" />
            <div>
              <p className="font-black text-ink">{displayDate(expectedAt)}</p>
              <p className="mt-1 text-xs font-medium text-muted">Expected availability</p>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {modal && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
