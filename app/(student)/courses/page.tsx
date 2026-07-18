"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { LockBadge } from "@/components/shared/lock-badge";
import { CardGridSkeleton } from "@/components/shared/loading";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { COURSE_UNLOCK_PLAN } from "@/lib/utils/plans";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import type { Course } from "@/lib/api/types";

export default function CoursesPage() {
  const router = useRouter();
  const { can } = usePlan();
  const hasCourseAccess = can(COURSE_UNLOCK_PLAN);

  const courses = useQuery({ queryKey: qk.courses, queryFn: coursesApi.list });

  return (
    <div className="space-y-6">

      {courses.isLoading ? (
        <CardGridSkeleton count={6} />
      ) : courses.isError ? (
        <EmptyState
          icon={<GraduationCap />}
          title="Couldn't load courses"
          message="Please refresh and try again."
        />
      ) : (courses.data ?? []).length === 0 ? (
        <EmptyState
          icon={<GraduationCap />}
          title="No courses yet"
          message="Premium courses will appear here once published."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(courses.data ?? []).map((course) => (
            <CourseCard
              key={course.id ?? course.courseId}
              course={course}
              locked={course.isLocked || !hasCourseAccess}
              onLockedClick={() => router.push("/plans")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  locked,
  onLockedClick,
}: {
  course: Course;
  locked: boolean;
  onLockedClick: () => void;
}) {
  const progress = Math.min(100, Math.max(0, course.progressPercentage ?? 0));
  const courseId = course.id ?? course.courseId;
  const materialCount = course.materialCount ?? course.materialsCount ?? 0;

  const inner = (
    <Card className="group h-full overflow-hidden border-line transition-all duration-200 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[16/9] w-full bg-brand-50">
        {course.coverUrl ? (
          <Image
            src={course.coverUrl}
            alt={course.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
) : (
          <div className="flex h-full items-center justify-center text-brand">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
        {locked && (
          <div className="absolute right-3 top-3">
            <LockBadge plan={COURSE_UNLOCK_PLAN} />
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-5">
        <h3 className="line-clamp-1 font-display text-base font-bold text-ink">
          {course.title}
        </h3>
        {course.description && (
          <p className="line-clamp-2 text-sm text-muted">{course.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Layers className="h-3.5 w-3.5" />
          {formatNumber(materialCount)} materials
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Progress</span>
            <span className="font-medium text-ink">{formatPercent(progress)}</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  );

  if (locked) {
    return (
      <button type="button" onClick={onLockedClick} className="text-left">
        {inner}
      </button>
    );
  }

  return <Link href={`/courses/${courseId}`}>{inner}</Link>;
}
