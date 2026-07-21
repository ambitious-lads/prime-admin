"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function ReturningUserRedirect() {
  const router = useRouter();
  const { ready, user } = useAuth();

  useEffect(() => {
    if (!ready || !user) return;
    router.replace(user.role === "admin" ? "/admin" : "/practice");
  }, [ready, router, user]);

  return null;
}