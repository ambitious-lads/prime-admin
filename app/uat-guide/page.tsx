import Link from "next/link";
import { BookOpen, Brain, Calculator, CheckCircle2, Clock3 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Verbal reasoning",
    icon: BookOpen,
    color: "text-indigo-600 bg-indigo-50",
    description:
      "Reading comprehension, vocabulary, grammar, sentence completion, analogies, and logical use of language.",
  },
  {
    title: "Quantitative reasoning",
    icon: Calculator,
    color: "text-red-600 bg-red-50",
    description:
      "Arithmetic, algebra, ratios, percentages, probability, statistics, geometry, and graph interpretation.",
  },
  {
    title: "Analytical reasoning",
    icon: Brain,
    color: "text-emerald-600 bg-emerald-50",
    description:
      "Patterns, arrangements, deductions, data sufficiency, critical thinking, and structured problem solving.",
  },
];

export default function UatGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="border-b border-line bg-surface px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
              UAT Guide
            </p>
            <h1 className="mt-4 max-w-4xl font-accent text-4xl font-black leading-tight text-ink sm:text-5xl">
              Understand the Addis Ababa University admission test before you prepare.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              The Undergraduate Admission Test evaluates general reasoning, speed,
              accuracy, and decision-making. Its exact format may change, so students
              should combine official AAU guidance with consistent aptitude practice.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-black text-ink">What the test measures</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {sections.map(({ title, icon: Icon, color, description }) => (
                <article key={title} className="border-t-2 border-line py-5">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink px-4 py-16 text-white sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black">How to prepare effectively</h2>
              <p className="mt-3 leading-7 text-white/70">
                UAT preparation is less about memorizing a single textbook and more
                about building repeatable reasoning habits under time pressure.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Strengthen reading speed, vocabulary, and comprehension.",
                "Review core Grade 9-12 mathematics and mental calculation.",
                "Practice timed reasoning sets instead of only reading solutions.",
                "Review every mistake and record the underlying concept.",
                "Take full simulations and improve your pacing strategy.",
              ].map((item) => (
                <div key={item} className="flex gap-3 border-b border-white/15 pb-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <p className="text-sm leading-6 text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-start gap-4 border-y border-line py-8">
              <Clock3 className="mt-1 h-6 w-6 shrink-0 text-brand" />
              <div>
                <h2 className="text-xl font-bold text-ink">Important note</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                  Prime UAT is an independent preparation platform and is not
                  affiliated with Addis Ababa University. Always check official AAU
                  announcements for current eligibility, dates, test structure, and
                  admission requirements.
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white">
                Start preparing
              </Link>
              <Link href="/#mock-tests" className="rounded-lg border border-line px-5 py-3 text-sm font-bold text-ink">
                Explore simulations
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
