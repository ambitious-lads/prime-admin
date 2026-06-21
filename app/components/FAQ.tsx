import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "Do I need to install the app to use Prime?",
    a: "No. The web version is fully featured — just sign up and start studying in your browser. The mobile app is there if you prefer studying on your phone, and both share the same account.",
  },
  {
    q: "What does the Free plan include?",
    a: "Free gives you access to core practice questions and a limited set of mock exams, plus basic progress tracking — enough to feel the value before upgrading.",
  },
  {
    q: "How do I pay for Pro or Pro Plus?",
    a: "Prime is built for how Ethiopians pay. Subscribe by submitting a payment proof — a screenshot of a mobile-money or bank transfer — and an admin verifies and activates your subscription.",
  },
  {
    q: "What is the single-device lock?",
    a: "To keep your subscription secure, a paid account binds to one device. Logging in on a second device is rejected. If you change phones or move to the web, a secure transfer flow moves your account with you.",
  },
  {
    q: "Which exam does Prime prepare me for?",
    a: "Prime is built specifically for the Ethiopian University Entrance Exam, with curated questions, mock exams, and courses aligned to the curriculum.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-surface py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked questions"
        />

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-line bg-white px-6 py-5 transition-colors duration-200 hover:border-brand/30 open:border-brand/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-ink marker:content-none">
                {faq.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand transition-transform duration-300 group-open:rotate-45">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-sm sm:text-base text-muted font-medium leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
