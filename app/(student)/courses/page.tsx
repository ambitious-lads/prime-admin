"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers3,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { openSubscriptionPrompt } from "@/components/student/subscription-prompt-modal";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { cn } from "@/lib/utils/cn";
import type { Course } from "@/lib/api/types";

const FILTERS = ["All", "Verbal", "Quantitative", "Analytical"] as const;

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return `rgba(45, 91, 255, ${alpha})`;
  const value = Number.parseInt(clean, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState<(typeof FILTERS)[number]>("All");
  const courses = useQuery({ queryKey: qk.courses, queryFn: coursesApi.list });
  const filtered = useMemo(() => (courses.data ?? []).filter((course) => {
    if (activeCategory === "All") return true;
    const category = String(course.category ?? "").toLowerCase();
    const label = String(course.categoryLabel ?? "").toLowerCase();
    return category === activeCategory.toLowerCase() || label === activeCategory.toLowerCase();
  }), [activeCategory, courses.data]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto border-b border-line pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((filter) => (
          <button key={filter} type="button" onClick={() => setActiveCategory(filter)} className={cn("h-9 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-bold transition-colors", activeCategory === filter ? "bg-ink text-white" : "bg-surface text-ink hover:bg-brand-50")}>{filter}</button>
        ))}
      </div>

      {courses.isLoading ? (
        <CardGridSkeleton count={4} />
      ) : courses.isError ? (
        <EmptyState icon={<GraduationCap />} title="Couldn't load courses" message="Please refresh and try again." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<BookOpen />} title="No courses found" message="There are no courses in this category yet." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((course) => <CourseCard key={course.id ?? course.courseId} course={course} />)}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const courseId = course.id ?? course.courseId;
  const color = course.color || "#2D5BFF";
  const progress = Math.min(100, Math.max(0, course.progressPercentage ?? 0));
  const total = course.materialsCount ?? course.materialCount ?? 0;
  const videos = course.videoCount ?? 0;
  const notes = course.notesCount ?? course.pdfCount ?? 0;
  const locked = Boolean(course.isLocked);
  const card = (
    <article className="h-full rounded-2xl border bg-white p-4 shadow-[0_5px_18px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5" style={{ borderColor: hexToRgba(color, 0.18) }}>
      <div className="flex items-start gap-3.5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border" style={{ color, borderColor: hexToRgba(color, 0.16), backgroundColor: hexToRgba(color, 0.09) }}>
          {locked ? <LockKeyhole className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h2 className="min-w-0 flex-1 text-base font-black leading-6 text-ink sm:text-lg">{course.title}</h2>
            {course.isPremium ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black" style={{ color, backgroundColor: hexToRgba(color, 0.1) }}>Pro Plus</span> : null}
          </div>
          {course.description ? <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted">{course.description}</p> : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Meta icon={<Layers3 />} text={`${total} lessons`} color={color} />
        <Meta icon={<PlayCircle />} text={`${videos} videos`} color={color} />
        <Meta icon={<FileText />} text={`${notes} notes`} color={color} />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold"><span className="text-muted">Course progress</span><span style={{ color }}>{progress}%</span></div>
        <Progress value={progress} className="h-1.5 [&>div]:bg-[var(--course-color)]" style={{ "--course-color": color } as React.CSSProperties} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="truncate text-xs font-black uppercase text-muted">{course.categoryLabel || course.category || "UAT course"}</span>
        <span className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black" style={{ color, backgroundColor: hexToRgba(color, 0.09) }}>
          {locked ? <LockKeyhole className="h-3.5 w-3.5" /> : null}{locked ? "Upgrade" : "Open"}<ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );

  if (locked) {
    return <button type="button" className="h-full cursor-pointer text-left" onClick={() => openSubscriptionPrompt({ requiredPlan: course.minPlan === "pro" ? "pro" : "pro_plus", title: `Unlock ${course.title}`, description: "Upgrade to unlock every lesson in this course, track your reading progress, and use the course AI tutor." })}>{card}</button>;
  }
  return <Link href={`/courses/${courseId}`} className="h-full">{card}</Link>;
}

function Meta({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-muted [&_svg]:h-3.5 [&_svg]:w-3.5" style={{ color }}>{icon}<span className="text-muted">{text}</span></span>;
}
