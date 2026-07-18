"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Download, ExternalLink, Globe2 } from "lucide-react";
import { savePendingReferralCode } from "@/lib/referrals/attribution";

const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.primely.app";

export default function ReferralRedirectPage() {
  const params = useParams<{ code: string }>();
  const code = useMemo(
    () => String(params.code || "").toUpperCase().replace(/[^A-Z0-9]/g, ""),
    [params.code],
  );
  const appUrl = `primely://register?referralCode=${encodeURIComponent(code)}`;

  useEffect(() => {
    if (!code) return;
    savePendingReferralCode(code);

    const mobileBrowser = window.matchMedia("(max-width: 768px)").matches;
    if (!mobileBrowser) return;

    const openTimer = window.setTimeout(() => window.location.assign(appUrl), 250);
    return () => window.clearTimeout(openTimer);
  }, [appUrl, code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-md text-center">
        <img src="/images/logo.png" alt="Prime UAT" className="mx-auto h-20 w-20 rounded-2xl" />
        <h1 className="mt-6 font-display text-2xl font-bold text-ink">Open Prime UAT</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your invite is ready. Use referral code <strong className="text-ink">{code}</strong> in the app or continue securely on the web.
        </p>
        <div className="mt-7 grid gap-3">
          <a href={appUrl} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-bold text-white">
            <ExternalLink className="h-4 w-4" /> Open app
          </a>
          <a href={`/register?referralCode=${encodeURIComponent(code)}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 text-sm font-bold text-ink">
            <Globe2 className="h-4 w-4" /> Continue on web
          </a>
          <a href={PLAY_STORE_URL} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 text-sm font-bold text-ink">
            <Download className="h-4 w-4" /> Get it on Google Play
          </a>
        </div>
      </section>
    </main>
  );
}
