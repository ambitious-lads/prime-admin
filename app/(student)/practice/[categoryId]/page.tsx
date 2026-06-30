"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Layers } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryTopicsPage() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;

  const { data, isLoading } = useQuery({
    queryKey: qk.topics(categoryId),
    queryFn: () => practiceApi.topics(categoryId),
    enabled: Boolean(categoryId),
  });

  const topics = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topics"
        subtitle="Pick a topic to see its practice sets."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/practice">
              <ArrowLeft className="h-4 w-4" /> Categories
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : topics.length === 0 ? (
        <EmptyState
          icon={<Layers />}
          title="No topics yet"
          message="Topics for this category will appear here once they're added."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <Link
              key={t.id}
              href={`/practice/topic/${t.id}`}
              className="group"
            >
              <Card className="h-full transition-all group-hover:border-brand/40 group-hover:shadow-md">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${t.accentColor ?? "#0c5bfe"}1a`,
                        color: t.accentColor ?? "#0c5bfe",
                      }}
                    >
                      <Layers className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold font-display text-ink">
                      {t.name}
                    </h3>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted">
                    {t.description ?? "Practice sets for this topic."}
                  </p>
                  <p className="text-xs font-medium text-muted">
                    {t.setCount ?? 0} set{(t.setCount ?? 0) === 1 ? "" : "s"}
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
