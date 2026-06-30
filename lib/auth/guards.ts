import { getStoredUser } from "@/lib/auth/session";

export function currentRole() {
  return getStoredUser()?.role ?? null;
}

export function isAuthed() {
  return getStoredUser() !== null;
}

export function isAdmin() {
  return currentRole() === "admin";
}
