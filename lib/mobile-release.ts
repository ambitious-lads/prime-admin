import { apiBaseUrl } from "@/config/site";

export const API_BASE_URL = apiBaseUrl;

export const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.primely.app";
export const MOBILE_RELEASE_URL = `${API_BASE_URL}/public/mobile-release`;

export type PlatformRelease = {
  latestVersion: string;
  minimumSupportedVersion: string;
  mandatory: boolean;
  downloadUrl: string | null;
  storeUrl: string | null;
  storeAvailable: boolean;
  storeExpectedAt: string | null;
  releaseNotes: string[];
  sha256: string | null;
  sizeBytes: number | null;
};

export type MobileReleaseConfig = {
  android: PlatformRelease;
  ios: PlatformRelease;
  checkedAt: string;
};

export async function fetchMobileRelease() {
  const response = await fetch(MOBILE_RELEASE_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Release configuration unavailable");
  const body = await response.json();
  return body.data as MobileReleaseConfig;
}
