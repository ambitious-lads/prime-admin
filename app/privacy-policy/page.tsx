import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy | Prime UAT",
  description:
    "Prime UAT privacy policy for account, learning, payment, device, analytics, and AI tutor data.",
};

const lastUpdated = "June 30, 2026";

const collectedData = [
  {
    title: "Account information",
    body: "Phone number, password, verification status, role, plan, account identifiers, and authentication tokens used to create, secure, and operate your account.",
  },
  {
    title: "Profile information",
    body: "Full name, school, town or region, academic stream, how you heard about Prime UAT, and optional avatar or profile image.",
  },
  {
    title: "Learning activity",
    body: "Practice answers, question attempts, mock exam attempts, scores, ranks, saved exams, progress, streaks, notes, course progress, and study-time activity.",
  },
  {
    title: "Payment and receipt data",
    body: "Paid-plan selections, receipt links or references, transaction references, payment status, review notes for historical payments, and automated receipt details.",
  },
  {
    title: "AI tutor content",
    body: "Messages, questions, and course context you submit to the AI tutor so it can generate explanations and study help.",
  },
  {
    title: "Device and diagnostic data",
    body: "Device identifier, device name, app or browser context, IP-derived request information, logs, and technical signals used for security, fraud prevention, support, and reliability.",
  },
  {
    title: "Referral information",
    body: "Referral codes, inviter and invited-account relationships, subscription qualification, reward status, and payout-request information when the referral program is enabled.",
  },
];

const purposes = [
  "Create, verify, authenticate, and secure your account.",
  "Provide practice sets, mock exams, courses, notes, progress tracking, streaks, analytics, and the AI tutor.",
  "Enforce subscription access, including Free, Pro, and Pro Plus plan limits.",
  "Check receipts, prevent duplicate receipt use, activate subscriptions, and handle support disputes.",
  "Detect abuse, fraud, unauthorized account access, device conflicts, and service misuse.",
  "Respond to support requests and send essential service messages.",
  "Operate referral attribution, reward qualification, and payout requests when the referral program is enabled.",
  "Maintain, debug, measure, and improve Prime UAT.",
  "Comply with legal, accounting, tax, safety, and policy obligations.",
];

