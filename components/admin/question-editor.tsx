"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Check } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { questionSchema, type QuestionInput } from "@/lib/validation/content";
import { toastApiError } from "@/hooks/use-api-error";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function QuestionEditor({ practiceSetId }: { practiceSetId: string }) {
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      practiceSetId,
      questionText: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
      ],
      correctOption: "A",
      explanation: "",
      orderIndex: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const options = form.watch("options");
  const correctOption = form.watch("correctOption");
  const questionText = form.watch("questionText");

  const create = useMutation({
    mutationFn: (v: QuestionInput) =>
      practiceApi.createQuestion({ ...v, practiceSetId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.setQuestions(practiceSetId) });
      toast.success("Question added.");
      form.reset({
        practiceSetId,
        questionText: "",
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
        ],
        correctOption: "A",
        explanation: "",
        orderIndex: 0,
      });
    },
    onError: toastApiError,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add question</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((v) => create.mutate(v))}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <Label htmlFor="q-text">Question</Label>
            <Textarea id="q-text" rows={3} {...form.register("questionText")} />
            {form.formState.errors.questionText ? (
              <p className="text-xs text-red-600">
                {form.formState.errors.questionText.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Options (mark the correct one)</Label>
            {fields.map((field, i) => {
              const label = options[i]?.label;
              const isCorrect = label === correctOption;
              return (
                <div key={field.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("correctOption", label, {
                        shouldValidate: true,
                      })
                    }
                    aria-label="Mark correct"
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-line text-muted hover:border-brand/40",
                    )}
                  >
                    {isCorrect ? <Check className="h-4 w-4" /> : null}
                  </button>
                  <Input
                    className="w-14"
                    {...form.register(`options.${i}.label`)}
                  />
                  <Input
                    className="flex-1"
                    placeholder={`Option ${label ?? ""}`}
                    {...form.register(`options.${i}.text`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i)}
                    disabled={fields.length <= 2}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              );
            })}
            {form.formState.errors.options ? (
              <p className="text-xs text-red-600">At least two filled options.</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  label: String.fromCharCode(65 + fields.length),
                  text: "",
                })
              }
            >
              <Plus /> Add option
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="q-exp">Explanation (optional)</Label>
            <Textarea id="q-exp" rows={2} {...form.register("explanation")} />
          </div>

          {questionText ? (
            <div className="rounded-xl border border-line bg-surface/50 p-4">
              <p className="text-xs font-semibold text-muted">Student preview</p>
              <p className="mt-2 font-medium text-ink">{questionText}</p>
              <div className="mt-3 space-y-2">
                {options.map((o, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      o.label === correctOption
                        ? "border-emerald-300 bg-emerald-50/60"
                        : "border-line bg-white",
                    )}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold">
                      {o.label}
                    </span>
                    <span>{o.text || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? <Spinner /> : <Plus />} Add question
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
