"use client";

import { useState } from "react";
import { MessageCircle, ShieldAlert, ArrowLeftRight } from "lucide-react";
import { site } from "@/config/site";
import { useDevice } from "@/hooks/use-device";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeviceQr } from "@/components/shared/device-qr";

export function DeviceConflict() {
  const device = useDevice();
  const [showTransfer, setShowTransfer] = useState(false);

  const payload = JSON.stringify({
    deviceId: device.id,
    deviceName: device.name,
    app: "prime-uat-web",
  });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold font-display text-ink">
        Your subscription is active on another device
      </h1>
      <p className="mt-3 text-sm text-muted">
        To keep your account secure, Prime UAT works on one device at a time. To
        use it here, transfer your subscription to this device or contact support
        for a reset.
      </p>

      {showTransfer ? (
        <Card className="mt-8 w-full">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <p className="text-sm font-medium text-ink">
              Scan this code from your currently active device
            </p>
            <DeviceQr payload={payload} />
            <p className="text-xs text-muted">
              Open Prime UAT on your bound device → Settings → Devices → Move my
              subscription, then scan this code. Once moved, sign in again here.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Button
          className="flex-1"
          variant={showTransfer ? "outline" : "default"}
          onClick={() => setShowTransfer((v) => !v)}
        >
          <ArrowLeftRight className="h-4 w-4" />
          {showTransfer ? "Hide transfer code" : "Transfer to this device"}
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <a href={site.supportTelegramUrl} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" />
            Contact support
          </a>
        </Button>
      </div>
    </div>
  );
}
