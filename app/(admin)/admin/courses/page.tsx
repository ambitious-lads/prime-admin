"use client";

import { useQuery } from "@tanstack/react-query";
import { Info, BookOpen, Layers } from "lucide-react";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminCoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: qk.courses,
    queryFn: coursesApi.list,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" subtitle="Premium course library." />

      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4 text-sm text-ink/80">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p>
          Course and material authoring from the web console is coming soon. This
          view lists courses sourced from the backend.
        </p>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="No courses yet"
          message="Courses created on the backend will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id ?? course.courseId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1">{course.title}</span>
                  {course.isLocked ? (
                    <Badge variant="warning">Pro+</Badge>
                  ) : null}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-muted">
                  {course.description || "No description."}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted">
                  <Layers className="h-4 w-4" />
                  {course.materialCount ?? course.materialsCount ?? 0} materials
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