const providers = [
  {
    name: "SMS provider",
    purpose: "Phone number verification and account recovery OTP delivery.",
    data: "Phone number and verification message content.",
  },
  {
    name: "Cloudinary or file storage",
    purpose: "Hosting profile images and uploaded learning files.",
    data: "Uploaded profile or learning files and related metadata.",
  },
  {
    name: "Odit Verify and receipt verification providers",
    purpose: "Verifying mobile-money or bank receipts and preventing duplicate receipts.",
    data: "Receipt link or reference, transaction reference, amount, receiver details, and provider response.",
  },
  {
    name: "Google Gemini or AI provider",
    purpose: "AI tutor responses and smart learning features.",
    data: "Tutor messages, relevant course context, and images only when needed for a selected AI feature.",
  },
  {
    name: "Hosting, database, and infrastructure providers",
    purpose: "Running the Prime UAT API, web app, database, storage, security, logs, and backups.",
    data: "Account, profile, learning, payment, device, and diagnostic data required to operate the service.",
  },
  {
    name: "Expo and app distribution tooling",
    purpose: "Mobile app delivery, updates, and diagnostics.",
    data: "App version, installation, device, and diagnostic data.",
  },
  {
    name: "PostHog and Sentry",
    purpose: "Product analytics, reliability monitoring, crash reporting, and troubleshooting.",
    data: "App events, account or device identifiers, app version, error details, and technical diagnostics configured by Prime UAT.",
  },
];

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-8">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Brand />
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand">
            <ShieldCheck className="h-4 w-4" />
            Prime UAT privacy notice
          </span>
          <div>
            <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm font-medium text-muted">
              Last updated: {lastUpdated}
            </p>
          </div>
          <p className="text-base leading-8 text-muted sm:text-lg">
            This Privacy Policy explains how Prime UAT collects, uses, shares,
            stores, and protects information when you use the Prime UAT mobile
            application, web application, API, and related services. Prime UAT is an
            educational service for students preparing for Addis Ababa University
            UAT.
          </p>
          <p className="text-base leading-8 text-muted sm:text-lg">
            By creating an account or using Prime UAT, you acknowledge the
            practices described in this policy. This page is the public privacy
            policy URL for Google Play and other app stores.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          <Section title="1. Information We Collect">
            <p>
              We collect information you provide directly, information created
              by your learning activity, and technical data needed to run and
              protect the service.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {collectedData.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <p>
              We may also collect support messages and optional information you
              choose to send us. Do not upload sensitive information unless it
              is needed for the feature you are using.
            </p>
          </Section>

          <Section title="2. App Permissions">
            <p>
              Prime UAT requests device permissions only when needed for a
              feature. Camera and photo access are used for optional profile
              images or learning files, not for new payment verification.
              Notifications may be used for reminders, study alerts, and
              account messages. Prime UAT does not currently request microphone
              access. You can
              control optional permissions in your device settings.
            </p>
          </Section>

          <Section title="3. How We Use Information">
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {purposes.map((item) => (
                <li key={item} className="rounded-xl bg-surface px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="4. Subscription Plans and Access">
            <p>
              Prime UAT uses plan information to decide which features you can
              access. Free includes 1 practice set and 1 course resource. Pro
              includes all practice sets and all mock exams. Pro Plus includes
              Pro features plus all courses, AI features, advanced analytics,
              and the UAT calculator.
            </p>
            <p>
              We keep subscription, payment status, and receipt verification
              records to activate plans, prevent duplicate receipt use, handle
              fraud checks, and support financial record-keeping.
            </p>
          </Section>

          <Section title="5. How We Share Information">
            <p>
              We do not sell your personal information. We share information
              only with service providers, legal/safety parties, or business
              systems needed to operate Prime UAT.
            </p>
            <div className="overflow-hidden rounded-2xl border border-line">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-surface text-ink">
                  <tr>
                    <th className="border-b border-line px-4 py-3 font-bold">
                      Provider
                    </th>
                    <th className="border-b border-line px-4 py-3 font-bold">
                      Purpose
                    </th>
                    <th className="border-b border-line px-4 py-3 font-bold">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider.name}>
                      <td className="border-b border-line px-4 py-3 font-semibold text-ink">
                        {provider.name}
                      </td>
                      <td className="border-b border-line px-4 py-3">
                        {provider.purpose}
                      </td>
                      <td className="border-b border-line px-4 py-3">
                        {provider.data}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              We may disclose information when required by law, to protect users
              or the service, to investigate misuse, or during a merger,
              acquisition, financing, or transfer of service assets.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We use HTTPS/TLS, access controls, hashed passwords, token-based
              authentication, limited admin access, and operational safeguards to
              protect data. No online service is perfectly secure, so we also
              monitor for misuse and encourage users to keep passwords private.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We keep account, profile, learning, and subscription information
              while your account is active and for as long as needed to provide
              the service. Payment and receipt records may be retained longer
              for accounting, tax, legal, chargeback, security, and
              fraud-prevention reasons. Backups and logs may persist for a
              limited period before deletion through normal rotation.
            </p>
          </Section>

          <Section id="delete" title="8. Account and Data Deletion">
            <p>
              You can delete your account in the mobile app from Profile,
              Settings, Delete Account. You can also delete your account on the
              web after signing in from Settings, Account, Delete account.
            </p>
            <p>
              If you cannot sign in, use the public deletion request page at{" "}
              <Link href="/delete-account" className="font-semibold text-brand">
                /delete-account
              </Link>{" "}
              or contact us on Telegram at{" "}
              <a
                className="font-semibold text-brand"
                href={site.supportTelegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                {site.supportTelegram}
              </a>{" "}
              with your registered phone number. We may need to verify account
              ownership before deleting data.
            </p>
            <p>
              After a verified deletion request, we delete or de-identify
              account, profile, learning, and support data unless retention is
              required for legal, accounting, security, fraud-prevention, or
              dispute-resolution purposes. We aim to complete verified deletion
              requests within 30 days.
            </p>
          </Section>

          <Section title="9. Your Choices and Rights">
            <p>
              You can update profile information, change notification settings,
              revoke optional device permissions, request access to your data,
              ask us to correct inaccurate data, or request deletion. Some
              features may not work if required data or permissions are removed.
            </p>
          </Section>

          <Section title="10. Children and Students">
            <p>
              Prime UAT is designed for exam preparation and is not directed to
              children under 13. If you believe a child under 13 provided
              personal information, contact us so we can investigate and delete
              the data where appropriate.
            </p>
          </Section>

          <Section title="11. International Processing">
            <p>
              Prime UAT may process data in Ethiopia and in other countries
              where our service providers operate. Data protection laws may
              differ by country, but we apply the safeguards described in this
              policy to the information we process.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy as Prime UAT changes or as legal
              and platform requirements change. We will update the date at the
              top of this page. Material changes may also be communicated in the
              app or through another reasonable notice.
            </p>
          </Section>

          <Section title="13. Contact Us">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="font-semibold text-ink">Prime UAT</p>
              <p>
                Telegram:{" "}
                <a
                  className="font-semibold text-brand"
                  href={site.supportTelegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.supportTelegram}
                </a>
              </p>
              <p>App package: com.primely.app</p>
            </div>
          </Section>
        </div>
      </article>
    </main>
  );
}
