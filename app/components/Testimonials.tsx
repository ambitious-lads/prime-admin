import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { getPublicCommunity } from "@/lib/public-community";

export default async function Testimonials() {
  const community = await getPublicCommunity();
  return (
    <section id="testimonials" className="scroll-mt-24 bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={`Join ${community.displayedCommunitySize.toLocaleString()}+ students preparing with Prime UAT`}
          description="Meet some of the newest learners using Prime UAT for focused practice, simulations, and progress tracking."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {community.recentMembers.map((member) => (
            <article key={member.id} className="rounded-lg border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <Image
                  src={member.avatarUrl}
                  alt={member.displayName}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    {member.displayName}
                  </h3>
                  <p className="text-xs font-medium text-muted">Recently joined</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink/80">
                Preparing with Prime UAT across practice, simulations, courses,
                and progress analytics.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
