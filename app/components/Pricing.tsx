import Link from "next/link";
import { PLANS } from "@/lib/utils/plans";
import SectionHeading from "./SectionHeading";

type Plan = {
  name: string;
  price: string;
  previousPrice?: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  discount?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "0",
    period: "birr",
    tagline: "Everything you need to get started, zero risk.",
    features: [...PLANS.free.features],
    cta: "Start for free",
    href: "/register",
  },
  {
    name: "Pro",
    price: String(PLANS.pro.price),
    previousPrice: PLANS.pro.previousPrice != null ? String(PLANS.pro.previousPrice) : undefined,
    period: "birr",
    tagline: "Practice and mock exams without limits.",
    features: [...PLANS.pro.features],
    cta: "Get Pro",
    href: "/register",
    discount: true,
  },
  {
    name: "Pro Plus",
    price: String(PLANS.pro_plus.price),
    previousPrice: PLANS.pro_plus.previousPrice != null ? String(PLANS.pro_plus.previousPrice) : undefined,
    period: "birr",
    tagline: "The complete premium experience.",
    features: [...PLANS.pro_plus.features],
    cta: "Get Pro Plus",
    href: "/register",
    featured: true,
    discount: true,
  },
];

function DiscountBadge() {
  return (
    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#16a34a] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm">
      50% off
    </span>
  );
}

function Check({ featured }: { featured?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        featured ? "bg-brand text-white" : "bg-brand-50 text-brand"
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
    <section id="pricing" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Plans that fit every student"
          description="Three clean tiers, priced for the Ethiopian market. Start free and upgrade whenever you're ready."
        />

        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-lg p-6 sm:p-8 ${
                plan.featured
                  ? "border border-brand/40 bg-brand-50 text-ink shadow-md shadow-brand/10"
                  : "border border-line bg-white text-ink"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-brand/20 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand shadow-sm">
                  Most popular
                </span>
              )}

              {plan.discount && (
                <DiscountBadge />
              )}

              <h3
                className={`text-xl font-bold font-display ${
                  plan.featured ? "text-brand" : "text-ink"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-2 text-sm font-medium leading-relaxed ${
                  plan.featured ? "text-muted" : "text-muted"
                }`}
              >
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-black font-accent tracking-tight">
                  {plan.price}
                </span>
                {plan.previousPrice != null && (
                  <span className="text-lg font-semibold text-muted line-through decoration-muted/60">
                    {plan.previousPrice}
                  </span>
                )}
                <span
                  className={`text-base font-semibold ${
                    plan.featured ? "text-muted" : "text-muted"
                  }`}
                >
                  {plan.period}
                  {plan.price !== "0" && (
                    <span className="font-medium"> one-time</span>
                  )}
                </span>
              </div>

              <Link
                href={plan.href}
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-semibold transition-colors ${
                  plan.featured
                    ? "bg-brand text-white hover:bg-brand-600"
                    : "bg-brand text-white hover:bg-brand-600"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3.5">
                {plan.features.map((feature) => {
                  const isHighlight = feature.includes("7 Days UAT Sprint");
                  return (
                    <li key={feature} className="flex items-start gap-3">
                      {isHighlight ? (
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
                          <svg
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2.5 13.5l2.75-7.5a.75.75 0 01.7-.5H11a.75.75 0 01.72.53l2.34 6.72H17a.75.75 0 01.73.58l.9 4.5c.04.2-.01.4-.14.56a.75.75 0 01-.99.11l-1.8-1.35-1.9 2.35a.75.75 0 01-.6.3h-7.1a.75.75 0 01-.74-.9l.7-5.9a.75.75 0 01.14-.34zm3 4.25l.7-5.1a.75.75 0 011.48.25l-.4 3.1 2.2-2.35.7-.75 2.5 4.4h4.7l.15.9-2.4-1.8.5.05H8.5l-.25-1 .75.7-3 1.9z" />
                          </svg>
                        </span>
                      ) : (
                        <Check featured={plan.featured} />
                      )}
                      <span className="flex items-start gap-1.5">
                        <span
                          className={`text-sm font-medium leading-relaxed ${
                            isHighlight
                              ? "font-bold text-[#15803d]"
                              : plan.featured
                                ? "text-ink/80"
                                : "text-ink/80"
                          }`}
                        >
                          {feature}
                        </span>
                        {isHighlight && (
                          <span className="mt-0.5 shrink-0 rounded-md bg-[#22c55e] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                            New
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
