import SectionHeading from "./SectionHeading";

const features = [
  {
    title: "Smart Practice",
    description:
      "Drill exactly the right material — questions organized by category, topic, and difficulty so every minute counts.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Realistic Mock Exams",
    description:
      "Full-length timed exams with leaderboards, instant scoring, and detailed answer-by-answer reports.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Detailed Analytics",
    description:
      "Track performance, spot weak areas, and see an estimated net score — your progress is never a guess.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v18h18M7 14l4-4 3 3 5-6"
      />
    ),
  },
  {
    title: "Premium Courses",
    description:
      "Structured learning materials and explanations with reading-progress tracking, built for the curriculum.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
  },
  {
    title: "AI Tutor",
    description:
      "Ask questions in context on any course material and get clear, instant explanations — like a tutor on demand.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
  },
  {
    title: "Streaks & Notes",
    description:
      "Build a daily study habit with streaks, and keep personal notes — turning Prime UAT into your daily routine.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="One platform to study smarter"
          description="Stop juggling photocopied past papers and scattered notes. Prime UAT brings curated practice, mock exams, courses, and analytics into one focused experience."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-3xl border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <svg
                  className="h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold font-display text-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-muted font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
