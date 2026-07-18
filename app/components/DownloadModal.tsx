"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, X } from "lucide-react";

export default function DownloadModal({
  className = "",
  label = "Download the app",
}: {
  className?: string;
  label?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const modal = open ? (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-dialog-title"
    >
      <button
        type="button"
        aria-label="Close download dialog"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
      />
      <div className="relative max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-ink/20 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand sm:text-sm">
              Prime UAT app
            </p>
            <h2
              id="download-dialog-title"
              className="mt-2 font-accent text-2xl font-black text-ink sm:text-3xl"
            >
              Coming soon in 2 days
            </h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
              The Prime UAT app launches on July 20, 2026.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-xl border border-brand/20 bg-brand-50 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="font-black text-ink">July 20, 2026</p>
            <p className="mt-1 text-sm font-medium text-muted">
              Available soon for mobile.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-bold text-white transition-colors hover:bg-brand-600"
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
        onClick={() => setOpen(true)}
        className={className}
      >
        {label}
      </button>

      {modal && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}