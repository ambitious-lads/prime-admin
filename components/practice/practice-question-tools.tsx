"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Calculator,
  Flag,
  Layers3,
  Lightbulb,
  MessageCircle,
  Send,
  Sparkles,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { practiceApi, savedApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import type {
  Question,
  QuestionAiAction,
  QuestionAiChatMessage,
  QuestionReportReason,
} from "@/lib/api/types";
import { toastApiError } from "@/hooks/use-api-error";
import { usePlan } from "@/hooks/use-plan";
import { TUTOR_UNLOCK_PLAN } from "@/lib/utils/plans";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/shared/loading";
import { cn } from "@/lib/utils/cn";

const AI_ACTIONS: Array<{
  action: QuestionAiAction;
  label: string;
  description: string;
  icon: typeof Sparkles;
}> = [
  { action: "explain", label: "Explain concept", description: "Break down the reasoning step by step", icon: Lightbulb },
  { action: "similar_questions", label: "Similar questions", description: "Build a short drill for this skill", icon: Layers3 },
  { action: "formulas", label: "Formulas and rules", description: "Show the key formulas or reasoning patterns", icon: Calculator },
  { action: "summary", label: "Quick summary", description: "Get the fastest way to approach this question", icon: Sparkles },
  { action: "youtube_video", label: "Video recommendation", description: "Find a focused YouTube explanation", icon: Video },
];

const REPORT_REASONS: Array<{ value: QuestionReportReason; label: string }> = [
  { value: "incorrect_answer", label: "Answer is incorrect" },
  { value: "needs_correction", label: "Question needs correction" },
  { value: "unclear_question", label: "Question is unclear" },
  { value: "bad_explanation", label: "Explanation has an issue" },
  { value: "other", label: "Other" },
];

export function PracticeQuestionTools({ question }: { question: Question }) {
  const queryClient = useQueryClient();
  const { can } = usePlan();
  const hasAiAccess = can(TUTOR_UNLOCK_PLAN);
  const [reportOpen, setReportOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [reason, setReason] = useState<QuestionReportReason>("needs_correction");
  const [comment, setComment] = useState("");
  const [activeAction, setActiveAction] = useState<QuestionAiAction | null>(null);
  const [aiReply, setAiReply] = useState("");
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<QuestionAiChatMessage[]>([]);

  const savedQuestions = useQuery({
    queryKey: qk.savedQuestions,
    queryFn: savedApi.questions,
  });
  const isSaved = useMemo(
    () => savedQuestions.data?.some((saved) => saved.questionId === question.id || saved.id === question.id) ?? false,
    [question.id, savedQuestions.data],
  );

  const toggleSaved = useMutation({
    mutationFn: () =>
      isSaved
        ? practiceApi.unsaveQuestion(question.id)
        : practiceApi.saveQuestion(question.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: qk.savedQuestions });
      toast.success(isSaved ? "Removed from saved questions" : "Question saved");
    },
    onError: toastApiError,
  });

  const report = useMutation({
    mutationFn: () => practiceApi.reportQuestion(question.id, { reason, comment: comment.trim() }),
    onSuccess: () => {
      toast.success("Question report submitted");
      setComment("");
      setReportOpen(false);
    },
    onError: toastApiError,
  });

  const aiHelp = useMutation({
    mutationFn: (action: QuestionAiAction) => practiceApi.questionAiHelp(question.id, action),
    onMutate: (action) => {
      setActiveAction(action);
      setAiReply("");
    },
    onSuccess: (data) => setAiReply(data.reply),
    onError: toastApiError,
  });

  const aiChat = useMutation({
    mutationFn: (message: string) => practiceApi.questionAiChat(question.id, message, history),
    onSuccess: (data, message) => {
      setHistory((current) => [
        ...current,
        { role: "user", text: message },
        { role: "assistant", text: data.reply },
      ]);
      setDraft("");
    },
    onError: toastApiError,
  });

  function sendMessage() {
    const message = draft.trim();
    if (!message || aiChat.isPending) return;
    aiChat.mutate(message);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white p-2 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
        <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={() => toggleSaved.mutate()} disabled={toggleSaved.isPending || savedQuestions.isLoading}>
          {toggleSaved.isPending ? <Spinner /> : isSaved ? <BookmarkCheck className="h-4 w-4 text-brand" /> : <Bookmark className="h-4 w-4" />}
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={() => setReportOpen(true)}>
          <Flag className="h-4 w-4" /> Report
        </Button>
        <Button type="button" variant="ghost" size="sm" className="cursor-pointer text-brand hover:text-brand" onClick={() => setAiOpen(true)}>
          <Sparkles className="h-4 w-4" /> Ask Prime AI
        </Button>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Report this question</DialogTitle>
            <DialogDescription>Tell us what needs attention. Reports go directly to the content review queue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block space-y-1.5 text-sm font-semibold text-ink">
              Issue
              <select value={reason} onChange={(event) => setReason(event.target.value as QuestionReportReason)} className="h-10 w-full cursor-pointer rounded-lg border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">
                {REPORT_REASONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm font-semibold text-ink">
              Details
              <Textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} maxLength={1000} placeholder="Describe the problem clearly..." />
            </label>
            <Button className="w-full cursor-pointer" onClick={() => report.mutate()} disabled={comment.trim().length < 3 || report.isPending}>
              {report.isPending ? <Spinner /> : <Flag className="h-4 w-4" />} Submit report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden p-0">
          <DialogHeader className="border-b border-line px-5 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-brand" /> Prime AI for this question</DialogTitle>
            <DialogDescription>Get an explanation, targeted drill, formulas, summary, or a focused video recommendation.</DialogDescription>
          </DialogHeader>

          {!hasAiAccess ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand"><Sparkles className="h-6 w-6" /></span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">Prime AI requires Pro Plus</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted">Unlock question-aware explanations, similar drills, formulas, summaries, and course tutoring.</p>
              <Button asChild className="mt-5"><Link href="/plans">View Pro Plus</Link></Button>
            </div>
          ) : (
            <div className="grid min-h-0 flex-1 md:grid-cols-[230px_minmax(0,1fr)]">
              <div className="space-y-1 border-b border-line bg-surface/40 p-3 md:border-b-0 md:border-r">
                {AI_ACTIONS.map(({ action, label, description, icon: Icon }) => (
                  <button key={action} type="button" onClick={() => aiHelp.mutate(action)} disabled={aiHelp.isPending} className={cn("flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 text-left transition-colors", activeAction === action ? "bg-brand text-white" : "hover:bg-white")}>
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span><span className="block text-sm font-bold">{label}</span><span className={cn("mt-0.5 block text-[11px] leading-4", activeAction === action ? "text-white/75" : "text-muted")}>{description}</span></span>
                  </button>
                ))}
              </div>

              <div className="flex min-h-[380px] flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  {!activeAction && history.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center"><MessageCircle className="h-7 w-7 text-brand" /><p className="mt-3 text-sm font-bold text-ink">Choose an AI action or ask your own question</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted">Prime AI uses the current question, options, answer, and explanation as context.</p></div>
                  ) : null}
                  {aiHelp.isPending ? <div className="flex items-center gap-2 rounded-xl bg-brand-50 p-4 text-sm font-semibold text-brand"><Spinner /> Generating focused help...</div> : null}
                  {aiReply ? <div className="whitespace-pre-wrap rounded-xl border border-line bg-white p-4 text-sm leading-7 text-ink">{aiReply}</div> : null}
                  {history.map((message, index) => <div key={`${message.role}-${index}`} className={cn("max-w-[90%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6", message.role === "user" ? "ml-auto bg-brand text-white" : "bg-surface text-ink")}>{message.text}</div>)}
                  {aiChat.isPending ? <div className="flex items-center gap-2 text-sm text-muted"><Spinner /> Prime AI is thinking...</div> : null}
                </div>
                <div className="border-t border-line p-3">
                  <div className="flex items-end gap-2">
                    <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} className="max-h-28 min-h-10 resize-none" placeholder="Ask about this question..." />
                    <Button size="icon" className="cursor-pointer" onClick={sendMessage} disabled={!draft.trim() || aiChat.isPending}>{aiChat.isPending ? <Spinner /> : <Send className="h-4 w-4" />}</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}