import Link from "next/link";
import { BarChart3, BookOpenCheck, MessageCircle, Smartphone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { site } from "@/config/site";

const principles = [
  {
    title: "Focused preparation",
    icon: BookOpenCheck,
    text: "We organize practice by skill, topic, and difficulty so students always know what to study next.",
  },
  {
    title: "Real exam readiness",
    icon: BarChart3,
    text: "Timed simulations, detailed reports, and progress analytics help students turn practice into measurable improvement.",
  },
  {
    title: "Accessible on every device",
    icon: Smartphone,
    text: "Prime UAT supports Android, iOS, and the web so a student can continue from the same account wherever they study.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <section className="border-b border-line px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
              About Prime UAT
            </p>
            <h1 className="mt-4 max-w-4xl font-accent text-4xl font-black leading-tight text-ink sm:text-5xl">
              A focused study system built for Ethiopian UAT candidates.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              Prime UAT was created to replace scattered preparation materials with
              one structured experience for learning, practice, simulation, review,
              and measurable progress.
            </p>
          </div>
        </section>

        <section className="bg-surface px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              {principles.map(({ title, icon: Icon, text }) => (
                <article key={title} className="border-t-2 border-brand pt-5">
                  <Icon className="h-6 w-6 text-brand" />
                  <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
                What students receive
              </p>
              <h2 className="mt-3 text-3xl font-black text-ink">
                One connected preparation journey.
              </h2>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {[
                "Targeted verbal, quantitative, and analytical practice.",
                "Timed simulations with reports, rank, and performance review.",
                "Courses, reading resources, and lesson-aware Prime AI support.",
                "Saved questions and organized notes for repeated revision.",
                "Streaks, topic mastery, achievements, and weekly progress.",
              ].map((item, index) => (
                <div key={item} className="grid grid-cols-[3rem_1fr] gap-3 py-5">
                  <span className="font-black text-brand/40">0{index + 1}</span>
                  <p className="font-medium leading-7 text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand px-4 py-14 text-white sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Questions or support?</h2>
              <p className="mt-2 text-sm text-white/80">
                Contact the Prime UAT support team directly on Telegram.
              </p>
            </div>
            <Link
              href={site.supportTelegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand"
            >
              <MessageCircle className="h-4 w-4" />
              @prime_uat
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
