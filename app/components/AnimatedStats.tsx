"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  label: string;
  suffix: string;
  decimals?: number;
};

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-brand">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:py-16 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 text-center">
          {stats.map((stat) => <AnimatedStat key={stat.label} {...stat} visible={visible} />)}
        </dl>
      </div>
    </section>
  );
}

function AnimatedStat({ value, label, suffix, decimals = 0, visible }: Stat & { visible: boolean }) {
  return <div className="flex flex-col items-center"><dt className="text-3xl sm:text-5xl font-black font-accent text-white tracking-tight"><CountUp value={value} suffix={suffix} decimals={decimals} visible={visible} /></dt><dd className="mt-1.5 text-xs sm:mt-2 sm:text-base font-medium text-white/70">{label}</dd></div>;
}

function CountUp({ value, suffix, decimals = 0, visible }: { value: number; suffix: string; decimals?: number; visible: boolean }) {
  const [current, setCurrent] = useState(0);
  const formatted = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    if (!visible) return;
    const duration = 1150;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(value * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);

  return <>{formatted.format(current)}{suffix}</>;
}
