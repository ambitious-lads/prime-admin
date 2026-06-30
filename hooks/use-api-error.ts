"use client";

import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

export function apiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      const seconds = error.retryAfter ?? 0;
      return seconds
        ? `You're going a bit fast — try again in ${seconds}s.`
        : "You're going a bit fast — please slow down.";
    }
    if (error.status === 401) return "Your session expired. Please sign in again.";
    if (error.status === 403) return error.message || "You don't have access to this.";
    if (error.status === 500) return "Something went wrong on our side.";
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function toastApiError(error: unknown) {
  toast.error(apiErrorMessage(error));
}
