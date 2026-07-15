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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { toastApiError } from "@/hooks/use-api-error";
import { ANALYTICS_UNLOCK_PLAN, planLabel } from "@/lib/utils/plans";
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
  if (!can(ANALYTICS_UNLOCK_PLAN)) return <AnalyticsLocked />;
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
                Analytics is a {planLabel(ANALYTICS_UNLOCK_PLAN)} feature
              </h2>
              <p className="text-sm text-muted">
                Upgrade to {planLabel(ANALYTICS_UNLOCK_PLAN)} to unlock advanced
                performance analytics and your UAT score calculator.
              </p>
              <Button asChild>
                <Link href="/plans">Upgrade to {planLabel(ANALYTICS_UNLOCK_PLAN)}</Link>
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
  const kpis = d?.kpis;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="See what is improving, where to focus next, and how close you are to your goal."
      />

      <div className="relative overflow-hidden rounded-2xl bg-ink px-5 py-6 text-white sm:px-7">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-100">
            Your study picture
          </p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            Small daily progress compounds into exam-day confidence.
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Use your accuracy, time, streak, and topic mastery to decide what to practice next.
          </p>
        </div>
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand/40" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-emerald-400/20" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {overview.isLoading || !o ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard
              label="Accuracy"
              value={formatPercent(o.accuracy ?? 0)}
              icon={<Target className="text-brand" />}
            />
            <StatCard
              label="Questions solved"
              value={formatNumber(o.questionsSolved ?? 0)}
              icon={<CheckCircle2 className="text-emerald-600" />}
            />
            <StatCard
              label="Study time"
              value={formatDuration(o.studyTimeSeconds ?? 0)}
              icon={<Clock className="text-sky-600" />}
            />
            <StatCard
              label="Rank"
              value={o.rank != null ? `#${formatNumber(o.rank)}` : "—"}
              icon={<Trophy className="text-amber-600" />}
            />
          </>
        )}
      </div>

      {kpis || d?.mockPerformance ? (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {kpis ? (
            <div className="rounded-2xl bg-gradient-to-br from-brand to-indigo-700 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                Your momentum
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Metric label="Solved" value={formatNumber(kpis.totalSolved)} />
                <Metric label="Study time" value={`${kpis.studyTimeHours}h`} />
                <Metric label="Best streak" value={`${kpis.longestStreakDays}d`} />
              </div>
              <p className="mt-5 text-sm leading-6 text-white/80">
                You are on a {kpis.currentStreakDays}-day streak. Keep one focused session going today.
              </p>
            </div>
          ) : null}
          {d?.mockPerformance ? (
            <div className="rounded-2xl border border-line bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-700">
                <Trophy className="h-5 w-5" />
                <p className="font-bold">Mock exam standing</p>
              </div>
              <p className="mt-4 text-3xl font-black text-ink">
                #{d.mockPerformance.overallRank}
              </p>
              <p className="mt-1 text-sm text-muted">
                Better than {Math.round(d.mockPerformance.percentile)}% of{" "}
                {formatNumber(d.mockPerformance.totalActiveStudents)} students
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.min(100, d.mockPerformance.percentile)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-black tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-white/70">{label}</p>
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
  const [esslceMax, setEsslceMax] = useState<"700" | "600">("700");
  const [uatScore, setUat] = useState("");

  const calc = useMutation({
    mutationFn: () =>
      analyticsApi.scoreCalculator({
        esslceScore: esslceScore ? Number(esslceScore) : undefined,
        esslceMax: Number(esslceMax) as 600 | 700,
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_150px_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="esslce">EUEE / ESSLCE score</Label>
            <Input
              id="esslce"
              type="number"
              inputMode="decimal"
              min={0}
              max={Number(esslceMax)}
              value={esslceScore}
              onChange={(e) => setEsslce(e.target.value)}
              placeholder={esslceMax === "700" ? "e.g. 540" : "e.g. 460"}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="esslceMax">EUEE scale</Label>
            <Select
              value={esslceMax}
              onValueChange={(value) => setEsslceMax(value as "700" | "600")}
            >
              <SelectTrigger id="esslceMax">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="700">Out of 700</SelectItem>
                <SelectItem value="600">Out of 600</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="mt-5 rounded-2xl bg-brand-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Net score</span>
              <span className="font-accent text-3xl font-bold tabular-nums text-brand">
                {formatNumber(calc.data.netScore)}
              </span>
            </div>
            {calc.data.normalizedEsslce != null ? (
              <p className="mt-1 text-xs text-muted">
                EUEE normalized from {formatNumber(calc.data.esslceScore ?? 0)}
                /{calc.data.esslceMax ?? Number(esslceMax)} to{" "}
                {formatNumber(calc.data.normalizedEsslce)}%.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
