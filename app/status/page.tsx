import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Server,
} from "lucide-react";
import { site } from "@/config/site";

export const dynamic = "force-dynamic";

type HealthPayload = {
  status?: string;
  service?: string;
  version?: string;
  environment?: string;
  uptimeSeconds?: number;
  timestamp?: string;
  checks?: Record<string, "UP" | "DOWN">;
};

type HealthResult = {
  ok: boolean;
  statusCode?: number;
  payload?: HealthPayload;
  error?: string;
};

function apiHealthUrl() {
  const base = site.apiBaseUrl.replace(/\/api(?:\/v1)?\/?$/, "");
  return `${base}/health?deep=1`;
}

async function fetchHealth(): Promise<HealthResult> {
  try {
    const response = await fetch(apiHealthUrl(), {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const payload = (await response.json().catch(() => null)) as HealthPayload | null;
    return {
      ok: response.ok,
      statusCode: response.status,
      payload: payload ?? undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Health check failed",
    };
  }
}

function formatUptime(seconds?: number) {
  if (!seconds) return "Unknown";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default async function StatusPage() {
  const health = await fetchHealth();
  const status = health.payload?.status ?? (health.ok ? "UP" : "DOWN");
  const checks = health.payload?.checks ?? { api: health.ok ? "UP" : "DOWN" };
  const isHealthy = health.ok && status !== "DOWN";

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-ink sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-brand">
              Prime UAT
            </Link>
            <h1 className="mt-3 font-display text-3xl font-bold">
              System status
            </h1>
            <p className="mt-2 text-sm text-muted">
              Live API, database, and service health for Prime UAT.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              isHealthy
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {isHealthy ? "Operational" : "Degraded"}
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5">
            <Server className="h-5 w-5 text-brand" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Service
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {health.payload?.service ?? "primely-api"}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <Clock3 className="h-5 w-5 text-brand" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Uptime
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {formatUptime(health.payload?.uptimeSeconds)}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <Activity className="h-5 w-5 text-brand" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Last check
            </p>
            <p className="mt-1 font-display text-lg font-bold">
              {health.payload?.timestamp
                ? new Date(health.payload.timestamp).toLocaleString()
                : "Just now"}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Checks</h2>
              <p className="mt-1 text-sm text-muted">
                Deep health checks run against the API and database.
              </p>
            </div>
            <span className="text-sm font-medium text-muted">
              HTTP {health.statusCode ?? "unreachable"}
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {Object.entries(checks).map(([name, value]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-semibold capitalize">
                  {name === "database" ? (
                    <Database className="h-4 w-4 text-brand" />
                  ) : (
                    <Server className="h-4 w-4 text-brand" />
                  )}
                  {name}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    value === "UP"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {health.error ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {health.error}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
