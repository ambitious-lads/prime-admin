"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function DeviceQr({ payload }: { payload: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      QRCode.toCanvas(ref.current, payload, { width: 200, margin: 1 }).catch(
        () => {},
      );
    }
  }, [payload]);

  return (
    <canvas
      ref={ref}
      aria-label="Device transfer QR code"
      className="rounded-xl border border-line"
    />
  );
}
