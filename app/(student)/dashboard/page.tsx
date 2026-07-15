"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { OverviewStats } from "@/components/student/overview-stats";
import { StreakCard } from "@/components/student/streak-card";
import { ContinueStudying } from "@/components/student/continue-studying";
import { AchievementsCard } from "@/components/student/achievements-card";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? "there";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Pick up where you left off."
      />
      <OverviewStats />
      <div className="grid border-y border-line lg:grid-cols-2 lg:divide-x lg:divide-line">
        <StreakCard />
        <AchievementsCard />
      </div>
      <ContinueStudying />
    </div>
  );
}
