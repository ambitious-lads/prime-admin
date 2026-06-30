"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wallet, Users, TrendingUp, ShieldCheck, Clock } from "lucide-react";
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
import { formatMoney, formatDate } from "@/lib/utils/format";

export default function AdminAnalyticsPage() {
  const m = useAdminMetrics();

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
          label="Pending revenue"
          value={formatMoney(m.pendingRevenue)}
          delta={`${m.pendingCount} awaiting review`}
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
