"use client";

import { useEffect, useState } from "react";
import { PrimeLoadingScreen } from "@/components/shared/prime-loading-screen";

const INITIAL_SPLASH_MS = 850;

export function InitialLoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), INITIAL_SPLASH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return visible ? <PrimeLoadingScreen /> : null;
}
