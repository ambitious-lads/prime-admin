"use client";

import { useEffect, useState } from "react";
import { getDeviceId, getDeviceName } from "@/lib/device/device-id";

export function useDevice() {
  const [device, setDevice] = useState<{ id: string | null; name: string | null }>({
    id: null,
    name: null,
  });

  useEffect(() => {
    setDevice({ id: getDeviceId(), name: getDeviceName() });
  }, []);

  return device;
}
