"use client";

import { useState, type ReactNode } from "react";
import { ExternalLink, QrCode } from "lucide-react";
import { DeviceQr } from "@/components/shared/device-qr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ANDROID_DOWNLOAD_URL } from "@/lib/mobile-release";

export default function DownloadModal({
  className = "",
  label = "Download the app",
}: {
  className?: string;
  label?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  function handleInstall() {
    const mobileDevice =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (mobileDevice) {
      window.location.assign(ANDROID_DOWNLOAD_URL);
      return;
    }

    setOpen(true);
  }

  return (
    <>
      <button type="button" onClick={handleInstall} className={className}>
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl text-center">
          <DialogHeader className="items-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <QrCode className="h-5 w-5" />
            </span>
            <DialogTitle className="text-xl">Get Prime UAT</DialogTitle>
            <DialogDescription>
              Scan with your phone or open the official Google Play listing.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-auto overflow-hidden rounded-xl bg-white p-2">
            <DeviceQr payload={ANDROID_DOWNLOAD_URL} />
          </div>
          <a
            href={ANDROID_DOWNLOAD_URL}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-600"
          >
            <ExternalLink className="h-4 w-4" />
            Open Google Play
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
}
