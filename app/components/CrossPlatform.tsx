import StoreBadges from "./StoreBadges";

const points = [
  "Same account on web and mobile — your progress syncs everywhere.",
  "Study on your phone during the commute, review on a laptop at home.",
  "No download required — start instantly in your browser.",
];

export default function CrossPlatform() {
  return (
    <section id="download" className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-accent tracking-tight text-ink leading-[1.15]">
              Web or mobile — your call
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted font-medium leading-relaxed">
              Prefer not to install the app? Use the full-featured web version
              right from your browser. Want it in your pocket? Grab the mobile
              app. Both are powered by the same platform.
            </p>

            <ul className="mt-8 space-y-4">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-base text-ink/80 font-medium leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="mb-4 text-sm font-semibold text-muted">
                Get the mobile app
              </p>
              <StoreBadges variant="dark" />
            </div>
          </div>

          {/* Device mockups */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Browser window */}
            <div className="w-full max-w-md rounded-3xl border border-line bg-white shadow-2xl shadow-brand/10 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-muted border border-line">
                  app.prime.et/dashboard
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-28 rounded-full bg-ink/80" />
                  <div className="h-7 w-7 rounded-full bg-brand-100" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Net score", "Streak", "Accuracy"].map((label) => (
                    <div
                      key={label}
                      className="rounded-xl bg-surface p-3 text-center"
                    >
                      <div className="text-lg font-black font-accent text-brand">
                        {label === "Streak" ? "12🔥" : label === "Accuracy" ? "84%" : "512"}
                      </div>
                      <div className="mt-1 text-[0.6rem] font-medium text-muted">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-line p-4">
                  <div className="mb-3 h-2.5 w-24 rounded-full bg-ink/70" />
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-brand/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone mockup overlapping */}
            <div className="absolute -bottom-8 -left-2 sm:left-6 lg:-left-6 w-32 sm:w-40 rounded-[2rem] border-[6px] border-ink bg-white shadow-2xl shadow-ink/20 overflow-hidden">
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-ink/20" />
              <div className="p-3 space-y-2.5">
                <div className="h-2 w-16 rounded-full bg-ink/70" />
                <div className="rounded-lg bg-brand p-2.5">
                  <div className="h-1.5 w-12 rounded-full bg-white/80" />
                  <div className="mt-1.5 h-1.5 w-16 rounded-full bg-white/40" />
                </div>
                <div className="rounded-lg bg-surface p-2.5">
                  <div className="h-1.5 w-14 rounded-full bg-ink/40" />
                  <div className="mt-1.5 h-1.5 w-10 rounded-full bg-ink/20" />
                </div>
                <div className="rounded-lg bg-surface p-2.5">
                  <div className="h-1.5 w-16 rounded-full bg-ink/40" />
                  <div className="mt-1.5 h-1.5 w-8 rounded-full bg-ink/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
