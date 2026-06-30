"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileQuestion, Trash2 } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RowsSkeleton } from "@/components/shared/loading";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QuestionEditor } from "@/components/admin/question-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function QuestionsPage() {
  const qc = useQueryClient();
  const [categoryId, setCategoryId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [setId, setSetId] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: qk.categories,
    queryFn: practiceApi.categories,
  });
  const { data: topics = [] } = useQuery({
    queryKey: qk.topics(categoryId),
    queryFn: () => practiceApi.topics(categoryId),
    enabled: Boolean(categoryId),
  });
  const { data: sets = [] } = useQuery({
    queryKey: qk.sets(topicId),
    queryFn: () => practiceApi.sets(topicId),
    enabled: Boolean(topicId),
  });
  const { data: questions = [], isLoading } = useQuery({
    queryKey: qk.setQuestions(setId),
    queryFn: () => practiceApi.questions(setId),
    enabled: Boolean(setId),
  });

  const remove = useMutation({
    mutationFn: (id: string) => practiceApi.deleteQuestion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.setQuestions(setId) });
      toast.success("Question deleted.");
    },
    onError: toastApiError,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Questions"
        subtitle="Author multiple-choice questions inside a practice set."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <Label className="mb-1.5 block">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(v) => {
              setCategoryId(v);
              setTopicId("");
              setSetId("");
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
          <Select
            value={topicId}
            onValueChange={(v) => {
              setTopicId(v);
              setSetId("");
            }}
            disabled={!categoryId}
          >
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
        <div>
          <Label className="mb-1.5 block">Practice set</Label>
          <Select value={setId} onValueChange={setSetId} disabled={!topicId}>
            <SelectTrigger>
              <SelectValue placeholder="Select set" />
            </SelectTrigger>
            <SelectContent>
              {sets.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!setId ? (
        <EmptyState
          icon={<FileQuestion />}
          title="Select a practice set"
          message="Pick a category, topic, and set to manage its questions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted">
              Questions in this set
            </h2>
            {isLoading ? (
              <RowsSkeleton count={4} />
            ) : questions.length === 0 ? (
              <EmptyState
                icon={<FileQuestion />}
                title="No questions yet"
                message="Add your first question using the editor."
              />
            ) : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <Card key={q.id}>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-ink">
                          <span className="mr-2 text-muted">{i + 1}.</span>
                          {q.questionText}
                        </p>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          }
                          title="Delete question?"
                          description="This permanently removes the question from the set."
                          confirmLabel="Delete"
                          destructive
                          onConfirm={() => remove.mutate(q.id)}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.options?.map((o) => (
                          <Badge
                            key={o.label}
                            variant={
                              o.label === q.correctOption ? "success" : "secondary"
                            }
                          >
                            {o.label}. {o.text}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <QuestionEditor practiceSetId={setId} />
        </div>
      )}
    </div>
  );
}
