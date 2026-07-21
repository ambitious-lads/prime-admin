import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Smartphone } from "lucide-react";
import DownloadModal from "./DownloadModal";
import { getPublicCommunity } from "@/lib/public-community";

export default async function Hero() {
  const community = await getPublicCommunity();
  return (
    <section className="relative overflow-hidden">
      <div className="bg-[#F8F9FE] px-4 pb-10 pt-8 md:hidden">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-[48px] font-black leading-[1.02] tracking-normal text-[#1A1A1A] font-accent sm:text-[54px]">
            Practice Smarter<br />to Ace UAT
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-7 text-[#6B7280]">
            Focused practice, realistic mock exams, premium courses, and clear analytics in one study app.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/register" className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2D5BFF] px-4 text-sm font-bold text-white shadow-[0_8px_22px_rgba(45,91,255,0.24)] active:scale-[0.98]">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <DownloadModal label={<><Smartphone className="h-4 w-4" /> Get the app</>} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-[#DCE4FF] bg-white px-4 text-sm font-bold text-[#2D5BFF] shadow-sm active:scale-[0.98]" />
          </div>

          <div className="relative mx-auto mt-10 h-[320px] w-full max-w-[390px] overflow-hidden" aria-label="Prime UAT mobile app preview">
            <div className="absolute inset-x-8 bottom-4 h-20 rounded-full bg-[#2D5BFF]/12 blur-2xl" />
            <div className="absolute left-0 top-9 z-0 w-[164px] -rotate-[7deg] opacity-95 drop-shadow-[0_18px_26px_rgba(15,23,42,0.18)] sm:left-3 sm:w-[176px]">
              <Image src="/images/mobile2.png" alt="Prime UAT practice screen" width={1024} height={1536} className="h-auto w-full object-contain" sizes="176px" />
            </div>
            <div className="absolute right-0 top-9 z-0 w-[164px] rotate-[7deg] opacity-95 drop-shadow-[0_18px_26px_rgba(15,23,42,0.18)] sm:right-3 sm:w-[176px]">
              <Image src="/images/mobile3.png" alt="Prime UAT progress screen" width={1024} height={1536} className="h-auto w-full object-contain" sizes="176px" />
            </div>
            <div className="absolute left-1/2 top-0 z-10 w-[202px] -translate-x-1/2 drop-shadow-[0_24px_38px_rgba(15,23,42,0.24)] sm:w-[214px]">
              <Image src="/images/mobile.png" alt="Prime UAT mobile app home screen" width={1024} height={1536} className="h-auto w-full object-contain" priority sizes="214px" />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 text-xs font-semibold text-[#6B7280]">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Join {community.displayedCommunitySize.toLocaleString()}+ students preparing now
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[45rem] w-[45rem] rounded-full bg-gradient-to-b from-brand/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-brand-50/40 to-transparent blur-3xl" />

        <div className="mx-auto flex w-full max-w-7xl items-center px-5 py-9 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid w-full grid-cols-1 items-center gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-20">
            <div className="flex min-w-0 flex-col justify-center space-y-6 text-center animate-fade-in-up sm:space-y-8 sm:text-left lg:col-span-6">
              <div className="space-y-4 sm:space-y-5">
                <h1 className="mx-auto text-center text-5xl font-black leading-[1.04] tracking-normal text-ink font-accent sm:mx-0 sm:max-w-none sm:text-left sm:text-5xl lg:text-7xl"><span className="block">Practice Smarter</span><span className="block">to Ace UAT</span></h1>
                <p className="hidden max-w-xl text-lg font-medium leading-relaxed text-muted sm:block">Prepare for Addis Ababa University UAT with focused practice, realistic mock exams, premium courses, and AI support, all in one account.</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <Link href="/register" className="group inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-base font-semibold text-white transition-all duration-200 animate-pulse-glow hover:scale-[1.02] hover:bg-brand-600 hover:shadow-xl hover:shadow-brand/20"><span>Start Preparing Free</span><svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></Link>
                <DownloadModal label="Download the app" className="inline-flex min-w-0 items-center justify-center rounded-2xl border-2 border-brand/80 bg-white px-7 py-4 text-base font-semibold text-brand shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-brand hover:bg-brand-50/50" />
              </div>
              <div className="hidden flex-col items-center gap-3 border-t border-line/40 pt-5 md:flex md:flex-row md:items-center md:gap-4 md:pt-6">
                <div className="flex -space-x-3">{community.recentMembers.map((member) => <div key={member.id} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md transition-all duration-200 hover:z-10 hover:scale-110"><Image src={member.avatarUrl} alt={member.displayName} fill unoptimized sizes="40px" className="object-cover" /></div>)}</div>
                <div className="text-center text-sm font-medium text-muted sm:text-left sm:text-base">Join <span className="relative inline-block font-bold text-brand">{community.displayedCommunitySize.toLocaleString()}+</span> students preparing with Prime UAT</div>
              </div>
            </div>
            <div className="relative hidden min-w-0 justify-center animate-fade-in-up lg:col-span-6 lg:flex lg:justify-end" style={{ animationDelay: "150ms" }}>
              <svg viewBox="0 0 500 200" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-0 z-10 hidden h-[75%] w-[160%] select-none fill-brand lg:block"><path d="M0,198 C60,160 120,170 180,150 C250,128 290,150 350,100 C400,60 450,72 500,14 L500,200 L0,200 Z" /></svg>
              <div className="pointer-events-none relative h-[300px] w-full max-w-[430px] translate-y-10 select-none overflow-hidden sm:h-[500px] sm:max-w-[560px] sm:translate-y-0 sm:overflow-visible lg:h-auto lg:max-w-none lg:translate-x-12 lg:scale-125 lg:origin-right lg:aspect-square"><Image src="/images/hero.png" alt="Student preparing for the Addis Ababa University UAT" fill priority sizes="(max-width: 1024px) 100vw, 1000px" className="pointer-events-none translate-y-12 scale-110 select-none object-contain object-bottom mix-blend-multiply sm:translate-y-0 sm:scale-100" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
