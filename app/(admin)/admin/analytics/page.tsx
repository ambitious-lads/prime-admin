"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wallet, Users, TrendingUp, ShieldCheck, Clock, Megaphone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAdminMetrics } from "@/components/admin/use-admin-metrics";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { MoneyText, DateText } from "@/components/shared/formatting";
import { PlanBadge } from "@/components/shared/plan-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { analyticsApi } from "@/lib/api/endpoints";
import type { MarketingSlice } from "@/lib/api/types";
import { qk } from "@/lib/query/keys";
import { formatMoney, formatDate } from "@/lib/utils/format";

export default function AdminAnalyticsPage() {
  const m = useAdminMetrics();
  const marketing = useQuery({
    queryKey: qk.adminMarketingAnalytics,
    queryFn: analyticsApi.adminMarketing,
  });

  if (m.loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business analytics" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const signupData = m.signups.map((s) => ({
    date: formatDate(s.date, "MMM d"),
    count: s.count,
  }));
  const marketingData = marketing.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business analytics"
        subtitle="Revenue, conversion, and growth at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatMoney(m.revenue)}
          icon={<Wallet />}
        />
        <StatCard
          label="This month"
          value={formatMoney(m.monthRevenue)}
          icon={<TrendingUp />}
        />
        <StatCard
          label="Subscribers"
          value={`${m.subscribers}`}
          delta={`${m.conversion}% conversion`}
          trend="up"
          icon={<Users />}
        />
        <StatCard
          label="Device-locked"
          value={`${m.locked}`}
          icon={<ShieldCheck />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          label="Payment audit"
          value={formatMoney(m.pendingRevenue)}
          delta={`${m.pendingCount} legacy pending records`}
          icon={<Clock />}
        />
        <StatCard label="Total users" value={`${m.total}`} icon={<Users />} />
        <StatCard
          label="Avg. revenue / subscriber"
          value={formatMoney(
            m.subscribers ? Math.round(m.revenue / m.subscribers) : 0,
          )}
          icon={<Wallet />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Signups over time</CardTitle>
        </CardHeader>
        <CardContent>
          {signupData.length === 0 ? (
            <EmptyState title="No signups yet" message="New users will appear here." />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signupData}>
                  <defs>
                    <linearGradient id="signups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0c5bfe" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#0c5bfe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} stroke="#5a647a" />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="#5a647a" width={28} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0c5bfe"
                    strokeWidth={2}
                    fill="url(#signups)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-5 text-primary" />
              Marketing source
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketing.isLoading ? (
              <Skeleton className="h-72" />
            ) : !marketingData || marketingData.sources.length === 0 ? (
              <EmptyState
                title="No source data yet"
                message="Completed profiles will show where students heard about Prime UAT."
              />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={marketingData.sources}
                    layout="vertical"
                    margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} stroke="#5a647a" />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      stroke="#5a647a"
                      width={120}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0c5bfe" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Profile map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {marketing.isLoading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : !marketingData ? (
              <EmptyState title="No profile data yet" />
            ) : (
              <>
                <MarketingList
                  title="Top towns"
                  total={marketingData.totalProfiles}
                  items={marketingData.towns}
                />
                <MarketingList
                  title="Top regions"
                  total={marketingData.totalProfiles}
                  items={marketingData.regions}
                />
                <MarketingList
                  title="Top schools"
                  total={marketingData.totalProfiles}
                  items={marketingData.schools}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {m.approvedList.length === 0 ? (
            <EmptyState title="No approved payments yet" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Approved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {m.approvedList.slice(0, 8).map((p) => (
                  <TableRow key={p.id} className="hover:bg-transparent">
                    <TableCell>
                      <PlanBadge plan={p.plan} />
                    </TableCell>
                    <TableCell>
                      <MoneyText amount={p.amount ?? 0} />
                    </TableCell>
                    <TableCell className="text-muted">
                      <DateText value={p.reviewedAt ?? p.updatedAt ?? p.createdAt} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MarketingList({
  title,
  total,
  items,
}: {
  title: string;
  total: number;
  items: MarketingSlice[];
}) {
  const visible = items.slice(0, 4);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted">{total.toLocaleString()} profiles</p>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted">
          No data yet.
        </p>
      ) : (
        <div className="space-y-2">
          {visible.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={`${title}-${item.label}`} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-muted">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
