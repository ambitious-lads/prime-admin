"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { FullPageSpinner } from "@/components/shared/loading";
import { profileApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { resolvePostAuthRoute } from "@/lib/auth/post-auth-route";

export function RequireUser({
  children,
  enforceProfile = true,
}: {
  children: React.ReactNode;
  enforceProfile?: boolean;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const profile = useQuery({
    queryKey: qk.profile,
    queryFn: profileApi.me,
    enabled: ready && Boolean(user) && enforceProfile,
  });

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!enforceProfile || !profile.data || pathname === "/complete-profile") {
      return;
    }
    const details = profile.data.profile;
    const complete = Boolean(
      details?.schoolName?.trim() &&
        details?.region?.trim() &&
        details?.stream &&
        details?.whereDidYouHearAboutUs?.trim(),
    );
    if (!complete) router.replace("/complete-profile");
  }, [enforceProfile, pathname, profile.data, router]);

  if (!ready || !user || (enforceProfile && profile.isLoading)) {
    return <FullPageSpinner />;
  }

  if (enforceProfile && profile.data) {
    const details = profile.data.profile;
    const complete = Boolean(
      details?.schoolName?.trim() &&
        details?.region?.trim() &&
        details?.stream &&
        details?.whereDidYouHearAboutUs?.trim(),
    );
    if (!complete) return <FullPageSpinner />;
  }

  return <>{children}</>;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready || !user) return;

    let cancelled = false;
    void resolvePostAuthRoute(user).then((route) => {
      if (!cancelled) router.replace(route);
    });

    return () => {
      cancelled = true;
    };
  }, [ready, router, user]);

  if (!ready || user) return <FullPageSpinner />;
  return <>{children}</>;
}
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user?.role !== "admin") router.replace("/login");
  }, [ready, user, router]);

  if (!ready || user?.role !== "admin") return <FullPageSpinner />;
  return <>{children}</>;
}
