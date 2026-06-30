import Link from "next/link";
import SectionHeading from "./SectionHeading";

type Plan = {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "0",
    period: "birr",
    tagline: "Everything you need to get started, zero risk.",
    features: [
      "Core practice questions",
      "A limited set of mock exams",
      "Basic progress tracking",
      "Web & mobile access",
    ],
    cta: "Start for free",
    href: "/register",
  },
  {
    name: "Pro",
    price: "300",
    period: "birr",
    tagline: "The everyday student's plan — practice without limits.",
    features: [
      "Everything in Free",
      "Unlimited mock exams",
      "Full detailed analytics suite",
      "Estimated net score & weak-spot insights",
      "Leaderboards & exam reports",
    ],
    cta: "Get Pro",
    href: "/register",
    featured: true,
  },
  {
    name: "Pro Plus",
    price: "500",
    period: "birr",
    tagline: "The complete premium experience.",
    features: [
      "Everything in Pro",
      "Full library of premium courses",
      "Detailed explanations",
      "AI tutor on any material",
      "Priority support",
    ],
    cta: "Get Pro Plus",
    href: "/register",
  },
];

function Check({ featured }: { featured?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        featured ? "bg-white/20 text-white" : "bg-brand-50 text-brand"
      }`}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Plans that fit every student"
          description="Three clean tiers, priced for the Ethiopian market. Start free and upgrade whenever you're ready."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                plan.featured
                  ? "bg-brand text-white shadow-2xl shadow-brand/30 lg:-translate-y-4 lg:scale-[1.03]"
                  : "bg-white text-ink border border-line hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  Most popular
                </span>
              )}

              <h3
                className={`text-xl font-bold font-display ${
                  plan.featured ? "text-white" : "text-ink"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-2 text-sm font-medium leading-relaxed ${
                  plan.featured ? "text-white/80" : "text-muted"
                }`}
              >
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black font-accent tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-base font-semibold ${
                    plan.featured ? "text-white/70" : "text-muted"
                  }`}
                >
                  {plan.period}
                  {plan.price !== "0" && (
                    <span className="font-medium"> / month</span>
                  )}
                </span>
              </div>

              <Link
                href={plan.href}
                className={`mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  plan.featured
                    ? "bg-white text-brand hover:bg-white/90 shadow-lg"
                    : "bg-brand text-white hover:bg-brand-600 shadow-md shadow-brand/10"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check featured={plan.featured} />
                    <span
                      className={`text-sm font-medium leading-relaxed ${
                        plan.featured ? "text-white/90" : "text-ink/80"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Local payment note */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4 text-center">
          <svg
            className="h-5 w-5 shrink-0 text-brand"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h18M7 15h2m4 0h4M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
          <p className="text-sm font-medium text-muted">
            Pay with mobile money or bank transfer — just submit your payment
            proof and we&apos;ll activate your plan.
          </p>
        </div>
      </div>
    </section>
  );
}
