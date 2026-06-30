import type { Metadata } from "next";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { site } from "@/config/site";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Delete Account | Prime UAT",
  description:
    "How to delete your Prime UAT account and request deletion of associated data.",
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Brand />
          <Button asChild variant="outline">
            <Link href="/privacy-policy">Privacy Policy</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            <Trash2 className="h-4 w-4" />
            Account deletion
          </span>
          <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Delete your Prime UAT account
          </h1>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            You can delete your Prime UAT account from the mobile app, from the
            web app after signing in, or by sending us a verified deletion
            request. This page is public so account deletion is available even
            if you cannot access the app.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Mobile app
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Open Prime UAT, go to Profile, Settings, Delete Account, then
              confirm the deletion prompt.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">Web app</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Sign in at prime-web, open Settings, and use Delete account in
              the Account section.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">
              Telegram request
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Message us with your registered phone number. We may verify account
              ownership before deleting data.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-line p-6">
          <h2 className="font-display text-xl font-bold text-ink">
            What gets deleted
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 text-sm leading-6 text-muted md:grid-cols-2">
            <li>Account login data and phone-linked profile data</li>
            <li>Learning progress, practice answers, scores, and streaks</li>
            <li>Saved exams, notes, course progress, and AI tutor history</li>
            <li>Device binding and app settings tied to the account</li>
          </ul>
          <p className="mt-5 text-sm leading-6 text-muted">
            We may retain limited records that are required for legal,
            accounting, tax, security, fraud-prevention, or dispute-resolution
            purposes, including receipt references used to prevent duplicate
            payment proof reuse. Verified deletion requests are normally
            processed within 30 days.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href={site.supportTelegramUrl} target="_blank" rel="noreferrer">
                Telegram deletion request
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in to delete</Link>
            </Button>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted">
          Contact:{" "}
          <a
            className="font-semibold text-brand"
            href={site.supportTelegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Telegram {site.supportTelegram}
          </a>
        </p>
      </section>
    </main>
  );
}
