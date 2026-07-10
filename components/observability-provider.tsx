"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { useAuth } from "@/hooks/use-auth";
import {
  captureEvent,
  identifyUser,
  initPostHog,
  resetUser,
} from "@/lib/observability/posthog";

export function ObservabilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { ready, user } = useAuth();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    captureEvent("$pageview", {
      path: pathname,
      url: typeof window === "undefined" ? pathname : window.location.href,
    });
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;

    if (user) {
      Sentry.setUser({ id: user.id });
      identifyUser(user);
      return;
    }

    Sentry.setUser(null);
    resetUser();
  }, [ready, user]);

  return children;
}
