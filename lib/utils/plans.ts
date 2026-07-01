import type { PlanKey } from "@/lib/api/types";

export const PLANS = {
  free: {
    key: "free",
    label: "Free",
    price: 0,
    rank: 0,
    features: [
      "1 free practice set",
      "1 free course resource: note, PDF, or video",
      "Web & mobile access",
    ],
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: 299,
    rank: 1,
    features: [
      "All practice sets",
      "All mock exams",
      "Leaderboards and exam reports",
    ],
  },
  pro_plus: {
    key: "pro_plus",
    label: "Pro Plus",
    price: 499,
    rank: 2,
    features: [
      "Everything in Pro",
      "All courses and resources",
      "AI tutor and smart features",
      "Advanced analytics and UAT calculator",
    ],
  },
} as const satisfies Record<
  PlanKey,
  { key: PlanKey; label: string; price: number; rank: number; features: string[] }
>;

export const EXAM_UNLOCK_PLAN: PlanKey = "pro";
export const ANALYTICS_UNLOCK_PLAN: PlanKey = "pro_plus";
export const COURSE_UNLOCK_PLAN: PlanKey = "pro_plus";
export const TUTOR_UNLOCK_PLAN: PlanKey = "pro_plus";

export function planRank(plan: PlanKey | null | undefined) {
  return plan ? PLANS[plan].rank : -1;
}

export function planLabel(plan: PlanKey | null | undefined) {
  return plan ? PLANS[plan].label : "—";
}

export function hasPlanAccess(
  current: PlanKey | null | undefined,
  required: PlanKey,
) {
  return planRank(current) >= planRank(required);
}

export const PLAN_LIST = [PLANS.free, PLANS.pro, PLANS.pro_plus];
