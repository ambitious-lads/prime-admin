import { Badge } from "@/components/ui/badge";
import { planLabel } from "@/lib/utils/plans";
import type { PlanKey } from "@/lib/api/types";

export function PlanBadge({ plan }: { plan: PlanKey | null | undefined }) {
  if (!plan || plan === "free") {
    return <Badge variant="soft" className="border border-brand/15 bg-brand-50 px-3 py-1 text-brand">Free</Badge>;
  }
  if (plan === "pro") {
    return <Badge variant="soft">{planLabel(plan)}</Badge>;
  }
  return <Badge variant="default">{planLabel(plan)}</Badge>;
}
