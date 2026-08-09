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
import { Calculator, GraduationCap } from "lucide-react";

const govNaturalGeneral = [{ program: "Natural Science", y2024: 64, y2025: 83 }];
const govNaturalFemale = [{ program: "Natural Science", y2024: 78, y2025: 78 }];
const govSocialGeneral = [{ program: "Social Science", y2024: 51, y2025: 63 }];
const govSocialFemale = [{ program: "Social Science", y2024: 57, y2025: 57 }];

const selfSocialBusiness = [
  { program: "Business Admin & IS", y2024: 69, y2025: 76 },
  { program: "Law (LL.B.)", y2024: 70, y2025: 73 },
  { program: "Marketing", y2024: 65, y2025: 70 },
  { program: "Psychology", y2024: 60, y2025: 70 },
  { program: "Economics", y2024: 61, y2025: 69 },
  { program: "Logistics & Supply Chain", y2024: 56, y2025: 69 },
  { program: "Political Science", y2024: 61, y2025: 69 },
  { program: "Management", y2024: 56, y2025: 67 },
  { program: "Accounting & Finance", y2024: 56, y2025: 65 },
  { program: "Broadcast & Multimedia", y2024: 56, y2025: 59 },
  { program: "Public Relations", y2024: 54, y2025: 56 },
  { program: "Sociology & Anthropology", y2024: 54, y2025: 56 },
  { program: "Social Work", y2024: 54, y2025: 56 },
  { program: "Fine Arts", y2024: 54, y2025: 55 },
];

const selfHealthEng = [
  { program: "Medicine", y2024: 79, y2025: 79 },
  { program: "Software Engineering", y2024: 78, y2025: 79 },
  { program: "Computer Science", y2024: 77, y2025: 77 },
  { program: "Dental Medicine (DMD)", y2024: 75, y2025: 78 },
  { program: "Pharmacy", y2024: 68, y2025: 72 },
  { program: "Information Systems", y2024: 63, y2025: 74 },
  { program: "Architecture", y2024: 63, y2025: 73 },
  { program: "Electrical & Computer Eng", y2024: 63, y2025: 70 },
  { program: "Biomedical Engineering", y2024: 63, y2025: 65 },
  { program: "Mechanical Engineering", y2024: 63, y2025: 62 },
  { program: "Medical Laboratory Sciences", y2024: 63, y2025: 61 },
  { program: "Anesthesia", y2024: 63, y2025: 58 },
  { program: "Chemical Engineering", y2024: 63, y2025: 55 },
  { program: "Civil Engineering", y2024: 63, y2025: 53 },
  { program: "Physics", y2024: 63, y2025: 55 },
];

type TrendPoint = { program: string; [key: string]: number | string };
type TrendBar = { dataKey: string; name: string; fill: string };

const bars2024_2025: TrendBar[] = [
  { dataKey: "y2024", name: "2024", fill: "#cdddff" },
  { dataKey: "y2025", name: "2025/26", fill: "#0c5bfe" },
];

function CutoffBarChart({
  data,
  bars,
  title,
  note,
  height = 300,
  maxDomain,
}: {
  data: TrendPoint[];
  bars: TrendBar[];
  title: string;
  note?: string;
  height?: number;
  maxDomain?: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-ink">{title}</p>
        {note ? <p className="text-xs text-muted">{note}</p> : null}
      </div>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -14 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf3" vertical={false} />
            <XAxis
              dataKey="program"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              stroke="#5a647a"
              interval={0}
              angle={-18}
              textAnchor="end"
              height={48}
            />
            <YAxis
              domain={[0, maxDomain ?? 85]}
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
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.fill}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CutoffBarCharts() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <span className="inline-block text-sm font-bold uppercase tracking-[0.18em] text-brand">
          Cutoff trends
        </span>
        <h2 className="font-accent mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
          2024 vs 2025/26 — how cutoffs moved
        </h2>
        <p className="mt-4 text-base leading-7 text-muted">
          Government bands rose sharply, while self-sponsored programs climbed
          department by department.
        </p>
      </div>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
          Government-sponsored
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CutoffBarChart
            data={govNaturalGeneral}
            bars={bars2024_2025}
            title="Natural Science — General"
            height={220}
            maxDomain={90}
          />
          <CutoffBarChart
            data={govNaturalFemale}
            bars={bars2024_2025}
            title="Natural Science — Female"
            height={220}
            maxDomain={90}
          />
          <CutoffBarChart
            data={govSocialGeneral}
            bars={bars2024_2025}
            title="Social Science — General"
            height={220}
            maxDomain={80}
          />
          <CutoffBarChart
            data={govSocialFemale}
            bars={bars2024_2025}
            title="Social Science — Female"
            height={220}
            maxDomain={80}
          />
        </div>
      </div>

      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
          Self-sponsored — by department
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6">
          <CutoffBarChart
            data={selfSocialBusiness}
            bars={bars2024_2025}
            title="Business, law & social sciences"
            height={340}
          />
          <CutoffBarChart
            data={selfHealthEng}
            bars={bars2024_2025}
            title="Health, engineering & natural sciences"
            height={340}
          />
        </div>
      </div>
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
      <div className="rounded-3xl border border-line bg-white p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em] text-brand">
              <Calculator className="h-4 w-4" /> How it&apos;s calculated
            </span>
            <h2 className="font-accent mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
              Your net score in three steps
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Every cutoff on this page is a net score out of 100. It is the
              same formula used in the app&apos;s score calculator — no
              calculator needed.
            </p>
          </div>
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
              <GraduationCap className="h-4 w-4 text-brand" /> The formula
            </p>
            <p className="font-accent mt-3 text-2xl font-black leading-snug text-ink">
              Net = ESSLCE <span className="text-brand">(50%)</span>
              <br />
              <span className="text-muted">+</span> UAT{" "}
              <span className="text-brand">(50%)</span>
            </p>
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
              <div className="h-full w-1/2 bg-brand" title="ESSLCE 50%" />
              <div className="h-full w-1/2 bg-ink/70" title="UAT 50%" />
            </div>
            <div className="mt-2 flex justify-between text-xs font-semibold text-muted">
              <span>ESSLCE / EUEE — 50%</span>
              <span>UAT — 50%</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 font-mono text-sm font-semibold tabular-nums text-ink">
                {step.example}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brand/20 bg-brand-50 p-5">
          <GraduationCap className="h-5 w-5 shrink-0 text-brand" />
          <p className="text-sm leading-6 text-ink">
            <strong>Worked example:</strong> ESSLCE 500/700 (71.4%) and UAT
            80/100 (80%) → net score of{" "}
            <strong className="font-accent text-xl text-brand">75.7</strong>. If
            your ESSLCE was out of 600, normalize using 600 instead of 700.
          </p>
        </div>
      </div>
    </section>
  );
}
