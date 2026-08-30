"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlarmClock, X } from "lucide-react";
import { usePlan } from "@/hooks/use-plan";
import { uatExamApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "prime:uat-countdown-dismissed-at";
const FREQUENCY_MS = 24 * 60 * 60 * 1000;

function getTimeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

function maybeShow(): boolean {
  if (typeof window === "undefined") return true;
  const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
  if (!Number.isFinite(stored) || stored <= 0) return true;
  return Date.now() - stored >= FREQUENCY_MS;
}

export function CountdownBanner() {
  const { plan } = usePlan();
  const deadlineQuery = useQuery({
    queryKey: qk.uatDeadline,
    queryFn: uatExamApi.deadline,
    staleTime: 60 * 1000,
  });
  const [now, setNow] = useState<number>(() => Date.now());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (plan !== "free") return null;
  if (dismissed || !maybeShow()) return null;
  const deadline = deadlineQuery.data?.deadline;
  if (!deadline || !deadlineQuery.data?.active) return null;

  const timeLeft = getTimeLeft(deadline);
  if (!timeLeft) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const cells = [
    { value: timeLeft.days, label: "days" },
    { value: timeLeft.hours, label: "hrs" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" },
  ];

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  return (
    <Card className="border-brand-100 bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <AlarmClock className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-white">
              {deadlineQuery.data?.label ?? "UAT Exam"} — prepare before time runs out
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {cells.map((cell, i) => (
                <div key={cell.label} className="flex items-center gap-1.5">
                  <div className="flex min-w-[52px] flex-col items-center rounded-lg bg-black/20 px-2 py-1">
                    <span className="font-accent text-lg font-bold tabular-nums leading-none text-white">
                      {pad(cell.value)}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                      {cell.label}
                    </span>
                  </div>
                  {i < cells.length - 1 && (
                    <span className="text-white/40">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              href="/plans"
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
            >
              Upgrade
            </Link>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="rounded p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
