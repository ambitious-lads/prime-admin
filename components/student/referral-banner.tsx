"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Gift, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/hooks/use-plan";
import { referralsStudentApi } from "@/lib/api/endpoints";
import { Card, CardContent } from "@/components/ui/card";

export function ReferralBanner({ onDismissed }: { onDismissed?: () => void }) {
  const { plan } = usePlan();
  const status = useQuery({ queryKey: ["referrals", "me"], queryFn: referralsStudentApi.me });
  const [copied, setCopied] = useState(false);

  if (plan !== "free") return null;
  const data = status.data;
  if (!data?.enabled) return null;

  function copyCode() {
    if (!data?.code) return;
    void navigator.clipboard.writeText(data.code);
    toast.success("Referral code copied");
  }

  function copyLink() {
    if (!data?.shareUrl) return;
    void navigator.clipboard.writeText(data.shareUrl);
    setCopied(true);
    toast.success("Invite link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
            <Gift className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-ink">Invite friends, get rewarded</p>
            <p className="mt-0.5 text-sm text-muted">
              Share your code and earn {data.rewardAmount} birr per paid referral.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-lg border border-line bg-white px-3 py-1 font-accent text-base font-bold tracking-wide text-ink">
                {data.code}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-lg border border-line bg-white p-1.5 text-muted transition hover:text-brand"
                aria-label="Copy referral code"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissed}
            aria-label="Dismiss"
            className="rounded p-1 text-muted transition hover:bg-surface hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
