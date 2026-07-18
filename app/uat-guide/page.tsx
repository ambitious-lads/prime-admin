import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  Check,
  Clock3,
  ExternalLink,
  FileCheck2,
  Laptop,
  MapPin,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CardSpotlight } from "@/components/aceternity/card-spotlight";

const contents = [
  ["overview", "What the UAT is"],
  ["admission", "How admission works"],
  ["aau", "Why students choose AAU"],
  ["subjects", "What the test covers"],
  ["test-day", "Registration and test day"],
  ["competition", "How competitive it is"],
  ["prepare", "How to prepare"],
  ["sources", "Official and unofficial information"],
] as const;

const testedAreas = [
  {
    number: "01",
    title: "Verbal reasoning",
    description:
      "Tests how accurately you read, interpret, and reason with written English.",
    topics: [
      "Reading comprehension",
      "Vocabulary and word relationships",
      "Grammar and sentence structure",
      "Sentence completion",
      "Verbal logic",
    ],
    icon: BookOpen,
    tone: "bg-indigo-600 text-white",
    glow: "rgba(165,180,252,0.35)",
  },
  {
    number: "02",
    title: "Quantitative reasoning",
    description:
      "Measures mathematical reasoning, numerical fluency, and interpretation rather than only memorized formulas.",
    topics: [
      "Arithmetic and percentages",
      "Ratios and proportions",
      "Basic algebra",
      "Probability and statistics",
      "Geometry and graph interpretation",
    ],
    icon: Calculator,
    tone: "bg-rose-500 text-white",
    glow: "rgba(254,205,211,0.35)",
  },
];

const preparationPlan = [
  {
    title: "Build the foundation",
    time: "Weeks 1-2",
    text: "Review essential grammar, vocabulary, arithmetic, algebra, ratios, percentages, and common reasoning patterns.",
  },
  {
    title: "Practice by skill",
    time: "Weeks 3-4",
    text: "Work topic by topic. Record every repeated mistake and identify whether it came from knowledge, reasoning, or rushing.",
  },
  {
    title: "Add time pressure",
    time: "Weeks 5-6",
    text: "Move from untimed accuracy to short timed sets. Learn when to continue, skip, and return.",
  },
  {
    title: "Simulate and review",
    time: "Final weeks",
    text: "Take full simulations in a quiet environment, then spend as much time reviewing the attempt as taking it.",
  },
];

