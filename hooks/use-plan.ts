"use client";

import { useQuery } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { hasPlanAccess } from "@/lib/utils/plans";
import type { PlanKey } from "@/lib/api/types";

export function usePlan() {
  const query = useQuery({ queryKey: qk.plan, queryFn: plansApi.me });
  const plan = query.data?.plan ?? null;
  return {
    ...query,
    plan,
    can: (required: PlanKey) => hasPlanAccess(plan, required),
  };
}
