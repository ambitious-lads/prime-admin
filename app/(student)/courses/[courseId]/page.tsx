"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FullPageSpinner } from "@/components/shared/loading";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { CourseMaterial } from "@/lib/api/types";

const TYPE_ICON = {
  video: PlayCircle,
  pdf: FileText,
  reading: BookOpen,
} as const;

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  const course = useQuery({
    queryKey: qk.course(courseId),
    queryFn: () => coursesApi.detail(courseId),
    enabled: Boolean(courseId),
  });

  if (course.isLoading) return <FullPageSpinner />;

  if (course.isError || !course.data) {
    return (
      <EmptyState
        icon={<BookOpen />}
        title="Couldn't load this course"
        message="Please go back and try again."
        action={
          <Link href="/courses" className="text-sm font-medium text-brand hover:underline">
            Back to courses
          </Link>
        }
      />
    );
  }

  const data = course.data;
  const materials = ((data as { materials?: CourseMaterial[] }).materials ?? [])
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const progress = Math.min(100, Math.max(0, data.progressPercentage ?? 0));

  return (
    <div className="space-y-6">
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Courses
      </Link>

      <PageHeader title={data.title} subtitle={data.description ?? undefined} />

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            {formatNumber(data.materialCount)} materials
          </div>
          <div className="w-full max-w-xs space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Your progress</span>
              <span className="font-medium text-ink">{formatPercent(progress)}</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {materials.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="No materials yet"
          message="This course has no published materials."
        />
      ) : (
        <ol className="space-y-3">
          {materials.map((material, i) => (
            <MaterialRow key={material.id} index={i + 1} material={material} />
          ))}
        </ol>
      )}
    </div>
  );
}

function MaterialRow({
  index,
  material,
}: {
  index: number;
  material: CourseMaterial;
}) {
  const Icon = TYPE_ICON[material.type] ?? BookOpen;
  const progress = Math.min(100, Math.max(0, material.progressPercentage ?? 0));

  return (
    <li>
      <Link href={`/courses/material/${material.id}`}>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-muted">
              {index}
            </span>
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {material.title}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <Progress value={progress} className="h-1.5 max-w-[180px]" />
                <span className="text-xs text-muted">{formatPercent(progress)}</span>
              </div>
            </div>
            {material.isLocked ? (
              <Lock className="h-4 w-4 shrink-0 text-amber-500" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            )}
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
