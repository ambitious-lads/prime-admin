import { absoluteUrl } from "@/lib/seo";

export type CommunityContentKind = "course" | "practice" | "mock";

export function communityPath(kind: CommunityContentKind, id: string) {
  return `/open/${kind}/${encodeURIComponent(id)}`;
}

export function communityUrl(kind: CommunityContentKind, id: string) {
  if (typeof window !== "undefined") {
    return new URL(communityPath(kind, id), window.location.origin).toString();
  }
  return absoluteUrl(communityPath(kind, id));
}

export function communityWebDestination(
  kind: CommunityContentKind,
  id: string,
) {
  const encodedId = encodeURIComponent(id);
  if (kind === "course") return `/courses/${encodedId}`;
  if (kind === "practice") return `/practice/open/${encodedId}`;
  return `/exams/${encodedId}`;
}

export function communityAppDestination(
  kind: CommunityContentKind,
  id: string,
) {
  return `primely://open/${kind}/${encodeURIComponent(id)}`;
}
