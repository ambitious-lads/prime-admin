"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function FlagButton({
  flagged,
  onToggle,
}: {
  flagged: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onToggle}
      className={cn(
        flagged && "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
      )}
    >
      <Flag className={cn("h-4 w-4", flagged && "fill-amber-500 text-amber-500")} />
      {flagged ? "Flagged" : "Flag"}
    </Button>
  );
}
