import type { SessionUser } from "@/lib/api/types";

const ACCESS_KEY = "prime.access";
const REFRESH_KEY = "prime.refresh";
const USER_KEY = "prime.user";
const ROLE_COOKIE = "prime.role";
export const SESSION_CLEARED_EVENT = "prime:session-cleared";

export type { SessionUser };

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function setRoleCookie(role: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function saveSession(payload: {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}) {
  localStorage.setItem(ACCESS_KEY, payload.accessToken);
  localStorage.setItem(REFRESH_KEY, payload.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  setRoleCookie(payload.user.role);
}

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  clearRoleCookie();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
  }
}
