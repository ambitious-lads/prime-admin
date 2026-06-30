"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-line bg-white text-ink shadow-lg font-sans",
          description: "text-muted",
          actionButton: "bg-brand text-white",
          cancelButton: "bg-surface text-muted",
        },
      }}
    />
  );
}
