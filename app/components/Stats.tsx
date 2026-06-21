const stats = [
  { value: "10,000+", label: "Practice questions" },
  { value: "500+", label: "Realistic mock exams" },
  { value: "50,000+", label: "Students preparing" },
  { value: "4.8★", label: "Average app rating" },
];

export default function Stats() {
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
      </div>
    </section>
  );
}
