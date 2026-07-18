"use client";

import { QueryProvider } from "@/lib/query/provider";
import { AuthProvider } from "@/hooks/use-auth";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { DeviceConflictWatcher } from "@/components/shared/device-conflict-watcher";
import { ObservabilityProvider } from "@/components/observability-provider";
import { MobileAppPrompt } from "@/components/shared/mobile-app-prompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ObservabilityProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <DeviceConflictWatcher />
            <MobileAppPrompt />
            <Toaster />
          </TooltipProvider>
        </ObservabilityProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
