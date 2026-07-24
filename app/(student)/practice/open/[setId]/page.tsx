"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck } from "lucide-react";
import { practiceApi } from "@/lib/api/endpoints";
import { qk } from "@/lib/query/keys";
import { FullPageSpinner } from "@/components/shared/loading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function SharedPracticeSetResolver() {
  const params = useParams<{ setId: string }>();
  const router = useRouter();
  const setId = params.setId;
  const set = useQuery({
    queryKey: qk.set(setId),
    queryFn: () => practiceApi.set(setId),
    enabled: Boolean(setId),
  });

  useEffect(() => {
    if (!set.data?.topicId) return;
    router.replace(
      `/practice/topic/${set.data.topicId}?openSetId=${encodeURIComponent(set.data.id)}`,
    );
  }, [router, set.data]);

  if (set.isLoading || set.data) return <FullPageSpinner />;

  return (
    <EmptyState
      icon={<BookOpenCheck />}
      title="Practice set unavailable"
      message="This practice set may have been removed or is not available yet."
      action={<Button onClick={() => router.replace("/practice")}>Browse practice</Button>}
    />
  );
}
