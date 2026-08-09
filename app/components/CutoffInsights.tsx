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
  GraduationCap,
  Landmark,
  Target,
} from "lucide-react";

const trendData = [
  { program: "Medicine", y2024: 79, y2025: 79, y2026: 81 },
  { program: "Software Eng", y2024: 78, y2025: 79, y2026: 80 },
  { program: "Computer Science", y2024: 77, y2025: 77, y2026: 79 },
  { program: "Dental Medicine", y2024: 75, y2025: 78, y2026: 80 },
  { program: "Business Admin & IS", y2024: 69, y2025: 76, y2026: 78 },
  { program: "Information Systems", y2024: 63, y2025: 74, y2026: 76 },
  { program: "Architecture", y2024: 63, y2025: 73, y2026: 75 },
  { program: "Law (LL.B.)", y2024: 70, y2025: 73, y2026: 75 },
  { program: "Pharmacy", y2024: 68, y2025: 72, y2026: 74 },
  { program: "Psychology", y2024: 60, y2025: 70, y2026: 72 },
  { program: "Economics", y2024: 61, y2025: 69, y2026: 71 },
  { program: "Logistics & SCM", y2024: 56, y2025: 69, y2026: 71 },
];

const govBands = [
  {
    label: "Natural Science",
    tier: "General",
    value: 83,
    note: "The highest threshold AAU asks for",
  },
  {
    label: "Natural Science",
    tier: "Female",
    value: 78,
    note: "Female quota is still very competitive",
  },
  {
    label: "Social Science",
    tier: "General",
    value: 63,
    note: "Matches the self-sponsored band",
  },
  {
    label: "Social Science",
    tier: "Female",
    value: 57,
    note: "Female quota eases the bar",
  },
];

const govDepartments = [
  {
    faculty: "Health sciences & medicine",
    rows: [
      { program: "Doctor of Medicine", point: 79 },
      { program: "Dental Medicine (DMD)", point: 78 },
      { program: "Pharmacy", point: 72 },
      { program: "Medical Laboratory Sciences", point: 61 },
      { program: "Anesthesia", point: 58 },
      { program: "Nursing (Child Health)", point: 55 },
      { program: "Medical Radiologic Technology", point: 52 },
    ],
  },
  {
    faculty: "Engineering & computing",
    rows: [
      { program: "Software Engineering", point: 79 },
      { program: "Computer Science", point: 77 },
      { program: "Information Systems", point: 74 },
      { program: "Architecture", point: 73 },
      { program: "Electrical & Computer Engineering", point: 70 },
      { program: "Biomedical Engineering", point: 65 },
      { program: "Mechanical Engineering", point: 62 },
      { program: "Urban Planning & Design", point: 56 },
      { program: "Chemical Engineering", point: 55 },
      { program: "Civil Engineering", point: 53 },
      { program: "Construction Technology & Management", point: 52 },
    ],
  },
  {
    faculty: "Natural sciences",
    rows: [
      { program: "Chemistry", point: 63 },
      { program: "Biology", point: 58 },
      { program: "Physics", point: 55 },
    ],
  },
  {
    faculty: "Business, law & social sciences",
    rows: [
      { program: "Law (LL.B.)", point: 73 },
      { program: "Accounting & Finance", point: 65 },
      { program: "Political Science", point: 60 },
      { program: "Economics", point: 58 },
      { program: "Psychology", point: 56 },
      { program: "Social Work", point: 56 },
      { program: "Sociology & Anthropology", point: 56 },
      { program: "Management", point: 55 },
      { program: "Public Relations & Strategic Communication", point: 55 },
      { program: "Fine Arts", point: 55 },
    ],
  },
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

export function CutoffByDepartment() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em] text-brand">
          <Landmark className="h-4 w-4" /> By department & sponsorship
        </span>
        <h2 className="font-accent mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
          Cutoffs for every department — government &amp; self-sponsored
        </h2>
        <p className="mt-4 text-base leading-7 text-muted">
          Government-sponsored places are free and come with a stipend, so they
          are the most sought after. See where each department&apos;s bar sits
          for both routes.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <GraduationCap className="h-4 w-4 text-brand" />
            Government-sponsored thresholds — 2025/26
          </p>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand">
            Free tuition + stipend
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {govBands.map((band) => (
            <div
              key={`${band.label}-${band.tier}`}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  {band.label}
                </p>
                <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-brand ring-1 ring-line">
                  {band.tier}
                </span>
              </div>
              <p className="font-accent mt-3 text-4xl font-black tracking-tight text-brand">
                {band.value}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">{band.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="border-b border-line bg-surface px-5 py-4 sm:px-7">
          <p className="text-sm font-bold text-ink">
            Government cutoffs by department
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Most recent department-level release. If a department is not listed
            below, check the general bands above.
          </p>
        </div>
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-2">
          {govDepartments.map((group) => (
            <div key={group.faculty}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                {group.faculty}
              </p>
              <div className="mt-3 divide-y divide-line border-t border-line">
                {group.rows.map((row) => (
                  <div
                    key={row.program}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <span className="pr-3 text-sm font-medium text-ink">
                      {row.program}
                    </span>
                    <span className="text-lg font-black tabular-nums text-brand">
                      {row.point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            <BarChart3 className="h-4 w-4 text-brand" />
            How cutoffs changed — 2024 → 2025/26 → 2026/27
          </p>
          <p className="text-xs text-muted">
            2026/27 bars are the midpoint of the predicted range
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 8, right: 8, bottom: 8, left: -14 }}>
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
                domain={[0, 85]}
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
              <Bar dataKey="y2024" name="2024" fill="#cdddff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2025" name="2025/26" fill="#0c5bfe" radius={[4, 4, 0, 0]} />
              <Bar dataKey="y2026" name="2026/27 proj" fill="#0a49cb" radius={[4, 4, 0, 0]} />
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
        <div className="grid grid-cols-[1fr_88px_110px] gap-2 border-b border-line bg-surface px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink sm:grid-cols-[1fr_120px_140px] sm:px-6">
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
