"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Users,
  Crown,
  Smartphone,
  ArrowRight,
  FolderTree,
} from "lucide-react";
import { plansApi, authApi } from "@/lib/api/endpoints";
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
import { PlanBadge } from "@/components/shared/plan-badge";
import { MoneyText, RelativeTime } from "@/components/shared/formatting";
import { UserCell } from "@/components/admin/user-cell";
import { formatMoney, formatNumber } from "@/lib/utils/format";
import type { AdminUser } from "@/lib/api/types";

export default function AdminOverviewPage() {
  const { data: pending = [], isLoading: loadingPending } = useQuery({
    queryKey: qk.payments("pending"),
    queryFn: () => plansApi.payments("pending"),
    refetchInterval: 20_000,
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: qk.users,
    queryFn: authApi.users,
  });

  const userById = new Map<string, AdminUser>(users.map((u) => [u.id, u]));

  const pendingRevenue = pending.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const subscribers = users.filter((u) => u.plan && u.plan !== "free").length;
  const locked = users.filter((u) => u.boundDeviceId).length;

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
        subtitle="The business at a glance — revenue queue, users, and devices."
        action={
          <Button asChild>
            <Link href="/admin/payments">
              Review payments <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending payments"
          value={loadingPending ? "—" : formatNumber(pending.length)}
          delta={loadingPending ? undefined : formatMoney(pendingRevenue)}
          icon={<CreditCard />}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent pending payments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/payments">
                View queue <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingPending ? (
              <RowsSkeleton count={4} />
            ) : recent.length === 0 ? (
              <EmptyState
                icon={<CreditCard />}
                title="No pending payments"
                message="New subscription proofs will appear here for review."
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
                  <CreditCard className="size-4" /> Payment queue
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