export default function UatGuidePage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="relative z-0">
        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-5 py-20 text-center sm:min-h-[500px] sm:px-8 lg:px-12">
            <div className="max-w-4xl">
              <h1 className="font-accent text-4xl font-black leading-[1.04] text-black sm:text-6xl lg:text-7xl">
                Undergraduate Admission Test
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                Understand how the AAU UAT works, what it may assess, how
                admission is considered, and how to prepare with a focused,
                evidence-based plan.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-12 lg:py-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-500">
                On this page
              </p>
              <nav className="mt-4 border-l border-black/15">
                {contents.map(([href, label]) => (
                  <Link
                    key={href}
                    href={`#${href}`}
                    className="block border-l-2 border-transparent py-2 pl-4 text-sm text-neutral-600 transition-colors hover:border-black hover:text-black"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0 max-w-4xl">
            <section id="overview" className="scroll-mt-28 border-b border-black/10 pb-14">
              <SectionNumber value="01" />
              <h2 className="mt-3 text-3xl font-black">What is the UAT?</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-neutral-700">
                <p>
                  The Undergraduate Admission Test, often shortened to UAT, is
                  used by Addis Ababa University as part of its undergraduate
                  admission process. It is separate from Ethiopia&apos;s Grade 12
                  national entrance examination.
                </p>
                <p>
                  The national examination reflects broader secondary-school
                  achievement. The UAT is intended to provide AAU with an
                  additional measure of an applicant&apos;s reasoning ability,
                  problem solving, language use, and readiness for competitive
                  university study.
                </p>
                <p>
                  The exact format, schedule, eligibility requirements, fees, and
                  weighting can change between admission rounds. Applicants
                  should treat official AAU announcements as the final authority.
                </p>
              </div>
              <Note>
                UAT and UGAT are sometimes used in public discussions to refer to
                the university&apos;s undergraduate admission test. Always follow
                the terminology used in the current official announcement.
              </Note>
              <div className="mt-8 grid overflow-hidden rounded-lg border border-line sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["100", "multiple-choice questions"],
                  ["55", "verbal reasoning items"],
                  ["45", "quantitative reasoning items"],
                  ["120", "minutes in total"],
                ].map(([value, label]) => (
                  <div key={label} className="border-b border-line p-5 last:border-b-0 sm:border-r sm:last:border-r-0">
                    <p className="text-3xl font-black tabular-nums">{value}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="admission" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="02" />
              <h2 className="mt-3 text-3xl font-black">How admission works</h2>
              <p className="mt-6 text-base leading-8 text-neutral-700">
                A strong UAT result matters, but admission is not determined by
                one number in isolation. AAU states that undergraduate admission
                considers the national entrance examination result, the
                university admission test, the applicant&apos;s program choice,
                and the capacity available in that program.
              </p>
              <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
                {[
                  ["National result", "Your Grade 12 university entrance performance."],
                  ["UAT performance", "Your result on AAU's additional admission assessment."],
                  ["Program choice", "The departments and programs you apply to."],
                  ["Available capacity", "The number of seats and applicant competition in each program."],
                ].map(([title, text], index) => (
                  <div key={title} className="grid gap-3 py-5 sm:grid-cols-[52px_180px_1fr]">
                    <span className="text-sm font-black text-neutral-400">0{index + 1}</span>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm leading-6 text-neutral-600">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="aau" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="03" />
              <h2 className="mt-3 text-3xl font-black">Why students choose AAU</h2>
              <p className="mt-6 text-base leading-8 text-neutral-700">
                Addis Ababa University is Ethiopia&apos;s oldest public university
                and is located in the country&apos;s political, commercial, and
                institutional center. That combination shapes both its appeal and
                its competitive environment.
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-3">
                <Reason
                  icon={MapPin}
                  title="Location"
                  text="Access to government institutions, hospitals, companies, NGOs, research centers, and internship opportunities in Addis Ababa."
                />
                <Reason
                  icon={Building2}
                  title="Academic reach"
                  text="A broad range of undergraduate and postgraduate programs, multiple campuses, research activity, and established professional schools."
                />
                <Reason
                  icon={BookOpen}
                  title="Specialized institutions"
                  text="Recognized institutions in health sciences, engineering, law, business, social sciences, and other fields."
                />
              </div>

              <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-black">Common advantages</h3>
                  <BulletList
                    items={[
                      "A large alumni and professional network",
                      "Exposure to employers and national institutions",
                      "Research facilities and academic communities",
                      "Student organizations and campus activities",
                      "Competition that can encourage stronger performance",
                    ]}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black">Real pressures to expect</h3>
                  <BulletList
                    items={[
                      "Heavy coursework and frequent assessment",
                      "Competitive entry into high-demand programs",
                      "Limited seats relative to applicant demand",
                      "The need for independent time management",
                      "Academic pressure in demanding departments",
                    ]}
                  />
                </div>
              </div>
            </section>

            <section id="subjects" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="04" />
              <h2 className="mt-3 text-3xl font-black">What the UAT may test</h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-700">
                Candidate reports and preparation guidance commonly emphasize
                general aptitude. That means understanding the question,
                selecting an efficient method, and working accurately under time
                pressure can matter more than memorizing large amounts of content.
              </p>
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {testedAreas.map(({ number, title, description, topics, icon: Icon, tone, glow }) => (
                  <CardSpotlight
                    key={title}
                    color={glow}
                    className={`${tone} min-h-full rounded-lg p-6 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/60">{number}</span>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-10 text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/80">
                      {description}
                    </p>
                    <ul className="mt-6 space-y-2 border-t border-white/20 pt-5">
                      {topics.map((topic) => (
                        <li key={topic} className="flex gap-2 text-sm text-white/90">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardSpotlight>
                ))}
              </div>
            </section>

            <section id="test-day" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="05" />
              <h2 className="mt-3 text-3xl font-black">Registration and test day</h2>
              <p className="mt-6 text-base leading-8 text-neutral-700">
                The 2024 information booklet describes a digitally administered
                exam coordinated by AAU&apos;s Institute of Educational Research
                Testing Center. Candidates sit in designated computer labs under
                standardized conditions.
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {[
                  {
                    icon: FileCheck2,
                    title: "Register and pay",
                    text: "Apply through the AAU portal, select an available test location, complete the stated payment, and download the UAT admission ticket.",
                  },
                  {
                    icon: TimerReset,
                    title: "Two timed sections",
                    text: "Verbal and quantitative reasoning receive 60 minutes each. The system closes a section when its allocated time ends.",
                  },
                  {
                    icon: Laptop,
                    title: "Digital testing",
                    text: "The exam is delivered through AAU's testing portal in designated labs using the university's network infrastructure.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Identity and integrity",
                    text: "Bring valid identification and the admission ticket. Follow invigilator instructions and use only explicitly authorized materials.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <article key={title} className="bg-white p-6">
                    <Icon className="h-5 w-5 text-brand" />
                    <h3 className="mt-5 font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
                  </article>
                ))}
              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="font-black">Bring and prepare</h3>
                  <BulletList
                    items={[
                      "A valid identification document",
                      "Your downloaded UAT admission ticket",
                      "A permitted basic four-function calculator",
                      "A pen or pencil for the supplied rough-work sheet",
                      "Arrival before the reporting time on your ticket",
                    ]}
                  />
                </div>
                <div>
                  <h3 className="font-black">Do not bring into the room</h3>
                  <BulletList
                    items={[
                      "Phones, tablets, smart watches, or laptops",
                      "Headphones, Bluetooth, or communication devices",
                      "Books, notes, handouts, or personal scratch paper",
                      "Scientific or programmable calculators",
                      "Formula sheets or unauthorized measuring aids",
                    ]}
                  />
                </div>
              </div>

              <Note>
                Applicants who need disability accommodations should disclose
                their needs during the application process and coordinate with
                the assigned testing center. The booklet states that visually
                impaired candidates use the JAWS screen reader.
              </Note>

              <div className="mt-8 border-t border-line pt-8">
                <h3 className="text-lg font-black">Results and verification</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  The booklet says candidates may receive a raw score, T-score,
                  and percentile rank. The passing score is announced separately.
                  Digital result certificates include a QR code or verification
                  link so the certificate can be authenticated.
                </p>
              </div>
            </section>

            <section id="competition" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="06" />
              <h2 className="mt-3 text-3xl font-black">How competitive is it?</h2>
              <p className="mt-6 text-base leading-8 text-neutral-700">
                Competition depends on the number of qualified applicants, their
                results, the programs they select, and the seats available.
                High-demand programs such as medicine, engineering, computer
                science, business, and law can require stronger relative
                performance.
              </p>
              <div className="mt-8 border-l-4 border-black bg-neutral-50 px-6 py-5">
                <p className="font-bold">There is no universal &quot;safe score.&quot;</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  A score should be understood in the context of that admission
                  round, applicant pool, program demand, official weighting, and
                  capacity. Avoid relying on unsupported cutoff claims circulated
                  through social media.
                </p>
              </div>
            </section>

            <section id="prepare" className="scroll-mt-28 border-b border-black/10 py-14">
              <SectionNumber value="07" />
              <h2 className="mt-3 text-3xl font-black">A practical preparation plan</h2>
              <div className="relative mt-8 space-y-3">
                <div className="absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-indigo-500 via-rose-500 to-emerald-500" />
                {preparationPlan.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative grid gap-4 rounded-lg border border-black/10 bg-white py-5 pl-16 pr-5 transition-transform hover:translate-x-1 sm:grid-cols-[160px_1fr]"
                  >
                    <span
                      className={`absolute left-4 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white ${
                        ["bg-indigo-600", "bg-violet-500", "bg-rose-500", "bg-emerald-500"][index]
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-black">{step.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {step.time}
                      </p>
                    </div>
                    <p className="text-sm leading-7 text-neutral-600">{step.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                  href="/register"
                  className="group flex items-center justify-between border border-black bg-black px-5 py-4 text-sm font-bold text-white"
                >
                  Start structured practice
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/#mock-tests"
                  className="group flex items-center justify-between border border-black px-5 py-4 text-sm font-bold text-black"
                >
                  Explore simulations
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>

            <section id="sources" className="scroll-mt-28 pt-14">
              <SectionNumber value="08" />
              <h2 className="mt-3 text-3xl font-black">Official and unofficial information</h2>
              <p className="mt-6 text-base leading-8 text-neutral-700">
                Telegram channels, tutors, past candidates, and preparation
                platforms can provide useful practice. They should not be treated
                as the final source for application dates, eligibility, fees,
                score weighting, test location, or admission decisions unless AAU
                confirms the information.
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="border-t-2 border-black pt-5">
                  <h3 className="font-black">Use official sources for</h3>
                  <BulletList
                    items={[
                      "Application opening and closing dates",
                      "Eligibility and required documents",
                      "Current application and test fees",
                      "Exam schedule and location",
                      "Results and admission decisions",
                    ]}
                  />
                </div>
                <div className="border-t-2 border-neutral-300 pt-5">
                  <h3 className="font-black">Use preparation sources for</h3>
                  <BulletList
                    items={[
                      "Practice questions and explanations",
                      "Study planning and revision",
                      "Timed simulation experience",
                      "Candidate perspectives",
                      "Extra learning resources",
                    ]}
                  />
                </div>
              </div>

              <div className="mt-10 border border-black/15 p-6">
                <h3 className="text-lg font-black">Current official notes</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  AAU&apos;s current undergraduate FAQ says applicants pay an
                  application fee and a separate UAT fee, and that a UAT result
                  applies to one application round. These details can change, so
                  confirm the current amount and instructions directly with AAU
                  before payment or application.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="https://portal.aau.edu.et/Web/Answers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
                  >
                    AAU undergraduate FAQ
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="https://www.aau.edu.et/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4"
                  >
                    Addis Ababa University
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionNumber({ value }: { value: string }) {
  return <p className="text-xs font-black tracking-[0.18em] text-neutral-400">{value}</p>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 border-y border-black/10 py-5 text-sm leading-7 text-neutral-600">
      <span className="mr-2 font-black text-black">Note.</span>
      {children}
    </div>
  );
}

function Reason({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t-2 border-black pt-5">
      <Icon className="h-5 w-5" />
      <h3 className="mt-4 font-black">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p>
    </div>
  );
}

function BulletList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ul className={compact ? "space-y-2" : "mt-4 space-y-3"}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-600">
          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-black" />
          {item}
        </li>
      ))}
    </ul>
  );
}
