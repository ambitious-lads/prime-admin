"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Users,
  Crown,
  Smartphone,
  ArrowRight,
  FolderTree,
  Flag,
  Search,
  UserRoundSearch,
} from "lucide-react";
import { plansApi, authApi, practiceApi } from "@/lib/api/endpoints";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanBadge } from "@/components/shared/plan-badge";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { formatNumber } from "@/lib/utils/format";
import type { AdminUser } from "@/lib/api/types";

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

  const userById = new Map<string, AdminUser>(users.map((u) => [u.id, u]));

  const subscribers = users.filter((u) => u.plan && u.plan !== "free").length;
  const locked = users.filter((u) => u.boundDeviceId).length;
  const userMatches = useMemo(() => {
    const normalized = userQuery.trim().toLowerCase();
    const digits = normalized.replace(/\D/g, "");
    const sorted = [...users].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (!normalized) return sorted.slice(0, 5);

    return sorted
      .filter((user) => {
        const searchable = [
          user.fullName,
          user.phone,
          user.id,
          user.boundDeviceName,
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
      .slice(0, 5);
  }, [userQuery, users]);

  const recent = [...pending]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Revenue, users, devices, and content issues at a glance."
        action={
          <Button asChild>
            <Link href="/admin/content/reports">
              Open reports <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open reports"
          value={loadingReports ? "—" : formatNumber(reports.length)}
          icon={<Flag />}
        />
        <StatCard
          label="Total users"
          value={loadingUsers ? "—" : formatNumber(users.length)}
          icon={<Users />}
        />
        <StatCard
          label="Subscribers"
          value={loadingUsers ? "—" : formatNumber(subscribers)}
          delta={
            loadingUsers || users.length === 0
              ? undefined
              : `${Math.round((subscribers / users.length) * 100)}% of users`
          }
          icon={<Crown />}
        />
        <StatCard
          label="Device-locked"
          value={loadingUsers ? "—" : formatNumber(locked)}
          icon={<Smartphone />}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle>User lookup</CardTitle>
            <p className="text-sm text-muted">
              Direct access to account, subscription, verification, and device
              records.
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
              placeholder="Search by name, phone, user ID, or device"
              aria-label="Search users from admin overview"
              className="pl-9"
            />
          </div>

          {loadingUsers ? (
            <RowsSkeleton count={3} />
          ) : userMatches.length === 0 ? (
            <EmptyState
              icon={<UserRoundSearch />}
              title="No matching user"
              message="Try a different name, phone number, user ID, or device."
            />
          ) : (
            <div className="divide-y divide-line">
              {userMatches.map((account) => (
                <Link
                  key={account.id}
                  href={`/admin/users/${account.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface/60"
                >
                  <UserCell
                    name={account.fullName}
                    phone={account.phone}
                    avatarUrl={account.avatarUrl}
                  />
                  <div className="flex items-center gap-3">
                    <PlanBadge plan={account.plan} />
                    <span className="hidden text-xs text-muted sm:inline">
                      {account.boundDeviceId ? "Device bound" : "No device"}
                    </span>
                    <ArrowRight className="size-4 text-muted" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
            ) : recent.length === 0 ? (
              <EmptyState
                icon={<CreditCard />}
                title="No legacy pending records"
                message="Automated receipts activate plans without admin action."
              />
            ) : (
              <div className="divide-y divide-line">
                {recent.map((p) => {
                  const u = userById.get(p.userId);
                  return (
                    <Link
                      key={p.id}
                      href="/admin/payments"
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface/60"
                    >
                      <UserCell
                        name={u?.fullName ?? "Unknown user"}
                        phone={u?.phone}
                        avatarUrl={u?.avatarUrl}
                      />
                      <div className="flex items-center gap-3">
                        <PlanBadge plan={p.plan} />
                        <span className="font-display text-sm font-semibold text-ink">
                          <MoneyText amount={p.amount ?? 0} />
                        </span>
                        <span className="hidden text-xs sm:inline">
                          <RelativeTime value={p.createdAt} />
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
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/payments">
                <span className="flex items-center gap-2">
                  <CreditCard className="size-4" /> Payment history
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/content/reports">
                <span className="flex items-center gap-2">
                  <Flag className="size-4" /> Question reports
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/users">
                <span className="flex items-center gap-2">
                  <Users className="size-4" /> Manage users
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/content/categories">
                <span className="flex items-center gap-2">
                  <FolderTree className="size-4" /> Create content
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/devices">
                <span className="flex items-center gap-2">
                  <Smartphone className="size-4" /> Device oversight
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
