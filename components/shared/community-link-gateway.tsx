"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExternalLink, Monitor, Smartphone } from "lucide-react";
import {
  communityAppDestination,
  communityWebDestination,
  type CommunityContentKind,
} from "@/lib/community-links";
import { Button } from "@/components/ui/button";

const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.primely.app";
const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || "";

export function CommunityLinkGateway({
  kind,
  id,
}: {
  kind: CommunityContentKind;
  id: string;
}) {
  const router = useRouter();
  const [mobile, setMobile] = useState<boolean | null>(null);
  const [isIos, setIsIos] = useState(false);
  const appUrl = useMemo(() => communityAppDestination(kind, id), [id, kind]);
  const webUrl = useMemo(() => communityWebDestination(kind, id), [id, kind]);

  useEffect(() => {
    const onMobile =
      window.matchMedia("(max-width: 768px)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const timer = window.setTimeout(() => {
      setMobile(onMobile);
      setIsIos(/iPhone|iPad|iPod/i.test(navigator.userAgent));
      if (onMobile) window.location.assign(appUrl);
      else router.replace(webUrl);
    }, onMobile ? 120 : 0);
    return () => window.clearTimeout(timer);
  }, [appUrl, router, webUrl]);

  const storeUrl = isIos ? APP_STORE_URL : PLAY_STORE_URL;

  if (mobile === false || mobile === null) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F8F9FE]">
        <span className="sr-only">Opening Prime UAT</span>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#F8F9FE] px-5 py-10">
      <section className="w-full max-w-sm text-center">
        <Image
          src="/images/logo.png"
          alt="Prime UAT"
          width={80}
          height={80}
          priority
          className="mx-auto h-20 w-20 object-contain"
        />
        <h1 className="mt-5 text-2xl font-black text-ink">Open in Prime UAT</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Continue directly to this {kind === "mock" ? "mock test" : kind}.
        </p>
        <div className="mt-7 grid gap-3">
          <Button
            size="lg"
            className="h-12 w-full"
            onClick={() => window.location.assign(appUrl)}
          >
            <Smartphone /> Open app
          </Button>
          {storeUrl ? (
            <Button variant="outline" size="lg" className="h-12 w-full" asChild>
              <a href={storeUrl}>
                <ExternalLink /> Install Prime UAT
              </a>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="lg"
            className="h-12 w-full"
            onClick={() => router.replace(webUrl)}
          >
            <Monitor /> Continue on web
          </Button>
        </div>
      </section>
    </main>
  );
}
