"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner } from "@/components/shared/loading";
import { LockBadge } from "@/components/shared/lock-badge";
import { MaterialReader } from "@/components/depth/material-reader";
import { ReadingProgressBar } from "@/components/depth/reading-progress-bar";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { usePlan } from "@/hooks/use-plan";
import { COURSE_UNLOCK_PLAN, TUTOR_UNLOCK_PLAN, planLabel } from "@/lib/utils/plans";

export default function MaterialPage() {
  const params = useParams<{ materialId: string }>();
  const materialId = params.materialId;
  const { can } = usePlan();
  const hasCourseAccess = can(COURSE_UNLOCK_PLAN);
  const hasTutorAccess = can(TUTOR_UNLOCK_PLAN);
  const [readProgress, setReadProgress] = useState(0);

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
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
      <ReadingProgressBar value={readProgress} />
      <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 sm:px-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="h-4 w-4" /> Course
          </Link>
        </Button>
        {hasTutorAccess ? (
          <Button asChild size="sm">
            <Link href={`/courses/material/${materialId}/ai`}>
              <Sparkles className="h-4 w-4" /> Prime AI
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/plans"><Lock className="h-4 w-4" /> Prime AI</Link>
          </Button>
        )}
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="h-[calc(100vh-9.5rem)] bg-white">
          <MaterialReader material={data} onProgress={setReadProgress} />
        </div>
      </div>
    </div>
  );
}
