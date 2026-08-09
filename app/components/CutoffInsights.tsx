"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BarChart3,
  Calculator,
  Flame,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";

const growthData = [
  { program: "Logistics & SCM", y2024: 56, y2025: 69 },
  { program: "Information Systems", y2024: 63, y2025: 74 },
  { program: "Management", y2024: 56, y2025: 67 },
  { program: "Architecture", y2024: 63, y2025: 73 },
  { program: "Psychology", y2024: 60, y2025: 70 },
  { program: "Accounting & Finance", y2024: 56, y2025: 65 },
  { program: "Economics", y2024: 61, y2025: 69 },
  { program: "Political Science", y2024: 61, y2025: 69 },
];

const growthStats = [
  { value: "+13 pts", label: "Largest single-year jump — Logistics & Supply Chain" },
  { value: "5.9 pts", label: "Average rise across the 14 flagship programs we track" },
  { value: "12 of 14", label: "Flagship programs that climbed in 2025/26" },
];

const predictions = [
  { program: "Doctor of Medicine", y2025: 79, y2026: "80 – 82" },
  { program: "Software Engineering", y2025: 79, y2026: "80 – 81" },
  { program: "Computer Science", y2025: 77, y2026: "78 – 80" },
  { program: "Dental Medicine (DMD)", y2025: 78, y2026: "79 – 81" },
  { program: "Business Admin & IS", y2025: 76, y2026: "77 – 79" },
  { program: "Information Systems", y2025: 74, y2026: "75 – 78" },
  { program: "Architecture", y2025: 73, y2026: "74 – 77" },
  { program: "Law (LL.B.)", y2025: 73, y2026: "74 – 76" },
  { program: "Pharmacy", y2025: 72, y2026: "73 – 75" },
  { program: "Psychology", y2025: 70, y2026: "71 – 74" },
  { program: "Economics", y2025: 69, y2026: "70 – 73" },
  { program: "Logistics & Supply Chain", y2025: 69, y2026: "70 – 73" },
];

export function CompetitionGrowth() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em] text-brand">
            <Flame className="h-4 w-4" /> Competition is climbing
          </span>
          <h2 className="font-accent mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
            Cutoff points are rising — fast.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            Compare 2024/25 against 2025/26 for the same programs. Scores that
            cleared a program last year may no longer be enough this cycle.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <TrendingUp className="h-4 w-4 text-brand" /> 2024/25 → 2025/26
          </p>
          <p className="mt-1 text-sm text-muted">Most competitive programs</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {growthStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="font-accent text-3xl font-black tracking-tight text-brand">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink">
            Where the biggest jumps happened
          </p>
          <p className="text-xs text-muted">Cutoff point, by admission year</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData} margin={{ top: 8, right: 8, bottom: 8, left: -14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf3" vertical={false} />
              <XAxis
                dataKey="program"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                stroke="#5a647a"
                interval={0}
                angle={-22}
                textAnchor="end"
                height={64}
              />
              <YAxis
                domain={[0, 80]}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#5a647a"
                width={40}
              />
              <Tooltip cursor={{ fill: "#f6f8ff" }} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={9}
                wrapperStyle={{ fontSize: 12, color: "#5a647a" }}
              />
              <Bar dataKey="y2024" name="2024/25" fill="#cdddff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2025" name="2025/26" fill="#0c5bfe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export function CutoffPrediction() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em] text-brand">
          <Target className="h-4 w-4" /> 2026/27 outlook
        </span>
        <h2 className="font-accent mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
          Where cutoffs are heading next
        </h2>
        <p className="mt-4 text-base leading-7 text-muted">
          Projections based on the 2024/25 → 2025/26 trend. If growth holds,
          expect several flagship programs to climb another one to three points.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1fr_88px_110px] gap-2 bg-ink px-5 py-3 text-xs font-bold uppercase tracking-wide text-white sm:grid-cols-[1fr_120px_140px] sm:px-6">
          <span>Program</span>
          <span className="text-right">2025/26</span>
          <span className="text-right">2026/27 projected</span>
        </div>
        <div className="divide-y divide-line">
          {predictions.map((row) => (
            <div
              key={row.program}
              className="grid grid-cols-[1fr_88px_110px] items-center gap-2 bg-white px-5 py-4 transition-colors hover:bg-surface sm:grid-cols-[1fr_120px_140px] sm:px-6"
            >
              <span className="pr-2 text-sm font-medium leading-6 text-ink">
                {row.program}
              </span>
              <span className="text-right text-lg font-bold tabular-nums text-muted">
                {row.y2025}
              </span>
              <span className="flex items-center justify-end gap-1 text-right text-lg font-black tabular-nums text-brand">
                {row.y2026}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs leading-6 text-muted">
        Projections are directional estimates for orientation only. Official
        cutoffs are set per admission round by AAU.
      </p>
    </section>
  );
}

export function NetScoreExplained() {
  const steps = [
    {
      title: "Normalize ESSLCE",
      body: "Convert your EUEE / ESSLCE score to a percentage of the exam max: (score ÷ max) × 100.",
      example: "500 ÷ 700 = 71.4%",
    },
    {
      title: "Weight it 50/50",
      body: "Net score is half ESSLCE and half UAT, so each component is multiplied by 0.5.",
      example: "71.4 × 0.5 = 35.7  ·  80 × 0.5 = 40.0",
    },
    {
      title: "Add them up",
      body: "Sum the two weighted halves to get your net score out of 100.",
      example: "35.7 + 40.0 = 75.7",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12">
      <div className="rounded-3xl bg-ink p-6 text-white sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em] text-white/60">
              <Calculator className="h-4 w-4" /> How it&apos;s calculated
            </span>
            <h2 className="font-accent mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Your net score in three steps
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              Every cutoff on this page is a net score out of 100. It is the
              same formula used in the app&apos;s score calculator — no
              calculator needed.
            </p>
          </div>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-ink">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
              <GraduationCap className="h-4 w-4 text-brand" /> The formula
            </p>
            <p className="font-accent mt-3 text-2xl font-black leading-snug">
              Net = ESSLCE <span className="text-brand">(50%)</span>
              <br />
              <span className="text-muted">+</span> UAT <span className="text-brand">(50%)</span>
            </p>
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
              <div className="h-full w-1/2 bg-brand" title="ESSLCE 50%" />
              <div className="h-full w-1/2 bg-ink" title="UAT 50%" />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-muted">
              <span>ESSLCE / EUEE — 50%</span>
              <span>UAT — 50%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{step.body}</p>
              <p className="mt-3 rounded-lg bg-black/25 px-3 py-2 font-mono text-sm font-semibold tabular-nums text-white">
                {step.example}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <BarChart3 className="h-5 w-5 shrink-0 text-brand" />
          <p className="text-sm leading-6 text-white/80">
            <strong className="text-white">Worked example:</strong> ESSLCE 500/700
            (71.4%) and UAT 80/100 (80%) → net score of{" "}
            <strong className="font-accent text-xl text-brand">75.7</strong>.
            If your ESSLCE was out of 600, normalize using 600 instead of 700.
          </p>
        </div>
      </div>
    </section>
  );
}
