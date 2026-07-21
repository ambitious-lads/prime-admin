const features = [
  { number: "01", title: "Smart Practice", id: "practice", description: "Drill exactly the right material — questions organized by category, topic, and difficulty so every minute counts." },
  { number: "02", title: "Realistic Mock Exams", id: "mock-tests", description: "Full-length timed exams with leaderboards, instant scoring, and detailed answer-by-answer reports." },
  { number: "03", title: "Detailed Analytics", id: "analytics", description: "Track performance, spot weak areas, and see an estimated net score — your progress is never a guess." },
  { number: "04", title: "Premium Courses", id: "courses", description: "Structured learning materials and explanations with reading-progress tracking, built for the curriculum." },
  { number: "05", title: "AI Tutor", id: "ai-tutor", description: "Ask questions in context on any course material and get clear, instant explanations — like a tutor on demand." },
  { number: "06", title: "Streaks & Notes", id: "streaks", description: "Build a daily study habit with streaks, and keep personal notes — turning Prime UAT into your daily routine." },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-12 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Everything you need</p>
          <h2 className="mt-3 font-display text-3xl font-black leading-tight text-ink md:text-5xl">One focused preparation system</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted md:text-base">Practice, learn, test, and measure progress without switching between scattered tools.</p>
        </div>

        <div className="mt-9 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4 lg:grid-cols-3">
          {features.map(({ number, title, id, description }) => (
            <article
              id={id}
              key={title}
              className="scroll-mt-28 rounded-lg border border-line bg-white px-5 py-7 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] md:px-6 md:py-8"
            >
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-brand-50 px-2 text-xs font-black tabular-nums text-brand">{number}</span>
              <h3 className="mt-5 text-lg font-black text-ink md:text-xl">{title}</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted md:leading-7">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
