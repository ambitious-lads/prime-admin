"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/shared/loading";
import { TutorMessage, TutorPendingBubble } from "@/components/depth/tutor-message";
import { coursesApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { toastApiError } from "@/hooks/use-api-error";
import type { TutorSession } from "@/lib/api/types";

export function TutorPanel({ materialId }: { materialId: string }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const session = useQuery({
    queryKey: qk.tutor(materialId),
    queryFn: () => coursesApi.tutorGet(materialId),
  });

  const messages = session.data?.messages ?? [];

  const send = useMutation({
    mutationFn: (message: string) => coursesApi.tutorSend(materialId, message),
    onSuccess: (data: TutorSession) => {
      queryClient.setQueryData(qk.tutor(materialId), data);
    },
    onError: toastApiError,
  });

  const clear = useMutation({
    mutationFn: () => coursesApi.tutorClear(materialId),
    onSuccess: () => {
      queryClient.setQueryData<TutorSession>(qk.tutor(materialId), { messages: [] });
    },
    onError: toastApiError,
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, send.isPending]);

  function submit() {
    const value = draft.trim();
    if (!value || send.isPending) return;
    if (value.length > 2000) {
      toastApiError(new Error("Message is too long (max 2000 characters)."));
      return;
    }
    setDraft("");
    send.mutate(value);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-bold text-ink">AI Tutor</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => clear.mutate()}
          disabled={clear.isPending || messages.length === 0}
        >
          {clear.isPending ? <Spinner /> : <Trash2 className="h-4 w-4" />}
          Clear
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {session.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-brand" />
          </div>
        ) : messages.length === 0 && !send.isPending ? (
          <div className="flex h-full flex-col items-center justify-center px-2 text-center">
            <Sparkles className="mb-3 h-6 w-6 text-brand" />
            <p className="text-sm font-semibold text-ink">Ask the tutor</p>
            <p className="mt-1 text-xs text-muted">
              Get instant help understanding this material.
            </p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <TutorMessage key={m.id} message={m} />
            ))}
            {send.isPending && <TutorPendingBubble />}
          </>
        )}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask about this material…"
            rows={1}
            className="max-h-32 min-h-10 resize-none"
          />
          <Button
            size="icon"
            onClick={submit}
            disabled={send.isPending || draft.trim().length === 0}
          >
            {send.isPending ? <Spinner /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
