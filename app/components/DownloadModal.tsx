"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.primely.app";

function GooglePlayIcon() {
  return (
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.6 2.6 13.1 12 3.6 21.4c-.36-.2-.6-.58-.6-1.04V3.64c0-.46.24-.84.6-1.04z"
        fill="#34A853"
      />
      <path
        d="M16.7 8.4 13.1 12 3.6 2.6c.34-.2.78-.22 1.16-.01L16.7 8.4z"
        fill="#EA4335"
      />
      <path
        d="M16.7 15.6 4.76 21.42c-.38.2-.82.18-1.16-.02L13.1 12l3.6 3.6z"
        fill="#FBBC04"
      />
      <path
        d="m16.7 8.4 4.06 2.23c.78.43.78 1.45 0 1.88L16.7 15.6 13.1 12l3.6-3.6z"
        fill="#4285F4"
      />
    </svg>
  );
}

export default function DownloadModal({
  className = "",
  label = "Download the app",
}: {
  className?: string;
  label?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    if (!open || qrSrc) return;
    QRCode.toDataURL(PLAY_STORE_URL, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 256,
    })
      .then(setQrSrc)
      .catch(() => setQrSrc(""));
  }, [open, qrSrc]);

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
              Scan to download
            </h2>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
              Open the Play Store listing on your phone and install Prime UAT.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            X
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-surface p-4">
          {qrSrc ? (
            <Image
              src={qrSrc}
              alt="QR code for the Prime UAT Google Play listing"
              width={224}
              height={224}
              unoptimized
              className="mx-auto h-48 w-48 rounded-lg bg-white p-2 sm:h-56 sm:w-56"
            />
          ) : (
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-white text-sm font-medium text-muted sm:h-56 sm:w-56">
              Loading QR...
            </div>
          )}
        </div>

        <Link
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-ink px-5 py-3 text-white transition-colors hover:bg-ink/90"
        >
          <GooglePlayIcon />
          <span className="text-sm font-semibold">Open Google Play</span>
        </Link>
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
