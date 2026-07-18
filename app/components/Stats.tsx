import { getPublicCommunity } from "@/lib/public-community";

export default async function Stats() {
  const community = await getPublicCommunity();
  const stats = [
    { value: "5,000+", label: "Practice questions" },
    { value: "49+", label: "Realistic mock exams" },
    {
      value: `${community.displayedCommunitySize.toLocaleString()}+`,
      label: "Students preparing",
    },
    { value: "4.8★", label: "Average app rating" },
  ];
  return (
    <section className="relative bg-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <dt className="text-4xl sm:text-5xl font-black font-accent text-white tracking-tight">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm sm:text-base font-medium text-white/70">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 border-t border-white/20 pt-5 text-center text-sm font-semibold text-white md:hidden">
          Join <span className="font-black">{community.displayedCommunitySize.toLocaleString()}+</span> students preparing with Prime UAT
        </p>
      </div>
    </section>
  );
}
