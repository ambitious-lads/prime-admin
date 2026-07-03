import Image from "next/image";
import SectionHeading from "./SectionHeading";

const points = [
  "Built around the Ethiopian UAT preparation flow: practice, review, mock, improve.",
  "Free previews let students start immediately while premium content stays protected.",
  "Progress, analytics, courses, notes, and AI tutor access stay tied to one account.",
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="About Prime UAT"
            title="Focused preparation for serious students"
            description="Prime UAT helps Ethiopian students prepare with organized materials, realistic exams, and clear feedback instead of scattered notes and guesswork."
            align="left"
          />
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm font-medium leading-relaxed text-ink sm:text-base">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-lg border border-line bg-surface p-5">
              <p className="font-accent text-3xl font-black text-ink">50k+</p>
              <p className="mt-2 text-sm font-medium text-muted">
                Students preparing with Prime UAT
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-5">
              <p className="font-accent text-3xl font-black text-ink">24/7</p>
              <p className="mt-2 text-sm font-medium text-muted">
                Mobile-first study access
              </p>
            </div>
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface">
              <Image
                src="/images/hero.png"
                alt="Prime UAT learning experience"
                fill
                sizes="(max-width: 1024px) 92vw, 680px"
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
