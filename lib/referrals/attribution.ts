"use client";

const PENDING_REFERRAL_KEY = "prime.pending-referral";

export function normalizeReferralCode(value?: string | null) {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function savePendingReferralCode(value?: string | null) {
  if (typeof window === "undefined") return "";
  const code = normalizeReferralCode(value);
  if (code.length < 4) return "";
  window.localStorage.setItem(PENDING_REFERRAL_KEY, code);
  return code;
}

export function getPendingReferralCode() {
  if (typeof window === "undefined") return "";
  return normalizeReferralCode(window.localStorage.getItem(PENDING_REFERRAL_KEY));
}

export function clearPendingReferralCode() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_REFERRAL_KEY);
}
