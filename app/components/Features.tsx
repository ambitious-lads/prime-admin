import {
  BarChart3,
  BookOpen,
  Bot,
  ClipboardCheck,
  Flame,
  Target,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const features = [
  {
    number: "01",
    title: "Smart Practice",
    id: "practice",
    description:
      "Drill exactly the right material — questions organized by category, topic, and difficulty so every minute counts.",
    icon: Target,
    accent: "bg-indigo-600",
    iconStyle: "bg-indigo-50 text-indigo-600",
  },
  {
    number: "02",
    title: "Realistic Mock Exams",
    id: "mock-tests",
    description:
      "Full-length timed exams with leaderboards, instant scoring, and detailed answer-by-answer reports.",
    icon: ClipboardCheck,
    accent: "bg-rose-500",
    iconStyle: "bg-rose-50 text-rose-600",
  },
  {
    number: "03",
    title: "Detailed Analytics",
    id: "analytics",
    description:
      "Track performance, spot weak areas, and see an estimated net score — your progress is never a guess.",
    icon: BarChart3,
    accent: "bg-emerald-500",
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "04",
    title: "Premium Courses",
    id: "courses",
    description:
      "Structured learning materials and explanations with reading-progress tracking, built for the curriculum.",
    icon: BookOpen,
    accent: "bg-neutral-900",
    iconStyle: "bg-neutral-100 text-neutral-900",
  },
  {
    number: "05",
    title: "AI Tutor",
    id: "ai-tutor",
    description:
      "Ask questions in context on any course material and get clear, instant explanations — like a tutor on demand.",
    icon: Bot,
    accent: "bg-sky-500",
    iconStyle: "bg-sky-50 text-sky-600",
  },
  {
    number: "06",
    title: "Streaks & Notes",
    id: "streaks",
    description:
      "Build a daily study habit with streaks, and keep personal notes — turning Prime UAT into your daily routine.",
    icon: Flame,
    accent: "bg-amber-400",
    iconStyle: "bg-amber-50 text-amber-700",
  },
];

export default function Features() {
  return (
    <section id="features" className="overflow-hidden bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="One platform to study smarter"
          description="Stop juggling photocopied past papers and scattered notes. Prime UAT brings curated practice, mock exams, courses, and analytics into one focused experience."
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {features.map(
            ({ number, title, id, description, icon: Icon, accent, iconStyle }) => (
              <article
                id={id}
                key={title}
                className="group relative min-h-[290px] scroll-mt-28 overflow-hidden rounded-lg border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-neutral-400">
                      {number}
                    </span>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-md ${iconStyle}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-xl font-black text-ink">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {description}
                    </p>
                  </div>
                </div>
                <div className={`absolute inset-x-0 bottom-0 h-1 ${accent} transition-all duration-300 group-hover:h-1.5`} />
              </article>
            ),
          )}
      </div>
    </section>
  );
}
