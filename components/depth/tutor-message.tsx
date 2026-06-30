"use client";

import { cn } from "@/lib/utils/cn";
import type { TutorMessage as TutorMessageType } from "@/lib/api/types";

export function TutorMessage({ message }: { message: TutorMessageType }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6",
          isUser
            ? "rounded-br-sm bg-brand text-white"
            : "rounded-bl-sm border border-line bg-surface text-ink",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export function TutorPendingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
      </div>
    </div>
  );
}
