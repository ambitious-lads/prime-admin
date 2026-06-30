"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEVICE_CONFLICT_EVENT } from "@/lib/api/client";

export function DeviceConflictWatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onConflict() {
      if (!pathname.startsWith("/device")) {
        router.push("/device?conflict=1");
      }
    }
    window.addEventListener(DEVICE_CONFLICT_EVENT, onConflict);
    return () => window.removeEventListener(DEVICE_CONFLICT_EVENT, onConflict);
  }, [router, pathname]);

  return null;
}
