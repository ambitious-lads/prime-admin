import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PrimeLoadingScreen } from "@/components/shared/prime-loading-screen";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}

export function FullPageSpinner() {
  return <PrimeLoadingScreen />;
}

export function CardGridSkeleton(props: { count?: number }) {
  void props.count;
  return <PrimeLoadingScreen />;
}

export function RowsSkeleton(props: { count?: number }) {
  void props.count;
  return <PrimeLoadingScreen />;
}
