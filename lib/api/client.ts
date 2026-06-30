import { site } from "@/config/site";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/lib/auth/session";
import { getDeviceId, getDeviceName } from "@/lib/device/device-id";

export class ApiError extends Error {
  status: number;
  code?: string;
  retryAfter?: number;
  constructor(status: number, message: string, code?: string, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export class DeviceConflictError extends ApiError {
  constructor(message: string) {
    super(403, message, "DEVICE_CONFLICT");
    this.name = "DeviceConflictError";
  }
}

export const DEVICE_CONFLICT_EVENT = "prime:device-conflict";

function emitDeviceConflict() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DEVICE_CONFLICT_EVENT));
  }
}

type Options = {
  method?: string;
  body?: unknown;
  form?: FormData;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined>;
};

function buildUrl(path: string, query?: Options["query"]) {
  const url = new URL(site.apiBaseUrl + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function deviceHeaders() {
  const id = getDeviceId();
  const name = getDeviceName();
  const headers: Record<string, string> = {};
  if (id) headers["X-Device-Id"] = id;
  if (name) headers["X-Device-Name"] = name;
  return headers;
}

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const res = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...deviceHeaders() },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const json = await res.json().catch(() => null);
  if (!json?.data?.accessToken) return false;
  saveTokens(json.data.accessToken, json.data.refreshToken);
  return true;
}

async function raw<T>(path: string, opts: Options, retry = true): Promise<T> {
  const headers: Record<string, string> = { ...deviceHeaders() };
  if (opts.auth !== false) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    headers,
    body,
  });

  const json = await res.json().catch(() => ({}));

  if (res.ok) return (json?.data ?? null) as T;

  const code = json?.errors?.[0]?.code as string | undefined;
  const message = json?.message ?? "Something went wrong. Please try again.";

  if (code === "DEVICE_CONFLICT") {
    emitDeviceConflict();
    throw new DeviceConflictError(message);
  }

  if (res.status === 401 && retry && opts.auth !== false) {
    const ok = await refreshTokens();
    if (ok) return raw<T>(path, opts, false);
    clearSession();
  }

  const retryAfter = Number(res.headers.get("Retry-After")) || undefined;
  throw new ApiError(res.status, message, code, retryAfter);
}

export const api = {
  get: <T>(path: string, query?: Options["query"]) =>
    raw<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) =>
    raw<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    raw<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) =>
    raw<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => raw<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData, method = "POST") =>
    raw<T>(path, { method, form }),
  public: {
    post: <T>(path: string, body?: unknown) =>
      raw<T>(path, { method: "POST", body, auth: false }),
  },
};
