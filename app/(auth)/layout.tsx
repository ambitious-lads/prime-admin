import Link from "next/link";
import { GraduationCap, Sparkles, Target } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { site } from "@/config/site";
import { RequireGuest } from "@/components/shared/route-guards";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireGuest>
    <div className="grid min-h-screen w-full bg-surface lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Brand href="/" />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="mx-auto w-full max-w-md text-sm text-muted">
          <p>
            Need help?{" "}
            <Link
              href={site.supportTelegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              Message {site.supportTelegram}
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand via-brand-600 to-brand-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-2 text-white/90">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold">Prime UAT</span>
        </div>

        <div className="relative max-w-md text-white">
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight">
            Ace your exams. Study smarter.
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Real exam simulations, focused practice, and AI tutoring built for
            the Ethiopian University Aptitude Test.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Exam-true practice</p>
                <p className="text-sm text-white/75">
                  Timed mocks that mirror the real test.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Learn from your gaps</p>
                <p className="text-sm text-white/75">
                  Analytics that turn mistakes into mastery.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Prime UAT. All rights reserved.
        </div>
      </div>
    </div>
    </RequireGuest>
  );
}
