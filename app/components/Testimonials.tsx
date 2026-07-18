import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";

const stories = [
  { name: "Saron", focus: "Natural science", quote: "The timed mocks showed me where I was losing minutes, not only marks." },
  { name: "Nahom", focus: "Quantitative reasoning", quote: "I can practice one weak topic, review it, and see the improvement clearly." },
  { name: "Mihret", focus: "Verbal reasoning", quote: "The explanations make review faster than working through scattered answer sheets." },
  { name: "Kaleb", focus: "AAU applicant", quote: "Practice, simulations, and progress tracking finally feel like one study system." },
  { name: "Betelhem", focus: "Social science", quote: "The short practice sets make it easier to stay consistent every day." },
  { name: "Yonas", focus: "Mock-test preparation", quote: "Exam reports helped me separate knowledge gaps from careless mistakes." },
  { name: "Ruth", focus: "UAT preparation", quote: "I know what to study next instead of guessing from one paper to another." },
  { name: "Dawit", focus: "Engineering applicant", quote: "The question navigation and timer made my practice feel much more realistic." },
];

export default function Testimonials() {
  const rows = [stories.slice(0, 4), stories.slice(4)];

  return (
    <section id="testimonials" className="scroll-mt-24 overflow-hidden border-y border-line bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Built around how students actually prepare"
          description="Focused sessions, serious simulations, and useful review without switching between scattered materials."
        />
      </div>

      <div className="mt-12 space-y-4">
        {rows.map((row, rowIndex) => {
          const repeated = [...row, ...row];
          return (
            <div
              key={rowIndex}
              className={`flex w-max gap-4 motion-safe:animate-[testimonial-marquee_34s_linear_infinite] ${
                rowIndex === 1 ? "motion-safe:[animation-direction:reverse]" : ""
              }`}
            >
              {repeated.map((story, index) => (
                <article
                  key={`${story.name}-${index}`}
                  className="w-[300px] shrink-0 rounded-lg border border-line bg-white p-5 sm:w-[360px]"
                >
                  <Quote className="h-5 w-5 text-brand" />
                  <p className="mt-5 text-sm font-medium leading-7 text-ink">
                    “{story.quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-black text-white">
                      {story.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{story.name}</p>
                      <p className="text-xs text-muted">{story.focus}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
