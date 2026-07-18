import { profileApi } from "@/lib/api/endpoints";
import type { SessionUser } from "@/lib/auth/session";

export async function resolvePostAuthRoute(user: SessionUser) {
  if (user.role === "admin") return "/admin";

  try {
    const response = await profileApi.me();
    const profile = response.profile;
    const isComplete = Boolean(
      profile?.schoolName?.trim() &&
        profile?.region?.trim() &&
        profile?.stream &&
        profile?.whereDidYouHearAboutUs?.trim(),
    );

    return isComplete ? "/dashboard" : "/complete-profile";
  } catch {
    return "/complete-profile";
  }
}
