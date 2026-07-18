"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, ClipboardCheck } from "lucide-react";
import { OverviewStats } from "@/components/student/overview-stats";
import { StreakCard } from "@/components/student/streak-card";
import { ContinueStudying } from "@/components/student/continue-studying";
import { AchievementsCard } from "@/components/student/achievements-card";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <OverviewStats />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Choose your next session</h2>
          <Link href="/analytics" className="text-sm font-semibold text-brand hover:underline">
            View analytics
          </Link>
        </div>
        <div className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
          {[
            {
              href: "/practice",
              icon: Brain,
              title: "Focused practice",
              text: "Work by subject, topic, and set.",
            },
            {
              href: "/exams",
              icon: ClipboardCheck,
              title: "Timed simulation",
              text: "Practice under realistic exam pressure.",
            },
            {
              href: "/courses",
              icon: BookOpen,
              title: "Courses",
              text: "Continue videos, readings, and resources.",
            },
          ].map(({ href, icon: Icon, title, text }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-40 flex-col justify-between border-b border-line p-5 transition-colors last:border-b-0 hover:bg-surface sm:border-b-0"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-8">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid border-y border-line lg:grid-cols-2 lg:divide-x lg:divide-line">
        <StreakCard />
        <AchievementsCard />
      </div>
      <ContinueStudying />
    </div>
  );
}
