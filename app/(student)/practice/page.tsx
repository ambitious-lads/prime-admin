"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Card, CardContent } from "@/components/ui/card";

export default function PracticePage() {
  const { data, isLoading } = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });

  const categories = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice"
        subtitle="Choose a category and sharpen your skills."
      />

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Dumbbell />}
          title="No categories yet"
          message="Practice categories will appear here once they're added."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} href={`/practice/${c.id}`} className="group">
              <Card className="h-full transition-all group-hover:border-brand/40 group-hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${c.accentColor ?? "#0c5bfe"}1a`,
                        color: c.accentColor ?? "#0c5bfe",
                      }}
                    >
                      <Dumbbell className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold font-display text-ink">
                      {c.name}
                    </h3>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">
                    {c.description ?? "Practice questions in this category."}
                  </p>
                  <p className="text-xs font-medium text-muted">
                    {c.topicCount ?? 0} topic{(c.topicCount ?? 0) === 1 ? "" : "s"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
