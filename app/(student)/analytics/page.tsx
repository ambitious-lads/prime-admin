"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Calculator,
  CheckCircle2,
  Clock,
  Lock,
  Target,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { toastApiError } from "@/hooks/use-api-error";
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/lib/utils/format";

const BRAND = "#0c5bfe";
const GRID = "#e8ebf3";

export default function AnalyticsPage() {
  const { can } = usePlan();
  if (!can("pro")) return <AnalyticsLocked />;
  return <AnalyticsDashboard />;
}

function AnalyticsLocked() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track your accuracy, study time and topic mastery."
      />
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <div className="pointer-events-none select-none blur-sm" aria-hidden>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/40">
          <Card className="max-w-sm text-center">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                <Lock className="h-7 w-7" />
              </span>
              <h2 className="font-display text-xl font-bold text-ink">
                Analytics is a Pro feature
              </h2>
              <p className="text-sm text-muted">
                Upgrade to Pro to unlock detailed performance analytics and your
                score calculator.
              </p>
              <Button asChild>
                <Link href="/plans">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const overview = useQuery({
    queryKey: qk.analyticsOverview,
    queryFn: analyticsApi.overview,
  });
  const dashboard = useQuery({
    queryKey: qk.analyticsDashboard,
    queryFn: analyticsApi.dashboard,
  });

  const o = overview.data;
  const d = dashboard.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Your performance at a glance."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {overview.isLoading || !o ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard
              label="Accuracy"
              value={formatPercent(o.accuracy ?? 0)}
              icon={<Target />}
            />
            <StatCard
              label="Questions solved"
              value={formatNumber(o.questionsSolved ?? 0)}
              icon={<CheckCircle2 />}
            />
            <StatCard
              label="Study time"
              value={formatDuration(o.studyTimeSeconds ?? 0)}
              icon={<Clock />}
            />
            <StatCard
              label="Rank"
              value={o.rank != null ? `#${formatNumber(o.rank)}` : "—"}
              icon={<Trophy />}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Accuracy over time"
          icon={<Activity className="h-4 w-4" />}
          loading={dashboard.isLoading}
          empty={(d?.accuracyOverTime ?? []).length === 0}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={d?.accuracyOverTime ?? []} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v, "MMM d")}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#9aa3b2"
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#9aa3b2"
              />
              <Tooltip
                formatter={(value) => [formatPercent(Number(value)), "Accuracy"]}
                labelFormatter={(v) => formatDate(v as string)}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke={BRAND}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Time per topic"
          icon={<Clock className="h-4 w-4" />}
          loading={dashboard.isLoading}
          empty={(d?.timePerTopic ?? []).length === 0}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={d?.timePerTopic ?? []} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="topic"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#9aa3b2"
                interval={0}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#9aa3b2" />
              <Tooltip
                formatter={(value) => [`${formatNumber(Number(value))} min`, "Time"]}
              />
              <Bar dataKey="minutes" fill={BRAND} radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Questions per day"
          icon={<BarChart3 className="h-4 w-4" />}
          loading={dashboard.isLoading}
          empty={(d?.questionsPerDay ?? []).length === 0}
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={d?.questionsPerDay ?? []} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="qpd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v, "MMM d")}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#9aa3b2"
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#9aa3b2" />
              <Tooltip
                formatter={(value) => [formatNumber(Number(value)), "Questions"]}
                labelFormatter={(v) => formatDate(v as string)}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={BRAND}
                strokeWidth={2.5}
                fill="url(#qpd)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Topic mastery"
          icon={<Target className="h-4 w-4" />}
          loading={dashboard.isLoading}
          empty={(d?.topicMastery ?? []).length === 0}
        >
          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart
              data={(d?.topicMastery ?? []).map((t) => ({
                topic: t.topic,
                mastery: Math.min(100, Math.max(0, t.mastery ?? 0)),
              }))}
              innerRadius="25%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background dataKey="mastery" fill={BRAND} cornerRadius={6} />
              <Tooltip
                formatter={(value, _name, item) => {
                  const topic = (item?.payload as { topic?: string })?.topic ?? "Mastery";
                  return [formatPercent(Number(value)), topic];
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ScoreCalculator />
    </div>
  );
}

function ChartCard({
  title,
  icon,
  loading,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand">
          {icon}
        </span>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : empty ? (
          <EmptyState
            title="No data yet"
            message="Keep practicing and this will fill in."
            className="py-12"
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function ScoreCalculator() {
  const [esslceScore, setEsslce] = useState("");
  const [uatScore, setUat] = useState("");

  const calc = useMutation({
    mutationFn: () =>
      analyticsApi.scoreCalculator({
        esslceScore: esslceScore ? Number(esslceScore) : undefined,
        uatScore: uatScore ? Number(uatScore) : undefined,
      }),
    onError: toastApiError,
  });

  function submit() {
    if (!esslceScore && !uatScore) {
      toastApiError(new Error("Enter at least one score."));
      return;
    }
    calc.mutate();
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand">
          <Calculator className="h-4 w-4" />
        </span>
        <CardTitle className="text-sm">Net score calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="esslce">ESSLCE score</Label>
            <Input
              id="esslce"
              type="number"
              inputMode="decimal"
              value={esslceScore}
              onChange={(e) => setEsslce(e.target.value)}
              placeholder="e.g. 540"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="uat">UAT score</Label>
            <Input
              id="uat"
              type="number"
              inputMode="decimal"
              value={uatScore}
              onChange={(e) => setUat(e.target.value)}
              placeholder="e.g. 85"
            />
          </div>
          <Button onClick={submit} disabled={calc.isPending}>
            {calc.isPending ? <Spinner /> : <Calculator className="h-4 w-4" />}
            Calculate
          </Button>
        </div>
        {calc.data && (
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-brand-50 px-5 py-4">
            <span className="text-sm font-medium text-ink">Net score</span>
            <span className="font-accent text-3xl font-bold tabular-nums text-brand">
              {formatNumber(calc.data.netScore)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
