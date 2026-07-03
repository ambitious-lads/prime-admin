const points = [
  {
    title: "Practice with intent",
    description:
      "Questions are organized by subject, topic, and difficulty so students know exactly what to work on next.",
  },
  {
    title: "Mock exams that feel serious",
    description:
      "Timed attempts, question navigation, saved progress, reports, and leaderboards keep exam practice focused.",
  },
  {
    title: "Courses, notes, and AI in one account",
    description:
      "Students can move from lessons to practice to AI support without losing their progress.",
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-sm">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
          <div className="border-b border-line bg-surface p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Prime UAT
            </p>
            <h2 className="mt-4 font-accent text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              A cleaner way to prepare for UAT.
            </h2>
            <p className="mt-5 text-base font-medium leading-relaxed text-muted sm:text-lg">
              Built for students who need a focused study system: learn the topic,
              practice the questions, take a mock, then fix the weak spots.
            </p>
          </div>

          <div className="lg:col-span-7">
            {points.map((point, index) => (
              <div
                key={point.title}
                className="grid grid-cols-1 gap-4 border-b border-line p-6 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:p-8"
              >
                <span className="font-accent text-3xl font-black text-brand/25">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-muted sm:text-base">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
