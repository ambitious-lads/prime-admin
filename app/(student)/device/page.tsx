"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Smartphone, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { useDevice } from "@/hooks/use-device";
import { PageHeader } from "@/components/shared/page-header";
import { DeviceConflict } from "@/components/shared/device-conflict";
import { FullPageSpinner } from "@/components/shared/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function DeviceInner() {
  const params = useSearchParams();
  const device = useDevice();

  if (params.get("conflict") === "1") {
    return <DeviceConflict />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Your device"
        subtitle="Prime UAT keeps your account secure on one device at a time."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-brand" /> This device
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-line bg-surface/50 p-4">
            <p className="text-xs font-semibold text-muted">Device name</p>
            <p className="mt-1 font-semibold text-ink">
              {device.name ?? "This browser"}
            </p>
            <p className="mt-3 text-xs font-semibold text-muted">Device ID</p>
            <p className="mt-1 break-all font-mono text-xs text-muted">
              {device.id ?? "—"}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p className="text-sm text-ink/80">
              Your subscription works on one device at a time to keep your account
              secure — so no one can share or steal it. To move to a new device,
              contact support for a reset.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <a href={site.supportTelegramUrl} target="_blank" rel="noreferrer">
              <MessageCircle /> Contact support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DevicePage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <DeviceInner />
    </Suspense>
  );
}
