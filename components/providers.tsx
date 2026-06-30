"use client";

import { QueryProvider } from "@/lib/query/provider";
import { AuthProvider } from "@/hooks/use-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DeviceConflictWatcher } from "@/components/shared/device-conflict-watcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <DeviceConflictWatcher />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
