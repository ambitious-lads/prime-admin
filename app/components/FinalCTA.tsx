import Link from "next/link";
import StoreBadges from "./StoreBadges";

export default function FinalCTA() {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand px-6 py-16 text-center sm:px-12 lg:py-20">
          {/* Decorative paint waves */}
          <div className="absolute inset-0 -z-0 opacity-20 pointer-events-none">
            <svg
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-40 w-full fill-white"
            >
              <path d="M0,80 C300,160 550,20 900,120 C1050,160 1150,90 1200,70 L1200,200 L0,200 Z" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-accent tracking-tight text-white leading-[1.15]">
              Ready to ace your exam?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/85 font-medium leading-relaxed">
              Join 50,000+ Ethiopian students studying smarter with Prime. Start
              free today — no card required.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-brand shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] group"
              >
                Start Preparing Free
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/70"
              >
                Log in
              </Link>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-white/70">
                Or get the mobile app
              </p>
              <StoreBadges variant="light" className="justify-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
