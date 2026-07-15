"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorPanel } from "@/components/depth/tutor-panel";
import { usePlan } from "@/hooks/use-plan";
import { TUTOR_UNLOCK_PLAN } from "@/lib/utils/plans";

export default function CourseAiPage() {
  const params = useParams<{ materialId: string }>();
  const materialId = params.materialId;
  const { can } = usePlan();

  if (!can(TUTOR_UNLOCK_PLAN)) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
        <Lock className="h-7 w-7 text-brand" />
        <h1 className="mt-4 text-xl font-bold text-ink">Prime AI is a Pro Plus feature</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Upgrade to ask questions and get lesson-aware explanations.
        </p>
        <Button asChild className="mt-5">
          <Link href="/plans">View plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="-mx-4 -my-6 flex h-[calc(100vh-4rem)] flex-col bg-white sm:-mx-6 lg:-mx-8">
      <header className="flex h-14 shrink-0 items-center border-b border-line px-3 sm:px-5">
        <Button asChild variant="ghost" size="icon" aria-label="Back to material">
          <Link href={`/courses/material/${materialId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="ml-2 text-base font-bold text-ink">Prime AI</h1>
      </header>
      <main className="mx-auto min-h-0 w-full max-w-4xl flex-1">
        <TutorPanel materialId={materialId} />
      </main>
    </div>
  );
}
