"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner } from "@/components/shared/loading";
import { LockBadge } from "@/components/shared/lock-badge";
import { MaterialReader } from "@/components/depth/material-reader";
import { ReadingProgressBar } from "@/components/depth/reading-progress-bar";
import { TutorPanel } from "@/components/depth/tutor-panel";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { COURSE_UNLOCK_PLAN, TUTOR_UNLOCK_PLAN, planLabel } from "@/lib/utils/plans";
import { cn } from "@/lib/utils/cn";

export default function MaterialPage() {
  const params = useParams<{ materialId: string }>();
  const materialId = params.materialId;
  const { can } = usePlan();
  const hasCourseAccess = can(COURSE_UNLOCK_PLAN);
  const hasTutorAccess = can(TUTOR_UNLOCK_PLAN);
  const [readProgress, setReadProgress] = useState(0);
  const [showTutor, setShowTutor] = useState(false);

  const material = useQuery({
    queryKey: qk.material(materialId),
    queryFn: () => coursesApi.material(materialId),
    enabled: Boolean(materialId),
  });

  if (material.isLoading) return <FullPageSpinner />;

  if (material.isError || !material.data) {
    return (
      <EmptyState
        icon={<Lock />}
        title="Couldn't load this material"
        message="Please go back and try again."
        action={
          <Button asChild variant="outline">
            <Link href="/courses">Back to courses</Link>
          </Button>
        }
      />
    );
  }

  const data = material.data;
  const courseId = data.courseId;
  const locked = data.isLocked || !hasCourseAccess;

  if (locked) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand">
              <Lock className="h-7 w-7" />
            </span>
            <LockBadge plan={COURSE_UNLOCK_PLAN} />
            <h2 className="font-display text-xl font-bold text-ink">
              This material requires {planLabel(COURSE_UNLOCK_PLAN)}
            </h2>
            <p className="max-w-sm text-sm text-muted">
              Upgrade to {planLabel(COURSE_UNLOCK_PLAN)} to unlock premium
              courses, full reading material and the AI tutor.
            </p>
            <Button asChild>
              <Link href="/plans">Upgrade to {planLabel(COURSE_UNLOCK_PLAN)}</Link>
            </Button>
            <Link
              href="/courses"
              className="text-sm font-medium text-muted hover:text-ink"
            >
              Back to courses
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="-mx-4 -my-6 overflow-hidden bg-white sm:-mx-6 lg:-mx-8">
      <ReadingProgressBar value={readProgress} />
      <div className="flex h-14 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4" /> Course
            </Link>
          </Button>
          <span className="hidden max-w-md truncate text-sm font-bold text-ink md:block">{data.title}</span>
        </div>
        {hasTutorAccess ? (
          <Button type="button" size="sm" className="cursor-pointer" onClick={() => setShowTutor((current) => !current)} aria-expanded={showTutor}>
            <Sparkles className="h-4 w-4" /> {showTutor ? "Close AI" : "Prime AI"}
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/plans"><Lock className="h-4 w-4" /> Prime AI</Link>
          </Button>
        )}
      </div>

      <div className={cn("mx-auto grid h-[calc(100vh-8.5rem)] max-w-[1440px] transition-[grid-template-columns] duration-200", showTutor ? "lg:grid-cols-[minmax(0,1fr)_380px]" : "lg:grid-cols-[minmax(0,1fr)_0px]")}>
        <main className="min-w-0 overflow-hidden bg-white">
          <MaterialReader material={data} onProgress={setReadProgress} />
        </main>
        <aside className={cn("fixed inset-0 z-50 min-w-0 overflow-hidden border-l border-line bg-white transition-transform duration-200 lg:static lg:z-auto", showTutor ? "translate-x-0" : "translate-x-full lg:translate-x-0")} aria-hidden={!showTutor}>
          {showTutor ? (
            <div className="relative h-full pt-12 lg:pt-0">
              <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-2 z-10 cursor-pointer lg:hidden" onClick={() => setShowTutor(false)} aria-label="Close Prime AI">
                <X className="h-5 w-5" />
              </Button>
              <TutorPanel materialId={materialId} />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
