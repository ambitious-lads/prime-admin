import { site } from "@/config/site";

export type PublicCommunity = {
  registeredUsers: number;
  displayedCommunitySize: number;
  recentMembers: {
    id: string;
    displayName: string;
    avatarUrl: string;
    joinedAt: string;
  }[];
};

const fallback: PublicCommunity = {
  registeredUsers: 0,
  displayedCommunitySize: 2524,
  recentMembers: [],
};

export async function getPublicCommunity(): Promise<PublicCommunity> {
  try {
    const response = await fetch(`${site.apiBaseUrl}/public/community`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return fallback;
    const json = await response.json();
    return json?.data ?? fallback;
  } catch {
    return fallback;
  }
}
