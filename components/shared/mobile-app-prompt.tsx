"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, ExternalLink, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "prime.mobile-app-prompt-dismissed-at";
const DISMISS_DAYS = 14;
const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.primely.app";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "";
const APP_URL = "primely://";

const publicRoutes = [
  "/",
  "/uat-guide",
  "/cutoff-points",
  "/tuition",
  "/about",
  "/pricing",
];

export function MobileAppPrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (!publicRoutes.includes(pathname)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const mobileBrowser =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!mobileBrowser) return;

    const dismissedAt = Number(window.localStorage.getItem(DISMISSED_KEY) || 0);
    const dismissWindow = DISMISS_DAYS * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - dismissedAt < dismissWindow) return;

    setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    const timer = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    }
  }

  function openApp() {
    const startedAt = Date.now();
    window.location.assign(APP_URL);
    window.setTimeout(() => {
      if (document.hidden || Date.now() - startedAt < 1000) return;
      const storeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;
      if (storeUrl) window.location.assign(storeUrl);
    }, 1200);
  }

  const storeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white">
            <Smartphone className="h-5 w-5" />
          </span>
          <DialogTitle>Study faster in the Prime UAT app</DialogTitle>
          <DialogDescription>
            Open practice, mock exams, saved work, and courses in the mobile app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Button onClick={openApp}>
            <ExternalLink /> Open app
          </Button>
          {storeUrl ? (
            <Button variant="outline" asChild>
              <a href={storeUrl}>
                <Download /> Install app
              </a>
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => changeOpen(false)}>
            Continue on website
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
