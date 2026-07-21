"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LeaveTarget = {
  href: string;
  replace?: boolean;
};

export function useSessionLeaveGuard({
  enabled,
  fallbackHref,
  onBeforeLeave,
}: {
  enabled: boolean;
  fallbackHref: string;
  onBeforeLeave?: () => void | Promise<void>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const targetRef = useRef<LeaveTarget | null>(null);
  const bypassRef = useRef(false);

  const currentHref = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;

  const requestLeave = useCallback(
    (href = fallbackHref, options?: { replace?: boolean }) => {
      if (!enabled || bypassRef.current) {
        if (options?.replace) router.replace(href);
        else router.push(href);
        return;
      }

      targetRef.current = { href, replace: options?.replace };
      setOpen(true);
    },
    [enabled, fallbackHref, router],
  );

  const cancelLeave = useCallback(() => {
    if (leaving) return;
    targetRef.current = null;
    setOpen(false);
  }, [leaving]);

  const confirmLeave = useCallback(async () => {
    if (leaving) return;
    setLeaving(true);

    try {
      await onBeforeLeave?.();
    } finally {
      const target = targetRef.current ?? { href: fallbackHref };
      bypassRef.current = true;
      setOpen(false);
      if (target.replace) router.replace(target.href);
      else router.push(target.href);
    }
  }, [fallbackHref, leaving, onBeforeLeave, router]);

  useEffect(() => {
    if (!enabled) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (bypassRef.current) return;
      void onBeforeLeave?.();
      event.preventDefault();
      event.returnValue = "";
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (
        bypassRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.dataset.leaveGuard === "ignore"
      ) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      targetRef.current = {
        href: `${url.pathname}${url.search}${url.hash}`,
      };
      setOpen(true);
    };

    const onPopState = () => {
      if (bypassRef.current) return;
      window.history.pushState(
        { ...window.history.state, __sessionLeaveGuard: true },
        "",
        currentHref,
      );
      targetRef.current = { href: fallbackHref, replace: true };
      setOpen(true);
    };

    window.history.pushState(
      { ...window.history.state, __sessionLeaveGuard: true },
      "",
      currentHref,
    );
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [currentHref, enabled, fallbackHref, onBeforeLeave]);

  return {
    open,
    leaving,
    requestLeave,
    cancelLeave,
    confirmLeave,
  };
}