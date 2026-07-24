import { notFound } from "next/navigation";
import { CommunityLinkGateway } from "@/components/shared/community-link-gateway";
import type { CommunityContentKind } from "@/lib/community-links";

const KINDS = new Set<CommunityContentKind>(["course", "practice", "mock"]);

export default async function CommunityOpenPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = await params;
  if (!KINDS.has(kind as CommunityContentKind) || !id) notFound();

  return (
    <CommunityLinkGateway
      kind={kind as CommunityContentKind}
      id={id}
    />
  );
}
