"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { OverviewStats } from "@/components/student/overview-stats";
import { StreakCard } from "@/components/student/streak-card";
import { ContinueStudying } from "@/components/student/continue-studying";
import { UpgradeNudge } from "@/components/student/upgrade-nudge";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? "there";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's your progress today."
      />
      <OverviewStats />
      <div className="grid gap-6 lg:grid-cols-3">
        <StreakCard className="lg:col-span-1" />
        <ContinueStudying className="lg:col-span-2" />
      </div>
      <UpgradeNudge />
    </div>
  );
}
