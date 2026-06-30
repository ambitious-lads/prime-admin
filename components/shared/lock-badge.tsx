import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { planLabel } from "@/lib/utils/plans";
import type { PlanKey } from "@/lib/api/types";

export function LockBadge({ plan }: { plan: PlanKey }) {
  return (
    <Badge variant="warning">
      <Lock className="h-3 w-3" />
      {planLabel(plan)}
    </Badge>
  );
}
