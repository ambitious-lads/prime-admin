"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Expand, ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type IntegrityReason =
  | "copy"
  | "print"
  | "tab"
  | "blur"
  | "fullscreen";

const reasonText: Record<IntegrityReason, string> = {
  copy: "Copying or cutting exam content is not allowed.",
  print: "Printing or saving the exam as a document is not allowed.",
  tab: "Leaving or hiding the exam tab is not allowed.",
  blur: "The exam window lost focus.",
  fullscreen: "Fullscreen exam mode was exited.",
};

interface ExamIntegrityGuardProps {
  ready: boolean;
  submitting: boolean;
  strikeCount: number;
  threshold?: number;
  onViolation: (reason: IntegrityReason) => void;
  onAccepted: () => void;
}

export function ExamIntegrityGuard({
  ready,
  submitting,
  strikeCount,
  threshold = 3,
  onViolation,
  onAccepted,
}: ExamIntegrityGuardProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [warningReason, setWarningReason] = useState<IntegrityReason | null>(null);
  const lastEventRef = useRef<{ key: string; at: number }>({ key: "", at: 0 });
  const fullscreenSessionRef = useRef(false);
  const armedRef = useRef(false);

  const record = useCallback(
    (reason: IntegrityReason, group?: "attention" | "copy" | "print" | "fullscreen") => {
      if (!armedRef.current || submitting) return;
      const eventGroup = group ?? (reason === "tab" || reason === "blur" ? "attention" : reason);
      const now = Date.now();
      const last = lastEventRef.current;
      if (last.key === eventGroup && now - last.at < 1_500) return;
      lastEventRef.current = { key: eventGroup, at: now };
      setWarningReason(reason);
      onViolation(reason);
    },
    [onViolation, submitting],
  );

  const enterSecureMode = useCallback(async () => {
    setAcknowledged(true);
    onAccepted();
    try {
      if (document.fullscreenEnabled && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        fullscreenSessionRef.current = true;
        setFullscreenActive(true);
      }
    } catch {
      // Fullscreen can be unavailable or denied; the other controls still apply.
    } finally {
      window.setTimeout(() => {
        armedRef.current = true;
      }, 500);
    }
  }, [onAccepted]);

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      fullscreenSessionRef.current = true;
      setFullscreenActive(true);
    } catch {
      // The browser may deny fullscreen outside a supported desktop context.
    }
  }, []);

  useEffect(() => {
    if (!ready || !acknowledged) return;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") record("tab", "attention");
    };
    const onBlur = () => record("blur", "attention");
    const onCopy = (event: ClipboardEvent) => {
      event.preventDefault();
      record("copy", "copy");
    };
    const onCut = (event: ClipboardEvent) => {
      event.preventDefault();
      record("copy", "copy");
    };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onBeforePrint = () => record("print", "print");
    const onFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setFullscreenActive(active);
      if (!active && fullscreenSessionRef.current) {
        fullscreenSessionRef.current = false;
        record("fullscreen", "fullscreen");
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["c", "x", "a", "u", "s", "p"].includes(key)) {
        event.preventDefault();
        if (key === "c" || key === "x") record("copy", "copy");
        if (key === "p") record("print", "print");
      }
      if (event.key === "PrintScreen") {
        event.preventDefault();
        record("copy", "copy");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("beforeprint", onBeforePrint);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      armedRef.current = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("beforeprint", onBeforePrint);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [acknowledged, ready, record]);

  const remaining = Math.max(0, threshold - strikeCount);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <ShieldCheck className="h-4 w-4 text-brand" />
          Secure exam mode
          {acknowledged && !fullscreenActive && document.fullscreenEnabled ? (
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={requestFullscreen}>
              <Expand className="h-3.5 w-3.5" />
              Fullscreen
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className={strikeCount ? "text-amber-700" : "text-muted"}>
            Warnings {strikeCount}/{threshold}
          </span>
        </div>
      </div>

      <AlertDialog open={ready && !acknowledged}>
        <AlertDialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Secure exam rules</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm leading-6 text-muted">
                <p>During this attempt, copying, printing, switching tabs, leaving fullscreen, or moving focus away from the exam is monitored.</p>
                <p className="font-semibold text-ink">You receive two warnings. The third recorded violation automatically submits your exam.</p>
                <p>Browser and operating-system limitations mean screenshots cannot be fully prevented.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => void enterSecureMode()}>
              Enter secure exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(warningReason) && strikeCount < threshold} onOpenChange={(open) => !open && setWarningReason(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Integrity warning {strikeCount} of {threshold}</AlertDialogTitle>
            <AlertDialogDescription>
              {warningReason ? reasonText[warningReason] : ""} {remaining} warning{remaining === 1 ? "" : "s"} remaining before automatic submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setWarningReason(null)}>Return to exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
