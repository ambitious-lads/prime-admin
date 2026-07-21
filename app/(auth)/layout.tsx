import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/shared/brand";
import { site } from "@/config/site";
import { RequireGuest } from "@/components/shared/route-guards";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireGuest>
    <div className="grid min-h-screen w-full bg-[#F8F9FE] lg:grid-cols-2 lg:bg-surface">
      <div className="flex min-h-screen flex-col px-4 pb-6 pt-5 sm:px-10 sm:py-10">
        <div className="mx-auto flex w-full max-w-md justify-center lg:justify-start">
          <Brand href="/" className="[&_img]:h-10 [&_img]:w-10 lg:[&_img]:h-8 lg:[&_img]:w-8" />
        </div>
        <div className="flex flex-1 items-center justify-center py-6 sm:py-10">
          <div className="auth-mobile-panel w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">{children}</div>
        </div>
        <div className="mx-auto w-full max-w-md text-center text-xs text-muted lg:text-left lg:text-sm">
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

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand via-brand-600 to-brand-600 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex w-full -translate-y-10 items-center justify-center">
          <Image
            src="/images/white_logo.png"
            alt="Prime UAT"
            width={500}
            height={200}
            className="h-auto w-full max-w-[500px] object-contain"
            priority
          />
        </div>

        <div className="relative z-10 -mt-2 -translate-y-10 max-w-md text-center text-white">
          <h2 className="font-display text-4xl font-black leading-tight tracking-tight">
            Ace your exams. Study smarter.
          </h2>
        </div>
      </div>
    </div>
    </RequireGuest>
  );
}
