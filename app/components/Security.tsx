const benefits = [
  {
    title: "Locked to your device",
    description:
      "When you subscribe, your account binds to one device — your phone or your browser. It's yours alone.",
  },
  {
    title: "No sharing, no leaks",
    description:
      "Shared logins on a second device are cleanly rejected, so what you pay for stays protected.",
  },
  {
    title: "Switch devices easily",
    description:
      "Got a new phone or moving to the web? A secure transfer flow moves your account with you.",
  },
];

export default function Security() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/90">
                <svg
                  className="h-4 w-4 text-brand"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Account security
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black font-accent tracking-tight text-white leading-[1.15]">
                Your account is yours alone
              </h2>
              <p className="mt-5 text-base sm:text-lg text-white/70 font-medium leading-relaxed">
                Prime has a built-in single-device lock. No one can steal or
                share your account — and the value you pay for stays real and
                consistent across phone and web.
              </p>
            </div>

            <div className="space-y-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/60 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
