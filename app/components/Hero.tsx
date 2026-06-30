import Image from "next/image";
import Link from "next/link";

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
    <section className="relative overflow-hidden">
      {/* Decorative blur gradients */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-gradient-to-b from-brand/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-gradient-to-tr from-brand-50/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center w-full">
          {/* Left: headline, copy, CTAs, social proof */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 animate-fade-in-up">
            <div className="space-y-5">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight font-accent text-ink leading-[1.1]">
                <span className="whitespace-nowrap">Practice Smarter</span>
                <br />
                to Ace UAT
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed font-sans font-medium">
                Prime is your all-in-one study companion — thousands of curated
                questions, realistic mock exams, premium courses, and an AI tutor.
                Study on the web or the mobile app, with the same account
                everywhere.
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

              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-7 py-4 text-base font-semibold text-brand bg-white border-2 border-brand/80 rounded-2xl hover:bg-brand-50/50 hover:border-brand hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                View Pricing
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-line/40">
              <div className="flex -space-x-3">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-all duration-200 cursor-pointer"
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

              <div className="text-sm sm:text-base text-muted font-medium">
                Join{" "}
                <span className="text-brand font-bold relative inline-block group">
                  50,000+
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand-100 -z-10 group-hover:h-full transition-all duration-200" />
                </span>{" "}
                students preparing with Prime
              </div>
            </div>
          </div>

          {/* Right: illustration */}
          <div
            className="lg:col-span-6 relative flex justify-center lg:justify-end animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute z-10 -bottom-28 left-0 w-[160%] h-[75%] fill-brand select-none pointer-events-none"
            >
              <path d="M0,198 C60,160 120,170 180,150 C250,128 290,150 350,100 C400,60 450,72 500,14 L500,200 L0,200 Z" />
            </svg>

            <div className="relative w-full max-w-[1000px] lg:max-w-none aspect-square lg:scale-125 lg:origin-right lg:translate-x-12 select-none pointer-events-none">
              <Image
                src="/images/hero.png"
                alt="Student smart preparation illustration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-contain mix-blend-multiply select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
