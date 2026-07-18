"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit3, FileQuestion, Plus, Save, Trash2 } from "lucide-react";
import { adminExamsApi, examsApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import { DataTable } from "@/components/shared/data-table";
import { Spinner } from "@/components/shared/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Exam, ExamAdminQuestion, ExamEditorInput, ExamQuestionEditorInput, PlanKey, QuestionOption } from "@/lib/api/types";

const emptyExam: ExamEditorInput = {
  title: "",
  type: "Full Mock",
  category: "",
  durationMinutes: 120,
  description: "",
  difficulty: "Medium",
  isRecommended: false,
  minPlan: "free",
  scheduledAt: null,
  primaryColor: "#0C5BFE",
  icon: "clipboard-check",
};

const emptyQuestion: ExamQuestionEditorInput = {
  text: "",
  passage: "",
  options: ["A", "B", "C", "D"].map((label) => ({ label, text: "" })),
  correctOption: "A",
  explanation: "",
  topic: "General",
  difficulty: "Medium",
  marks: 1,
  orderIndex: 0,
};

export default function AdminExamsPage() {
  const qc = useQueryClient();
  const [editingExam, setEditingExam] = useState<Exam | null | undefined>();
  const [questionExam, setQuestionExam] = useState<Exam | null>(null);
  const { data: exams = [], isLoading } = useQuery({
    queryKey: qk.exams({ tab: "latest" }),
    queryFn: () => examsApi.list({ tab: "latest" }),
  });

  const removeExam = useMutation({
    mutationFn: adminExamsApi.remove,
    onSuccess: () => {
      toast.success("Exam deleted");
      qc.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: toastApiError,
  });

  const columns = useMemo<ColumnDef<Exam>[]>(() => [
    {
      accessorKey: "title",
      header: "Exam",
      cell: ({ row }) => <div><p className="font-semibold text-ink">{row.original.title}</p><p className="mt-0.5 text-xs text-muted">{row.original.type ?? "Mock exam"} · {row.original.category || "General"}</p></div>,
    },
    { accessorKey: "difficulty", header: "Difficulty", cell: ({ row }) => <Badge variant="secondary">{row.original.difficulty ?? "Medium"}</Badge> },
    { accessorKey: "questionCount", header: "Questions", cell: ({ row }) => <span className="tabular-nums">{row.original.questionCount}</span> },
    { accessorKey: "durationMinutes", header: "Time", cell: ({ row }) => <span className="text-sm text-muted">{row.original.durationMinutes} min</span> },
    { id: "access", header: "Access", cell: ({ row }) => <Badge variant={row.original.isPremium ? "warning" : "secondary"}>{row.original.minPlan === "pro_plus" ? "Pro Plus" : row.original.isPremium ? "Pro" : "Free"}</Badge> },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" title="Manage questions" onClick={() => setQuestionExam(row.original)}><FileQuestion /></Button>
        <Button variant="ghost" size="icon" title="Edit exam" onClick={() => setEditingExam(row.original)}><Edit3 /></Button>
        <Button variant="ghost" size="icon" title="Delete exam" disabled={removeExam.isPending} onClick={() => { if (window.confirm(`Delete ${row.original.title}? This is only allowed before students attempt it.`)) removeExam.mutate(row.original.id); }}><Trash2 className="text-red-500" /></Button>
      </div>,
    },
  ], [removeExam]);

  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted">Create exams, control timing and access, and author every question.</p>
      <Button onClick={() => setEditingExam(null)}><Plus /> New exam</Button>
    </div>
    <DataTable columns={columns} data={exams} loading={isLoading} emptyMessage="No exams found." />
    <ExamDialog exam={editingExam} onClose={() => setEditingExam(undefined)} />
    <QuestionManager exam={questionExam} onClose={() => setQuestionExam(null)} />
  </div>;
}

function ExamDialog({ exam, onClose }: { exam: Exam | null | undefined; onClose: () => void }) {
  const qc = useQueryClient();
  const open = exam !== undefined;
  const [form, setForm] = useState<ExamEditorInput>(emptyExam);
  const formKey = exam?.id ?? (exam === null ? "new" : "closed");

  useEffect(() => {
    if (!open) return;
    setForm(exam ? {
      title: exam.title,
      type: exam.type ?? "Full Mock",
      category: exam.category ?? "",
      durationMinutes: exam.durationMinutes,
      description: exam.description ?? "",
      difficulty: (exam.difficulty as ExamEditorInput["difficulty"]) ?? "Medium",
      isRecommended: exam.isRecommended ?? false,
      minPlan: exam.minPlan ?? (exam.isPremium ? "pro" : "free"),
      scheduledAt: exam.scheduledAt ? new Date(exam.scheduledAt).toISOString().slice(0, 16) : null,
      primaryColor: exam.primaryColor ?? "#0C5BFE",
      icon: exam.icon ?? "clipboard-check",
    } : emptyExam);
  }, [formKey]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, category: form.category?.trim() || null, scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null };
      return exam ? adminExamsApi.update(exam.id, payload) : adminExamsApi.create(payload);
    },
    onSuccess: () => {
      toast.success(exam ? "Exam updated" : "Exam created");
      qc.invalidateQueries({ queryKey: ["exams"] });
      onClose();
    },
    onError: toastApiError,
  });

  const valid = form.title.trim().length >= 3 && form.description.trim().length >= 3 && form.durationMinutes > 0;
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
      <DialogHeader><DialogTitle>{exam ? "Edit mock exam" : "Create mock exam"}</DialogTitle><DialogDescription>Question and mark totals are calculated automatically.</DialogDescription></DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Type"><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Full Mock or Topic Wise" /></Field>
        <Field label="Category"><Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
        <Field label="Duration (minutes)"><Input type="number" min={1} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} /></Field>
        <Field label="Difficulty"><Select value={form.difficulty} onValueChange={(value) => setForm({ ...form, difficulty: value as ExamEditorInput["difficulty"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Easy", "Medium", "Hard"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Minimum plan"><Select value={form.minPlan} onValueChange={(value) => setForm({ ...form, minPlan: value as PlanKey })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="pro_plus">Pro Plus</SelectItem></SelectContent></Select></Field>
        <Field label="Scheduled availability"><Input type="datetime-local" value={form.scheduledAt ?? ""} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value || null })} /></Field>
        <Field label="Accent color"><div className="flex gap-2"><Input type="color" className="w-14 p-1" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} /><Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} /></div></Field>
        <div className="sm:col-span-2"><Field label="Description"><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
        <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3 sm:col-span-2"><div><p className="text-sm font-semibold">Recommended exam</p><p className="text-xs text-muted">Highlight this exam for students.</p></div><Switch checked={form.isRecommended} onCheckedChange={(value) => setForm({ ...form, isRecommended: value })} /></div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid || save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner /> : <Save />} Save exam</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function QuestionManager({ exam, onClose }: { exam: Exam | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ExamAdminQuestion | null>(null);
  const [form, setForm] = useState<ExamQuestionEditorInput>(emptyQuestion);
  const questions = useQuery({ queryKey: ["admin", "exam-questions", exam?.id], queryFn: () => adminExamsApi.questions(exam!.id), enabled: Boolean(exam) });

  function startEdit(question?: ExamAdminQuestion) {
    setEditing(question ?? null);
    setForm(question ? { text: question.text, passage: question.passage ?? "", options: question.options, correctOption: question.correctOption, explanation: question.explanation, topic: question.topic, difficulty: question.difficulty as ExamQuestionEditorInput["difficulty"], marks: question.marks, orderIndex: question.orderIndex } : { ...emptyQuestion, orderIndex: questions.data?.length ?? 0 });
  }

  const save = useMutation({
    mutationFn: () => editing ? adminExamsApi.updateQuestion(editing.id, form) : adminExamsApi.createQuestion(exam!.id, form),
    onSuccess: () => { toast.success(editing ? "Question updated" : "Question added"); qc.invalidateQueries({ queryKey: ["admin", "exam-questions", exam?.id] }); qc.invalidateQueries({ queryKey: ["exams"] }); startEdit(); },
    onError: toastApiError,
  });
  const remove = useMutation({
    mutationFn: adminExamsApi.removeQuestion,
    onSuccess: () => { toast.success("Question deleted"); qc.invalidateQueries({ queryKey: ["admin", "exam-questions", exam?.id] }); qc.invalidateQueries({ queryKey: ["exams"] }); },
    onError: toastApiError,
  });

  const valid = form.text.trim().length >= 3 && form.explanation.trim() && form.topic.trim() && form.options.every((option) => option.text.trim());
  return <Dialog open={Boolean(exam)} onOpenChange={(value) => !value && onClose()}>
    <DialogContent className="max-h-[94vh] max-w-6xl overflow-hidden p-0">
      <DialogHeader className="border-b border-line px-6 py-5"><DialogTitle>{exam?.title} questions</DialogTitle><DialogDescription>{questions.data?.length ?? 0} questions · totals update automatically</DialogDescription></DialogHeader>
      <div className="grid min-h-0 flex-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="max-h-[75vh] overflow-y-auto border-r border-line p-4">
          <Button className="mb-4 w-full" variant="outline" onClick={() => startEdit()}><Plus /> Add question</Button>
          <div className="space-y-2">{questions.isLoading ? <Spinner /> : questions.data?.map((question, index) => <button key={question.id} onClick={() => startEdit(question)} className={`w-full rounded-lg border p-3 text-left transition-colors ${editing?.id === question.id ? "border-brand bg-brand-50" : "border-line hover:bg-surface"}`}><div className="flex gap-3"><span className="text-xs font-bold text-muted">{index + 1}</span><div className="min-w-0"><p className="line-clamp-2 text-sm font-semibold text-ink">{question.text}</p><p className="mt-1 text-xs text-muted">{question.topic} · {question.marks} mark{question.marks === 1 ? "" : "s"}</p></div></div></button>)}</div>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold text-ink">{editing ? "Edit question" : "New question"}</h3><p className="text-xs text-muted">Four-option multiple choice</p></div>{editing ? <Button variant="ghost" size="sm" onClick={() => { if (window.confirm("Delete this question?")) remove.mutate(editing.id); }}><Trash2 className="text-red-500" /> Delete</Button> : null}</div>
          <div className="space-y-4">
            <Field label="Passage (optional)"><Textarea rows={3} value={form.passage ?? ""} onChange={(e) => setForm({ ...form, passage: e.target.value })} /></Field>
            <Field label="Question"><Textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
            <div className="space-y-2"><Label>Options</Label>{form.options.map((option, index) => <div key={option.label} className="flex gap-2"><Button type="button" variant={form.correctOption === option.label ? "default" : "outline"} size="icon" onClick={() => setForm({ ...form, correctOption: option.label })}>{option.label}</Button><Input value={option.text} onChange={(e) => { const options = [...form.options]; options[index] = { ...option, text: e.target.value }; setForm({ ...form, options }); }} /></div>)}</div>
            <Field label="Explanation"><Textarea rows={3} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} /></Field>
            <div className="grid gap-3 sm:grid-cols-3"><Field label="Topic"><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></Field><Field label="Difficulty"><Select value={form.difficulty} onValueChange={(value) => setForm({ ...form, difficulty: value as ExamQuestionEditorInput["difficulty"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Easy", "Medium", "Hard"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></Field><Field label="Marks"><Input type="number" min={1} value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} /></Field></div>
            <Field label="Order"><Input type="number" min={0} value={form.orderIndex} onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })} /></Field>
            <div className="flex justify-end"><Button disabled={!valid || save.isPending} onClick={() => save.mutate()}>{save.isPending ? <Spinner /> : <Save />} {editing ? "Update question" : "Add question"}</Button></div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
