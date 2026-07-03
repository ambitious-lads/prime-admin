import Image from "next/image";
import SectionHeading from "./SectionHeading";

const testimonials = [
  {
    name: "Student Sarah",
    role: "Natural science student",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=240&q=80",
    quote:
      "The topic practice made my weak areas obvious. I stopped guessing what to study next.",
  },
  {
    name: "Student Michael",
    role: "UAT candidate",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80",
    quote:
      "Mock tests feel close to the real pressure. The question navigation helped me manage time better.",
  },
  {
    name: "Student Emily",
    role: "Social science student",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80",
    quote:
      "Courses and explanations are straight to the point. I can review on my phone without carrying notes.",
  },
  {
    name: "Student Daniel",
    role: "Grade 12 student",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80",
    quote:
      "The AI tutor helps when I get stuck, but the daily limits keep me focused on studying, not chatting.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Student results"
          title="Join 50,000+ students preparing with Prime UAT"
          description="Focused practice, clear reports, and mobile-first studying for students preparing for the Ethiopian University Entrance Exam."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-muted">{item.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink/80">
                {item.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
