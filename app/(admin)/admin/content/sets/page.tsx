"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { ListChecks, Plus } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { setSchema, type SetInput } from "@/lib/validation/content";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { PracticeSet } from "@/lib/api/types";

const difficultyVariant = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
} as const;

export default function SetsPage() {
  const qc = useQueryClient();
  const [categoryId, setCategoryId] = useState("");
  const [topicId, setTopicId] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });
  const { data: topics = [] } = useQuery({
    queryKey: qk.topics(categoryId),
    queryFn: () => practiceApi.topics(categoryId),
    enabled: Boolean(categoryId),
  });
  const { data: sets = [], isLoading } = useQuery({
    queryKey: qk.sets(topicId),
    queryFn: () => practiceApi.sets(topicId),
    enabled: Boolean(topicId),
  });

  const form = useForm({
    resolver: zodResolver(setSchema),
    defaultValues: {
      topicId: "",
      title: "",
      description: "",
      difficulty: "medium",
      estimatedTimeMinutes: 10,
      orderIndex: 0,
    },
  });

  const create = useMutation({
    mutationFn: (v: SetInput) => practiceApi.createSet(v),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: qk.sets(v.topicId) });
      toast.success("Practice set created.");
      form.reset({
        topicId: v.topicId,
        title: "",
        description: "",
        difficulty: "medium",
        estimatedTimeMinutes: 10,
        orderIndex: 0,
      });
    },
    onError: toastApiError,
  });

  function pickTopic(id: string) {
    setTopicId(id);
    form.setValue("topicId", id, { shouldValidate: true });
  }

  const columns = useMemo<ColumnDef<PracticeSet>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-semibold text-ink">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "difficulty",
        header: "Difficulty",
        cell: ({ row }) => {
          const d = row.original.difficulty;
          return d ? (
            <Badge variant={difficultyVariant[d] ?? "secondary"}>{d}</Badge>
          ) : (
            <span className="text-muted">—</span>
          );
        },
      },
      {
        accessorKey: "estimatedTimeMinutes",
        header: "Est. time",
        cell: ({ row }) => (
          <span className="text-sm text-muted">
            {row.original.estimatedTimeMinutes
              ? `${row.original.estimatedTimeMinutes} min`
              : "—"}
          </span>
        ),
      },
      {
        id: "questions",
        header: "Questions",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.questionCount ?? 0}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice sets"
        subtitle="Sets group questions inside a topic."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Category</Label>
              <Select
                value={categoryId}
                onValueChange={(v) => {
                  setCategoryId(v);
                  setTopicId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Topic</Label>
              <Select value={topicId} onValueChange={pickTopic} disabled={!categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {topicId ? (
            <DataTable
              columns={columns}
              data={sets}
              loading={isLoading}
              emptyMessage="No sets in this topic yet."
            />
          ) : (
            <EmptyState
              icon={<ListChecks />}
              title="Select a topic"
              message="Pick a category and topic to view its practice sets."
            />
          )}
          <p className="text-xs text-muted">
            Editing and deleting sets is coming soon.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-5 text-brand" /> Create set
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit((v) => create.mutate(v))}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Topic</Label>
                <Select value={form.watch("topicId")} onValueChange={pickTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.topicId ? (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.topicId.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-title">Title</Label>
                <Input id="s-title" {...form.register("title")} />
                {form.formState.errors.title ? (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.title.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-desc">Description</Label>
                <Textarea id="s-desc" rows={3} {...form.register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <Select
                    value={form.watch("difficulty")}
                    onValueChange={(v) =>
                      form.setValue("difficulty", v as SetInput["difficulty"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-time">Est. minutes</Label>
                  <Input
                    id="s-time"
                    type="number"
                    {...form.register("estimatedTimeMinutes")}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? <Spinner /> : <Plus />} Create set
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
