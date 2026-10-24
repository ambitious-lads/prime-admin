"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints";
import {
  clearSession,
  getStoredUser,
  saveSession,
  SESSION_CLEARED_EVENT,
  SESSION_EXPIRED_EVENT,
  type SessionUser,
} from "@/lib/auth/session";

type AuthState = {
  user: SessionUser | null;
  ready: boolean;
  isAdmin: boolean;
  login: (phone: string, password: string) => Promise<SessionUser>;
  setSession: (payload: {
    user: SessionUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);

    const handleSessionCleared = () => setUser(null);
    const handleSessionExpired = () => {
      const current = window.location.pathname;
      const next = current && current !== "/login" ? `?next=${encodeURIComponent(current)}` : "";
      router.replace(`/login${next}`);
    };
    window.addEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(SESSION_CLEARED_EVENT, handleSessionCleared);
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [router]);

  const setSession = useCallback(
    (payload: {
      user: SessionUser;
      accessToken: string;
      refreshToken: string;
    }) => {
      saveSession(payload);
      setUser(payload.user);
    },
    [],
  );

  const login = useCallback(async (phone: string, password: string) => {
    const data = await authApi.login({ phone, password });
    saveSession(data);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      clearSession();
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    clearSession();
    setUser(null);
    router.replace("/");
  }, [router]);

  const refreshUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      ready,
      isAdmin: user?.role === "admin",
      login,
      setSession,
      logout,
      deleteAccount,
      refreshUser,
    }),
    [user, ready, login, setSession, logout, deleteAccount, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
