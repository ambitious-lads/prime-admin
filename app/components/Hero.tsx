import Image from "next/image";
import Link from "next/link";
import DownloadModal from "./DownloadModal";
import { getPublicCommunity } from "@/lib/public-community";

export default async function Hero() {
  const community = await getPublicCommunity();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[45rem] w-[45rem] rounded-full bg-gradient-to-b from-brand/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-brand-50/40 to-transparent blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-9 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="flex min-w-0 flex-col justify-center space-y-6 text-center animate-fade-in-up sm:space-y-8 sm:text-left lg:col-span-6">
            <div className="space-y-4 sm:space-y-5">
              <h1 className="mx-auto text-center text-5xl font-black leading-[1.04] tracking-normal text-ink font-accent sm:mx-0 sm:max-w-none sm:text-left sm:text-5xl lg:text-7xl">
                <span className="block">Practice Smarter</span>
                <span className="block">to Ace UAT</span>
              </h1>
              <p className="mx-auto max-w-sm text-sm font-medium leading-6 text-muted sm:hidden">
                Prepare for the Addis Ababa University UAT with focused practice, mock exams, and guided learning.
              </p>
              <p className="hidden max-w-xl text-lg font-medium leading-relaxed text-muted sm:block">
                Prime UAT is your all-in-one study companion for the Addis Ababa University Undergraduate Admission Test — thousands of curated questions, realistic mock exams, premium courses, and an AI tutor. Study on the web or mobile app with the same account everywhere.
              </p>
            </div>

            <div className="grid grid-cols-2 items-stretch gap-2 sm:flex sm:flex-row sm:items-center sm:gap-4">
              <Link href="/register" className="group inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-brand px-3 py-3 text-sm font-semibold text-white transition-all duration-200 animate-pulse-glow hover:bg-brand-600 active:scale-[0.98] sm:gap-2 sm:rounded-2xl sm:px-7 sm:py-4 sm:text-base sm:hover:scale-[1.02] sm:hover:shadow-xl sm:hover:shadow-brand/20">
                <span className="sm:hidden">Start Free</span>
                <span className="hidden sm:inline">Start Preparing Free</span>
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <DownloadModal
                label={<><span className="sm:hidden">Get App</span><span className="hidden sm:inline">Download the app</span></>}
                className="inline-flex min-w-0 items-center justify-center rounded-xl border-2 border-brand/80 bg-white px-3 py-3 text-sm font-semibold text-brand shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand-50/50 active:scale-[0.98] sm:rounded-2xl sm:px-7 sm:py-4 sm:text-base sm:hover:scale-[1.02]"
              />
            </div>

            <div className="hidden flex-col items-center gap-3 border-t border-line/40 pt-5 md:flex md:flex-row md:items-center md:gap-4 md:pt-6">
              <div className="flex -space-x-3">
                {community.recentMembers.map((member) => (
                  <div key={member.id} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md transition-all duration-200 hover:z-10 hover:scale-110">
                    <Image src={member.avatarUrl} alt={member.displayName} fill unoptimized sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-center text-sm font-medium text-muted sm:text-left sm:text-base">
                Join <span className="relative inline-block font-bold text-brand">{community.displayedCommunitySize.toLocaleString()}+</span> students preparing with Prime UAT
              </div>
            </div>
          </div>

          <div className="relative hidden min-w-0 justify-center animate-fade-in-up lg:col-span-6 lg:flex lg:justify-end" style={{ animationDelay: "150ms" }}>
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-0 z-10 hidden h-[75%] w-[160%] select-none fill-brand lg:block"><path d="M0,198 C60,160 120,170 180,150 C250,128 290,150 350,100 C400,60 450,72 500,14 L500,200 L0,200 Z" /></svg>
            <div className="pointer-events-none relative h-[300px] w-full max-w-[430px] translate-y-10 select-none overflow-hidden sm:h-[500px] sm:max-w-[560px] sm:translate-y-0 sm:overflow-visible lg:h-auto lg:max-w-none lg:translate-x-12 lg:scale-125 lg:origin-right lg:aspect-square">
              <Image src="/images/hero.png" alt="Student preparing for the Addis Ababa University UAT" fill priority sizes="(max-width: 1024px) 100vw, 1000px" className="pointer-events-none translate-y-12 scale-110 select-none object-contain object-bottom mix-blend-multiply sm:translate-y-0 sm:scale-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
