"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ExternalLink, Smartphone, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SESSION_PROMPT_KEY = "prime.mobile-app-prompt-shown";
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || "https://play.google.com/store/apps/details?id=com.primely.app";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "";
const APP_URL = "primely://";

export function MobileAppPrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const mobileBrowser = window.matchMedia("(max-width: 768px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!mobileBrowser) return;

    setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    setVisible(true);
    const alreadyShown = window.sessionStorage.getItem(SESSION_PROMPT_KEY);
    const timer = window.setTimeout(() => {
      if (!alreadyShown) {
        setOpen(true);
        window.sessionStorage.setItem(SESSION_PROMPT_KEY, "1");
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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
  const inStudentApp = /^\/(dashboard|practice|exams|courses|analytics|saved|notes|notifications|plans|profile|settings|device)(\/|$)/.test(pathname);

  return <>
    {visible && !open ? <aside className={`mobile-install-nudge fixed inset-x-3 z-50 rounded-2xl border border-[#DCE4FF] bg-white p-3 shadow-[0_12px_36px_rgba(15,23,42,0.18)] lg:hidden ${inStudentApp ? "bottom-[76px]" : "bottom-3"}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D5BFF] text-white"><Smartphone className="h-5 w-5" /></span>
        <button type="button" onClick={openApp} className="min-w-0 flex-1 text-left"><p className="text-sm font-extrabold text-[#1A1A1A]">Get the Prime UAT app</p><p className="truncate text-xs text-[#6B7280]">Faster, focused mobile study</p></button>
        <Button size="sm" onClick={storeUrl ? () => window.location.assign(storeUrl) : openApp} className="h-9 rounded-xl px-3">Install</Button>
        <button type="button" onClick={() => setVisible(false)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B7280]" aria-label="Hide app prompt"><X className="h-4 w-4" /></button>
      </div>
    </aside> : null}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D5BFF] text-white shadow-[0_8px_22px_rgba(45,91,255,0.28)]"><Smartphone className="h-6 w-6" /></span>
          <DialogTitle>Prime UAT works best in the app</DialogTitle>
          <DialogDescription>Open your courses, practice sessions, mock exams, and progress in the mobile app.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Button onClick={openApp} className="h-12 rounded-xl"><ExternalLink /> Open app</Button>
          {storeUrl ? <Button variant="outline" className="h-12 rounded-xl" asChild><a href={storeUrl}>Install Prime UAT</a></Button> : null}
          <Button variant="ghost" onClick={() => setOpen(false)}>Continue on mobile web</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
