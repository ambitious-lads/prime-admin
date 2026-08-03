"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Crown,
  Flag,
  FolderTree,
  MapPin,
  Megaphone,
  School,
  Search,
  Share2,
  Smartphone,
  UserCheck,
  UserPlus,
  UserRoundSearch,
  Users,
} from "lucide-react";
import {
  analyticsApi,
  authApi,
  plansApi,
  practiceApi,
} from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PlanBadge } from "@/components/shared/plan-badge";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import {
  formatMoney,
  formatNumber,
} from "@/lib/utils/format";
import type {
  AdminDashboardInsights,
  AdminUser,
} from "@/lib/api/types";

const referralStatusVariant = {
  registered: "outline",
  qualified: "success",
  reserved: "warning",
  paid: "success",
  reversed: "destructive",
} as const;

export default function AdminOverviewPage() {
  const [userQuery, setUserQuery] = useState("");
  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: qk.payments("pending"),
    queryFn: () => plansApi.payments("pending"),
    refetchInterval: 20_000,
  });
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });
  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: qk.questionReports("open"),
    queryFn: () => practiceApi.questionReports("open"),
    refetchInterval: 30_000,
  });
  const insights = useQuery({
    queryKey: qk.adminDashboardInsights,
    queryFn: analyticsApi.adminDashboard,
    refetchInterval: 60_000,
  });

  const userById = new Map<string, AdminUser>(users.map((user) => [user.id, user]));
  const subscribers = users.filter((user) => user.plan !== "free").length;
  const locked = users.filter((user) => user.boundDeviceId).length;
  const userMatches = useMemo(() => {
    const normalized = userQuery.trim().toLowerCase();
    const digits = normalized.replace(/\D/g, "");
    const sorted = [...users].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (!normalized) return sorted.slice(0, 6);

    return sorted
      .filter((user) => {
        const searchable = [
          user.fullName,
          user.phone,
          user.id,
          user.boundDeviceName,
          user.schoolName,
          user.townName,
          user.region,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          searchable.includes(normalized) ||
          (digits.length >= 3 &&
            user.phone.replace(/\D/g, "").includes(digits))
        );
      })
      .slice(0, 8);
  }, [userQuery, users]);

  const recentPayments = [...pending]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const dashboard = insights.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Users, referrals, payouts, profiles, and content operations in one place."
        action={
          <Button asChild>
            <Link href="/admin/referrals">
              Review payouts <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Total users"
          value={loadingUsers ? "—" : formatNumber(users.length)}
          delta={
            dashboard
              ? `${formatNumber(dashboard.growth.newUsers7d)} joined in 7 days`
              : undefined
          }
          icon={<Users />}
        />
        <StatCard
          label="Verified users"
          value={
            insights.isLoading
              ? "—"
              : formatNumber(dashboard?.growth.verifiedUsers ?? 0)
          }
          delta={
            dashboard && dashboard.growth.totalUsers > 0
              ? `${Math.round(
                  (dashboard.growth.verifiedUsers /
                    dashboard.growth.totalUsers) *
                    100,
                )}% verification rate`
              : undefined
          }
          icon={<UserCheck />}
        />
        <StatCard
          label="Subscribers"
          value={loadingUsers ? "—" : formatNumber(subscribers)}
          delta={
            loadingUsers || users.length === 0
              ? undefined
              : `${Math.round((subscribers / users.length) * 100)}% conversion`
          }
          icon={<Crown />}
        />
        <StatCard
          label="Profile completion"
          value={
            insights.isLoading
              ? "—"
              : `${dashboard?.profiles.completionRate ?? 0}%`
          }
          delta={
            dashboard
              ? `${formatNumber(dashboard.profiles.completedProfiles)} complete`
              : undefined
          }
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Open reports"
          value={loadingReports ? "—" : formatNumber(reports.length)}
          icon={<Flag />}
        />
        <StatCard
          label="Device-locked"
          value={loadingUsers ? "—" : formatNumber(locked)}
          icon={<Smartphone />}
        />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Referral operations
          </h2>
          <p className="mt-1 text-sm text-muted">
            “Active advocates” counts students whose invite code produced at
            least one registered account. Button-share events are not treated
            as confirmed referrals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            label="Invite codes issued"
            value={referralValue(dashboard, "inviteCodesIssued", insights.isLoading)}
            icon={<Share2 />}
          />
          <StatCard
            label="Active advocates"
            value={referralValue(dashboard, "activeAdvocates", insights.isLoading)}
            icon={<Megaphone />}
          />
          <StatCard
            label="Referred accounts"
            value={referralValue(
              dashboard,
              "attributedRegistrations",
              insights.isLoading,
            )}
            icon={<UserPlus />}
          />
          <StatCard
            label="Paid conversions"
            value={referralValue(
              dashboard,
              "qualifiedReferrals",
              insights.isLoading,
            )}
            delta={
              dashboard
                ? `${dashboard.referrals.conversionRate}% of referred accounts`
                : undefined
            }
            icon={<Activity />}
          />
          <StatCard
            label="Reward exposure"
            value={
              insights.isLoading
                ? "—"
                : formatMoney(dashboard?.referrals.totalRewardValue ?? 0)
            }
            delta={
              dashboard
                ? `${formatMoney(dashboard.referrals.paidRewardValue)} paid`
                : undefined
            }
            icon={<BadgeDollarSign />}
          />
          <StatCard
            label="Open payouts"
            value={
              insights.isLoading
                ? "—"
                : formatNumber(dashboard?.referrals.openPayouts ?? 0)
            }
            delta={
              dashboard
                ? `${formatMoney(dashboard.referrals.openPayoutAmount)} queued`
                : undefined
            }
            icon={<CircleDollarSign />}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Top advocates</CardTitle>
              <p className="mt-1 text-sm text-muted">
                Ranked by accounts successfully attributed to their invite code.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/referrals">
                Payout queue <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {insights.isLoading ? (
              <RowsSkeleton count={5} />
            ) : !dashboard || dashboard.topAdvocates.length === 0 ? (
              <EmptyState
                icon={<Megaphone />}
                title="No attributed referrals yet"
                message="Students will appear after someone registers with their invite code."
              />
            ) : (
              <div className="divide-y divide-line">
                {dashboard.topAdvocates.map((advocate, index) => (
                  <Link
                    key={advocate.userId}
                    href={`/admin/users/${advocate.userId}`}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 transition-colors hover:bg-surface/60"
                  >
                    <span className="flex size-7 items-center justify-center border border-line bg-surface text-xs font-bold text-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <UserCell
                        name={advocate.fullName}
                        phone={advocate.phone}
                        avatarUrl={advocate.avatarUrl}
                      />
                      <p className="ml-12 mt-1 truncate text-xs text-muted">
                        {profileLocation(
                          advocate.schoolName,
                          advocate.townName,
                          advocate.region,
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-base font-bold tabular-nums text-ink">
                        {advocate.registeredCount}
                      </p>
                      <p className="text-xs text-muted">
                        {advocate.qualifiedCount} subscribed
                      </p>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        {formatMoney(advocate.rewardValue)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent referral activity</CardTitle>
            <p className="text-sm text-muted">
              Open either student to review their complete account and profile.
            </p>
          </CardHeader>
          <CardContent>
            {insights.isLoading ? (
              <RowsSkeleton count={5} />
            ) : !dashboard || dashboard.recentReferrals.length === 0 ? (
              <EmptyState
                icon={<UserPlus />}
                title="No referral activity"
                message="New attributed accounts will appear here."
              />
            ) : (
              <div className="divide-y divide-line">
                {dashboard.recentReferrals.slice(0, 6).map((referral) => (
                  <div
                    key={referral.id}
                    className="grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/users/${referral.referredId}`}
                          className="font-semibold text-ink hover:text-brand"
                        >
                          {referral.referredName}
                        </Link>
                        <Badge variant={referralStatusVariant[referral.status]}>
                          {referral.status}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted">
                        {profileLocation(
                          referral.referredSchool,
                          referral.referredTown,
                          referral.referredRegion,
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Invited by{" "}
                        <Link
                          href={`/admin/users/${referral.referrerId}`}
                          className="font-semibold text-brand hover:underline"
                        >
                          {referral.referrerName}
                        </Link>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-ink">
                        {referral.rewardAmount > 0
                          ? formatMoney(referral.rewardAmount)
                          : "Pending reward"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        <RelativeTime value={referral.createdAt} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle>User lookup</CardTitle>
              <p className="text-sm text-muted">
                Search account, device, school, town, region, phone, or user ID.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">
                All users <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder="Search students and profile information"
                aria-label="Search users from admin overview"
                className="pl-9"
              />
            </div>

            {loadingUsers ? (
              <RowsSkeleton count={4} />
            ) : userMatches.length === 0 ? (
              <EmptyState
                icon={<UserRoundSearch />}
                title="No matching user"
                message="Try a name, phone, school, town, region, user ID, or device."
              />
            ) : (
              <div className="divide-y divide-line">
                {userMatches.map((account) => (
                  <Link
                    key={account.id}
                    href={`/admin/users/${account.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface/60"
                  >
                    <div className="min-w-0">
                      <UserCell
                        name={account.fullName}
                        phone={account.phone}
                        avatarUrl={account.avatarUrl}
                      />
                      <p className="ml-12 mt-1 truncate text-xs text-muted">
                        {profileLocation(
                          account.schoolName,
                          account.townName,
                          account.region,
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <PlanBadge plan={account.plan} />
                      <ArrowRight className="size-4 text-muted" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile data health</CardTitle>
            <p className="text-sm text-muted">
              Coverage of student information used for support and outreach.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {insights.isLoading || !dashboard ? (
              <RowsSkeleton count={3} />
            ) : (
              <>
                <CoverageRow
                  icon={<CheckCircle2 />}
                  label="Complete profiles"
                  count={dashboard.profiles.completedProfiles}
                  total={dashboard.profiles.totalProfiles}
                />
                <CoverageRow
                  icon={<School />}
                  label="School recorded"
                  count={dashboard.profiles.withSchool}
                  total={dashboard.profiles.totalProfiles}
                />
                <CoverageRow
                  icon={<MapPin />}
                  label="Location recorded"
                  count={dashboard.profiles.withLocation}
                  total={dashboard.profiles.totalProfiles}
                />
                <div className="border-t border-line pt-4">
                  <p className="text-xs font-semibold uppercase text-muted">
                    Growth
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <MiniMetric
                      label="Last 7 days"
                      value={dashboard.growth.newUsers7d}
                    />
                    <MiniMetric
                      label="Last 30 days"
                      value={dashboard.growth.newUsers30d}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent legacy payment records</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/payments">
                View history <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingPending ? (
              <RowsSkeleton count={4} />
            ) : recentPayments.length === 0 ? (
              <EmptyState
                icon={<CreditCard />}
                title="No legacy pending records"
                message="Automated receipts activate plans without admin action."
              />
            ) : (
              <div className="divide-y divide-line">
                {recentPayments.map((payment) => {
                  const user = userById.get(payment.userId);
                  return (
                    <Link
                      key={payment.id}
                      href={`/admin/users/${payment.userId}`}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface/60"
                    >
                      <UserCell
                        name={user?.fullName ?? "Unknown user"}
                        phone={user?.phone}
                        avatarUrl={user?.avatarUrl}
                      />
                      <div className="flex items-center gap-3">
                        <PlanBadge plan={payment.plan} />
                        <span className="font-display text-sm font-semibold text-ink">
                          <MoneyText amount={payment.amount ?? 0} />
                        </span>
                        <span className="hidden text-xs sm:inline">
                          <RelativeTime value={payment.createdAt} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickAction
              href="/admin/referrals"
              icon={<CircleDollarSign />}
              label="Referral payouts"
            />
            <QuickAction
              href="/admin/payments"
              icon={<CreditCard />}
              label="Payment history"
            />
            <QuickAction
              href="/admin/content/reports"
              icon={<Flag />}
              label="Question reports"
            />
            <QuickAction
              href="/admin/users"
              icon={<Users />}
              label="Manage users"
            />
            <QuickAction
              href="/admin/content/categories"
              icon={<FolderTree />}
              label="Create content"
            />
            <QuickAction
              href="/admin/devices"
              icon={<Smartphone />}
              label="Device oversight"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function referralValue(
  dashboard: AdminDashboardInsights | undefined,
  key:
    | "inviteCodesIssued"
    | "activeAdvocates"
    | "attributedRegistrations"
    | "qualifiedReferrals",
  loading: boolean,
) {
  return loading ? "—" : formatNumber(dashboard?.referrals[key] ?? 0);
}

function profileLocation(
  schoolName?: string | null,
  townName?: string | null,
  region?: string | null,
) {
  const location = [townName, region].filter(Boolean).join(", ");
  return [schoolName, location].filter(Boolean).join(" · ") || "Profile details incomplete";
}

function CoverageRow({
  icon,
  label,
  count,
  total,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-ink">
          <span className="text-brand [&_svg]:size-4">{icon}</span>
          {label}
        </span>
        <span className="tabular-nums text-muted">
          {formatNumber(count)} · {percentage}%
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-surface p-3">
      <p className="font-display text-xl font-bold tabular-nums text-ink">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button variant="outline" className="w-full justify-between" asChild>
      <Link href={href}>
        <span className="flex items-center gap-2 [&_svg]:size-4">
          {icon} {label}
        </span>
        <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}
