import Image from "next/image";
import Link from "next/link";
import DownloadModal from "./DownloadModal";
import { getPublicCommunity } from "@/lib/public-community";

export default async function Hero() {
  const community = await getPublicCommunity();
  return (
    <section className="relative overflow-hidden">
      {/* Decorative blur gradients */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-b from-brand/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-gradient-to-tr from-brand-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-20">
          {/* Left: headline, copy, CTAs, social proof */}
          <div className="flex min-w-0 flex-col justify-center space-y-7 animate-fade-in-up lg:col-span-6">
            <div className="space-y-5">
              <h1 className="max-w-[12ch] text-4xl font-black leading-[1.08] tracking-normal text-ink font-accent sm:max-w-none sm:text-5xl lg:text-7xl">
                Practice Smarter to Ace UAT
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed font-sans font-medium">
                Prime UAT is your all-in-one study companion — thousands of
                curated questions, realistic mock exams, premium courses, and
                an AI tutor. Study on the web or the mobile app, with the same
                account everywhere.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold text-white bg-brand rounded-2xl hover:bg-brand-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-pulse-glow hover:shadow-xl hover:shadow-brand/20 group"
              >
                Start Preparing Free
                <svg
                  className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <DownloadModal
                label="Download the app"
                className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold text-brand bg-white border-2 border-brand/80 rounded-2xl hover:bg-brand-50/50 hover:border-brand hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-line/40">
              <div className="flex -space-x-3">
                {community.recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer"
                  >
                    <Image
                      src={member.avatarUrl}
                      alt={member.displayName}
                      fill
                      unoptimized
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm sm:text-base text-muted font-medium">
                Join{" "}
                <span className="text-brand font-bold relative inline-block group">
                  {community.displayedCommunitySize.toLocaleString()}+
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-100 -z-10 group-hover:h-full transition-all duration-200" />
                </span>{" "}
                students preparing with Prime UAT
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div
            className="relative flex min-w-0 justify-center animate-fade-in-up lg:col-span-6 lg:justify-end"
            style={{ animationDelay: "150ms" }}
          >
            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 left-0 z-10 hidden h-[75%] w-[160%] select-none fill-brand lg:block"
            >
              <path d="M0,198 C60,160 120,170 180,150 C250,128 290,150 350,100 C400,60 450,72 500,14 L500,200 L0,200 Z" />
            </svg>

            <div className="pointer-events-none relative h-[390px] w-full max-w-[430px] select-none sm:h-[500px] sm:max-w-[560px] lg:h-auto lg:max-w-none lg:translate-x-12 lg:scale-125 lg:origin-right lg:aspect-square">
              <Image
                src="/images/hero.png"
                alt="Student smart preparation illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="pointer-events-none select-none object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
