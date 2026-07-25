import { NextResponse } from "next/server";

export function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  const appId = teamId ? `${teamId}.com.primely.app` : "";
  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: appId
          ? [{ appID: appId, paths: ["/open/*", "/r/*"] }]
          : [],
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/json",
      },
    },
  );
}
