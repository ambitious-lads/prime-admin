import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
};

export function StatCard({ label, value, delta, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-bold font-display tabular-nums text-ink">
            {value}
          </p>
          {delta ? (
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-600",
                trend === "down" && "text-red-600",
                (!trend || trend === "flat") && "text-muted",
              )}
            >
              {delta}
            </span>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand [&_svg]:size-5">
            {icon}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
