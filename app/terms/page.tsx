import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Terms of Service | Prime UAT",
  description: "Prime UAT terms for using the mobile app, web app, courses, practice, payments, and AI features.",
};

const lastUpdated = "July 12, 2026";

const sections = [
  {
    title: "1. Using Prime UAT",
    body: "Prime UAT provides exam preparation content, practice questions, courses, analytics, mock exams, and AI study tools. You are responsible for keeping your login details secure and for using the service lawfully.",
  },
  {
    title: "2. Accounts and verification",
    body: "You may need a verified phone number to use the app. Information you provide must be accurate. We may suspend access when an account is used for abuse, fraud, unauthorized sharing, or attempts to bypass access controls.",
  },
  {
    title: "3. Subscriptions and payments",
    body: "Paid plans unlock specific Pro or Pro Plus features. Payment review may require receipt or transaction details. Access can be delayed, denied, or reversed if a receipt is invalid, reused, refunded, or disputed.",
  },
  {
    title: "4. Learning content",
    body: "Questions, explanations, courses, notes, designs, and app content belong to Prime UAT or its licensors. You may use them for personal study only. Copying, reselling, scraping, or redistributing content is not allowed.",
  },
  {
    title: "5. AI features",
    body: "AI responses are study aids and may be incomplete or incorrect. You should review answers critically and use official exam guidance where applicable. Do not submit sensitive personal information to AI chat tools.",
  },
  {
    title: "6. Device and fair-use limits",
    body: "Some paid accounts may be limited to approved devices to prevent account sharing. Heavy, automated, abusive, or disruptive use may be rate-limited or blocked.",
  },
  {
    title: "7. Availability",
    body: "We work to keep Prime UAT reliable, but the service may be unavailable during maintenance, outages, network problems, provider failures, or updates.",
  },
  {
    title: "8. Changes",
    body: "We may update these terms as the product changes. Continued use after an update means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <header className="border-b border-border/70 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Brand />
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
            <p className="mt-1 text-sm text-muted">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm leading-7 text-muted">
            These terms govern your use of Prime UAT mobile, web, backend services,
            paid plans, and learning features. If you do not agree, do not use the
            service.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-lg font-semibold text-ink">9. Privacy</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Our{" "}
              <Link href="/privacy-policy" className="font-semibold text-brand">
                Privacy Policy
              </Link>{" "}
              explains how we collect, use, and protect your information.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
