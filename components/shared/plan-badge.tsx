import { Badge } from "@/components/ui/badge";
import { planLabel } from "@/lib/utils/plans";
import type { PlanKey } from "@/lib/api/types";

export function PlanBadge({ plan }: { plan: PlanKey | null | undefined }) {
  if (!plan || plan === "free") {
    return <Badge variant="secondary">Free</Badge>;
  }
  if (plan === "pro") {
    return <Badge variant="soft">{planLabel(plan)}</Badge>;
  }
  return <Badge variant="default">{planLabel(plan)}</Badge>;
}
