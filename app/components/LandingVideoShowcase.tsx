"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingVideoShowcase() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand px-4 py-12 md:hidden">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center text-white">
            <h2 className="font-display text-3xl font-black leading-tight">
              See smarter UAT preparation in action
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border-[3px] border-white/90 bg-black shadow-[0_20px_48px_rgba(2,16,60,0.34)]">
            <video
              src="/Prime UAT intro.mp4"
              className="protected-content aspect-video w-full bg-black object-contain"
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              playsInline
              preload="metadata"
              onContextMenu={(event) => event.preventDefault()}
              onDragStart={(event) => event.preventDefault()}
            >
              Your browser does not support embedded video.
            </video>
          </div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-brand md:block">
        <div className="mx-auto grid min-h-[640px] max-w-7xl grid-cols-[0.7fr_1.3fr] items-center gap-24 px-8 py-20 lg:gap-36 lg:px-12 lg:py-24">
          <div className="relative z-10 text-white">
            <h2 className="max-w-sm font-display text-4xl font-black leading-[1.08] tracking-normal lg:text-5xl">
              Wondering how UAT prep works?
            </h2>
            <Link href="/uat-guide" className="group mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-brand shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-1 hover:bg-brand-50 hover:shadow-[0_18px_38px_rgba(15,23,42,0.26)] active:translate-y-0 active:scale-[0.98]">
              Read the AAU UAT guide <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative max-w-[620px]">
            <svg className="pointer-events-none absolute -left-44 top-1/2 z-20 hidden h-24 w-44 -translate-y-1/2 text-white lg:block" viewBox="0 0 176 96" fill="none" aria-hidden="true">
              <path d="M4 75C38 78 58 57 82 40C105 24 132 23 164 31" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" />
              <path d="M152 20L168 31L153 43" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute -inset-8 rounded-full bg-white/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[24px] border-[5px] border-white/85 bg-black shadow-[0_30px_70px_rgba(2,16,60,0.38)]">
              <video
                src="/Prime UAT intro.mp4"
                className="protected-content aspect-video w-full bg-black object-contain"
                controls
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                playsInline
                preload="metadata"
                onContextMenu={(event) => event.preventDefault()}
                onDragStart={(event) => event.preventDefault()}
              >
                Your browser does not support embedded video.
              </video>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}