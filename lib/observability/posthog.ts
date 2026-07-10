"use client";

import posthog from "posthog-js";
import type { SessionUser } from "@/lib/auth/session";

let initialized = false;

function publicPostHogKey() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_API_KEY ||
    ""
  );
}

export function initPostHog() {
  if (initialized || typeof window === "undefined") return initialized;

  const key = publicPostHogKey();
  if (!key) return false;

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    persistence: "localStorage",
  });
  initialized = true;
  return true;
}

export function captureEvent(
  event: string,
  properties: Record<string, unknown> = {},
) {
  if (!initPostHog()) return;
  posthog.capture(event, {
    app: "prime-web",
    ...properties,
  });
}

export function identifyUser(user: SessionUser) {
  if (!initPostHog()) return;
  posthog.identify(user.id, {
    role: user.role,
  });
}

export function resetUser() {
  if (!initialized) return;
  posthog.reset();
}
