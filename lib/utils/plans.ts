import type { PlanKey } from "@/lib/api/types";

export const PLANS = {
  free: {
    key: "free",
    label: "Free",
    price: 0,
    rank: 0,
    features: [
      "Limited practice sets to get started",
      "Selected course lessons and study resources",
      "Basic progress tracking",
    ],
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: 299,
    rank: 1,
    features: [
      "Full access to every practice set",
      "New practice sets added regularly",
      "All realistic mock exams",
      "Leaderboards and detailed exam reports",
      "Limited course lessons and selected resources",
    ],
  },
  pro_plus: {
    key: "pro_plus",
    label: "Pro Plus",
    price: 499,
    rank: 2,
    features: [
      "Everything included in Pro",
      "Full access to every course and new learning materials",
      "AI tutor and smart study tools",
      "Advanced analytics and UAT score calculator",
      "The complete Prime UAT preparation experience",
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
