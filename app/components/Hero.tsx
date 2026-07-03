import Image from "next/image";
import Link from "next/link";
import DownloadModal from "./DownloadModal";

const avatars = [
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    alt: "Student Sarah",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    alt: "Student Michael",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
    alt: "Student Emily",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    alt: "Student Daniel",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8 lg:col-span-6">
            <div className="space-y-5">
              <h1 className="font-accent text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                <span className="whitespace-nowrap">Practice smarter</span>
                <br />
                to Ace UAT
              </h1>

              <p className="max-w-xl font-sans text-base font-medium leading-relaxed text-muted sm:text-lg">
                Prime UAT is your all-in-one study companion: thousands of
                curated questions, realistic mock exams, premium courses, and
                an AI tutor. Study on the web or the mobile app, with the same
                account everywhere.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Start Preparing Free
                <svg
                  className="h-5 w-5"
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
                className="inline-flex items-center justify-center rounded-xl border border-brand px-6 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-brand-50"
              />
            </div>

            <div className="flex flex-col items-start gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-sm font-medium text-muted sm:text-base">
                Join{" "}
                <span className="font-bold text-brand">50,000+</span>{" "}
                students preparing with Prime UAT
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:col-span-6 lg:justify-end">
            <div className="relative aspect-square w-full max-w-[520px] select-none lg:max-w-[620px]">
              <Image
                src="/images/hero.png"
                alt="Student smart preparation illustration"
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 620px"
                className="object-contain select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
