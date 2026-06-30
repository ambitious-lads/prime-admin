"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { plansApi, authApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";

export function useAdminMetrics() {
  const approved = useQuery({
    queryKey: qk.payments("approved"),
    queryFn: () => plansApi.payments("approved"),
  });
  const pending = useQuery({
    queryKey: qk.payments("pending"),
    queryFn: () => plansApi.payments("pending"),
  });
  const users = useQuery({ queryKey: qk.users, queryFn: authApi.users });

  return useMemo(() => {
    const approvedList = approved.data ?? [];
    const pendingList = pending.data ?? [];
    const userList = users.data ?? [];

    const now = new Date();
    const monthRevenue = approvedList
      .filter((p) => {
        const d = new Date(p.reviewedAt ?? p.updatedAt ?? p.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    const revenue = approvedList.reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const pendingRevenue = pendingList.reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0,
    );
    const total = userList.length;
    const subscribers = userList.filter((u) => u.plan && u.plan !== "free").length;
    const locked = userList.filter((u) => u.boundDeviceId).length;

    const signupBuckets = new Map<string, number>();
    for (const u of userList) {
      if (!u.createdAt) continue;
      const key = new Date(u.createdAt).toISOString().slice(0, 10);
      signupBuckets.set(key, (signupBuckets.get(key) ?? 0) + 1);
    }
    const signups = Array.from(signupBuckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return {
      revenue,
      monthRevenue,
      pendingRevenue,
      pendingCount: pendingList.length,
      total,
      subscribers,
      locked,
      conversion: total ? Math.round((subscribers / total) * 100) : 0,
      signups,
      approvedList,
      loading: approved.isLoading || users.isLoading || pending.isLoading,
    };
  }, [approved.data, pending.data, users.data, approved.isLoading, users.isLoading, pending.isLoading]);
}
